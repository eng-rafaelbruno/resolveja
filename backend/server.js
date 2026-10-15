const express = require('express');
const cors = require('cors');
const path = require('path');
const { Pool } = require('pg');
const bcrypt = require('bcryptjs');

// Carrega o .env da raiz do projeto (fora do Docker). No Docker as variáveis vêm do compose.
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const app = express();

const PORT = process.env.PORT || 8000;

//=
// MIDDLEWARES
// 

app.use(cors());
app.use(express.json({ limit: '1mb' }));


// ============================================================
// CAMINHO DO FRONTEND
// ============================================================

const frontendPath = path.join(__dirname, '..', 'frontend');

// Servir HTML, CSS, JavaScript, imagens etc.
app.use(express.static(frontendPath));


// ============================================================
// ROTA PRINCIPAL
// ============================================================

app.get('/', (req, res) => {
    res.sendFile(path.join(frontendPath, 'index.html'));
});


// ============================================================
// CONEXÃO COM POSTGRESQL
// ============================================================

const pool = new Pool({
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT) || 5432,
    database: process.env.DB_NAME || 'resolveja',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD
});


// ============================================================
// TESTAR CONEXÃO COM POSTGRESQL
// ============================================================

pool.connect()
    .then(client => {
        console.log('Conectado ao PostgreSQL.');
        client.release();
    })
    .catch(err => {
        console.error(
            'Erro ao conectar ao PostgreSQL:',
            err.message
        );
    });


// ============================================================
// FUNÇÕES AUXILIARES (CPF / CNPJ / telefone)
// ============================================================

const soDigitos = v => String(v ?? '').replace(/\D/g, '');

function documentoValido(valor) {
    const v = soDigitos(valor);
    if (/^(\d)\1+$/.test(v)) return false;

    if (v.length === 11) {
        const d = n => {
            let soma = 0;
            for (let i = 0; i < n; i++) soma += +v[i] * (n + 1 - i);
            const r = (soma * 10) % 11;
            return r === 10 ? 0 : r;
        };
        return d(9) === +v[9] && d(10) === +v[10];
    }

    if (v.length === 14) {
        const d = n => {
            let soma = 0, p = n - 7;
            for (let i = 0; i < n; i++) { soma += +v[i] * p--; if (p < 2) p = 9; }
            const r = soma % 11;
            return r < 2 ? 0 : 11 - r;
        };
        return d(12) === +v[12] && d(13) === +v[13];
    }

    return false;
}


// ============================================================
// CADASTRO
// ============================================================

app.post('/api/cadastro', async (req, res) => {
    const {
        nome,
        email,
        senha,
        tipo,
        telefone,
        documento
    } = req.body;

    if (!nome || !email || !senha || !tipo) {
        return res.status(400).json({
            sucesso: false,
            mensagem: 'Preencha todos os campos.'
        });
    }

    // Somente CLIENTE ou PRESTADOR podem se cadastrar pela API pública
    const tipoNormalizado = String(tipo).toUpperCase();

    if (!['CLIENTE', 'PRESTADOR'].includes(tipoNormalizado)) {
        return res.status(400).json({
            sucesso: false,
            mensagem: 'Tipo de conta inválido.'
        });
    }

    const telefoneDigitos = soDigitos(telefone);

    if (!documentoValido(documento)) {
        return res.status(400).json({
            sucesso: false,
            mensagem: tipoNormalizado === 'PRESTADOR'
                ? 'Informe um CPF ou CNPJ válido.'
                : 'Informe um CPF válido.'
        });
    }

    if (tipoNormalizado === 'CLIENTE' && soDigitos(documento).length !== 11) {
        return res.status(400).json({
            sucesso: false,
            mensagem: 'Informe um CPF válido.'
        });
    }

    if (
        (tipoNormalizado === 'CLIENTE' || telefoneDigitos) &&
        telefoneDigitos.length < 10
    ) {
        return res.status(400).json({
            sucesso: false,
            mensagem: 'Informe um telefone válido com DDD.'
        });
    }

    if (String(senha).length < 6) {
        return res.status(400).json({
            sucesso: false,
            mensagem: 'A senha deve ter pelo menos 6 caracteres.'
        });
    }

    try {
        const senhaHash = await bcrypt.hash(String(senha), 10);

        const resultado = await pool.query(
            `
            INSERT INTO usuarios
            (
                nome,
                email,
                senha_hash,
                tipo,
                telefone,
                cpf
            )
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING id, nome, email, tipo, telefone, cpf AS documento
            `,
            [
                nome,
                String(email).trim().toLowerCase(),
                senhaHash,
                tipoNormalizado,
                telefoneDigitos || null,
                soDigitos(documento)
            ]
        );

        res.status(201).json({
            sucesso: true,
            mensagem: 'Cadastro realizado com sucesso!',
            usuario: resultado.rows[0]
        });

    } catch (err) {

        console.error('Erro ao cadastrar usuário:', err.code, err.message);

        if (err.code === '23505') {
            return res.status(400).json({
                sucesso: false,
                mensagem: String(err.constraint || '').includes('cpf')
                    ? 'Este CPF/CNPJ já está cadastrado.'
                    : 'Este e-mail já está cadastrado.'
            });
        }

        res.status(500).json({
            sucesso: false,
            mensagem: 'Erro interno ao cadastrar usuário.'
        });
    }
});


// ============================================================
// LOGIN
// ============================================================

app.post('/api/login', async (req, res) => {

    const {
        email,
        senha
    } = req.body;

    if (!email || !senha) {
        return res.status(400).json({
            sucesso: false,
            mensagem: 'Informe e-mail e senha.'
        });
    }

    try {

        const resultado = await pool.query(
            `
            SELECT
                id,
                nome,
                email,
                tipo,
                telefone,
                cpf AS documento,
                foto_url AS foto,
                senha_hash,
                status
            FROM usuarios
            WHERE email = $1
            `,
            [
                String(email).trim().toLowerCase()
            ]
        );

        const usuario = resultado.rows[0];

        const senhaConfere = usuario
            ? await bcrypt.compare(String(senha), usuario.senha_hash)
            : false;

        if (!usuario || !senhaConfere) {
            return res.status(401).json({
                sucesso: false,
                mensagem: 'E-mail ou senha inválidos.'
            });
        }

        if (usuario.status !== 'ATIVO') {
            return res.status(403).json({
                sucesso: false,
                mensagem: 'Conta inativa ou bloqueada.'
            });
        }

        delete usuario.senha_hash;
        delete usuario.status;

        res.json({
            sucesso: true,
            mensagem: 'Login realizado com sucesso!',
            usuario
        });

    } catch (err) {

        console.error('Erro no login:', err);

        res.status(500).json({
            sucesso: false,
            mensagem: 'Erro ao realizar login.'
        });
    }
});


// ============================================================
// LISTAR CATEGORIAS
// ============================================================

app.get('/api/categorias', async (req, res) => {

    try {

        const resultado = await pool.query(
            `
            SELECT
                id,
                nome,
                descricao
            FROM categorias
            WHERE ativo = TRUE
            ORDER BY nome
            `
        );

        res.json(resultado.rows);

    } catch (err) {

        console.error('Erro ao buscar categorias:', err);

        res.status(500).json({
            sucesso: false,
            mensagem: 'Erro ao buscar categorias.'
        });
    }
});


// ============================================================
// LISTAR SERVIÇOS
// ============================================================

app.get('/api/servicos', async (req, res) => {

    try {

        const resultado = await pool.query(
            `
            SELECT
                s.id,
                s.nome AS titulo,
                s.descricao,
                s.preco_base AS preco,
                s.categoria_id AS "categoriaId",
                c.nome AS "categoriaNome"
            FROM servicos s
            INNER JOIN categorias c
                ON c.id = s.categoria_id
            WHERE s.ativo = TRUE
            ORDER BY s.nome
            `
        );

        res.json(resultado.rows);

    } catch (err) {

        console.error('Erro ao buscar serviços:', err);

        res.status(500).json({
            sucesso: false,
            mensagem: 'Erro ao buscar serviços.'
        });
    }
});


// ============================================================
// CRIAR SERVIÇO
// ============================================================

app.post('/api/servicos', async (req, res) => {

    const {
        titulo,
        preco,
        categoriaId,
        descricao
    } = req.body;

    if (!titulo || !categoriaId) {
        return res.status(400).json({
            sucesso: false,
            mensagem: 'Informe título e categoria.'
        });
    }

    try {

        const resultado = await pool.query(
            `
            INSERT INTO servicos
            (
                categoria_id,
                nome,
                descricao,
                preco_base
            )
            VALUES ($1, $2, $3, $4)
            RETURNING id, nome AS titulo, descricao, preco_base AS preco
            `,
            [
                categoriaId,
                titulo,
                descricao || null,
                preco || 0
            ]
        );

        res.status(201).json({
            sucesso: true,
            mensagem: 'Serviço criado com sucesso!',
            servico: resultado.rows[0]
        });

    } catch (err) {

        console.error('Erro ao criar serviço:', err);

        res.status(500).json({
            sucesso: false,
            mensagem: 'Erro ao criar serviço.'
        });
    }
});


// ============================================================
// LISTAR AGENDAMENTOS
// ============================================================

app.get('/api/agendamentos', async (req, res) => {

    try {

        const resultado = await pool.query(
            `
            SELECT
                s.id,
                s.cliente_id AS "clienteId",
                u.nome AS "clienteNome",
                s.servico_id AS "servicoId",
                sv.nome AS "servicoTitulo",
                s.data_agendada AS data,
                s.status
            FROM solicitacoes s
            INNER JOIN usuarios u
                ON u.id = s.cliente_id
            INNER JOIN servicos sv
                ON sv.id = s.servico_id
            ORDER BY s.criado_em DESC
            `
        );

        res.json(resultado.rows);

    } catch (err) {

        console.error(
            'Erro ao buscar agendamentos:',
            err
        );

        res.status(500).json({
            sucesso: false,
            mensagem: 'Erro ao buscar agendamentos.'
        });
    }
});


// ============================================================
// CRIAR AGENDAMENTO
// ============================================================

app.post('/api/agendamentos', async (req, res) => {

    const {
        clienteId,
        servicoId,
        data
    } = req.body;

    if (!clienteId || !servicoId || !data) {
        return res.status(400).json({
            sucesso: false,
            mensagem: 'Dados incompletos para agendar.'
        });
    }

    try {

        const endereco = await pool.query(
            `
            SELECT id
            FROM enderecos
            WHERE usuario_id = $1
            ORDER BY principal DESC, criado_em
            LIMIT 1
            `,
            [
                clienteId
            ]
        );

        if (endereco.rows.length === 0) {
            return res.status(400).json({
                sucesso: false,
                mensagem:
                    'O cliente ainda não possui endereço cadastrado.'
            });
        }

        const resultado = await pool.query(
            `
            INSERT INTO solicitacoes
            (
                cliente_id,
                servico_id,
                endereco_id,
                titulo,
                descricao,
                data_agendada,
                status
            )
            VALUES
            (
                $1,
                $2,
                $3,
                $4,
                $5,
                $6,
                'ABERTA'
            )
            RETURNING id
            `,
            [
                clienteId,
                servicoId,
                endereco.rows[0].id,
                'Agendamento de serviço',
                'Solicitação criada pelo cliente.',
                data
            ]
        );

        res.status(201).json({
            sucesso: true,
            mensagem: 'Agendamento criado com sucesso!',
            id: resultado.rows[0].id
        });

    } catch (err) {

        console.error(
            'Erro ao criar agendamento:',
            err
        );

        res.status(500).json({
            sucesso: false,
            mensagem: 'Erro ao criar agendamento.'
        });
    }
});


// ============================================================
// ALTERAR SENHA (usuário logado: exige a senha atual)
// ============================================================

app.post('/api/alterar-senha', async (req, res) => {

    const { usuarioId, senhaAtual, novaSenha } = req.body;

    if (!usuarioId || !senhaAtual || !novaSenha) {
        return res.status(400).json({
            sucesso: false,
            mensagem: 'Preencha todos os campos.'
        });
    }

    if (String(novaSenha).length < 6) {
        return res.status(400).json({
            sucesso: false,
            mensagem: 'A nova senha deve ter pelo menos 6 caracteres.'
        });
    }

    try {

        const resultado = await pool.query(
            'SELECT senha_hash FROM usuarios WHERE id = $1',
            [usuarioId]
        );

        const usuario = resultado.rows[0];

        if (
            !usuario ||
            !(await bcrypt.compare(String(senhaAtual), usuario.senha_hash))
        ) {
            return res.status(401).json({
                sucesso: false,
                mensagem: 'Senha atual incorreta.'
            });
        }

        const novoHash = await bcrypt.hash(String(novaSenha), 10);

        await pool.query(
            `
            UPDATE usuarios
            SET senha_hash = $1, atualizado_em = NOW()
            WHERE id = $2
            `,
            [novoHash, usuarioId]
        );

        res.json({
            sucesso: true,
            mensagem: 'Senha atualizada com sucesso!'
        });

    } catch (err) {

        console.error('Erro ao alterar senha:', err);

        res.status(500).json({
            sucesso: false,
            mensagem: 'Erro ao alterar a senha.'
        });
    }
});


// ============================================================
// REDEFINIR SENHA (esqueci a senha)
// Sem envio de e-mail ainda: confirma a identidade com e-mail + CPF/CNPJ
// ============================================================

app.post('/api/redefinir-senha', async (req, res) => {

    const { email, documento, novaSenha } = req.body;

    if (!email || !documento || !novaSenha) {
        return res.status(400).json({
            sucesso: false,
            mensagem: 'Preencha todos os campos.'
        });
    }

    if (String(novaSenha).length < 6) {
        return res.status(400).json({
            sucesso: false,
            mensagem: 'A nova senha deve ter pelo menos 6 caracteres.'
        });
    }

    try {

        const resultado = await pool.query(
            'SELECT id, cpf FROM usuarios WHERE email = $1',
            [String(email).trim().toLowerCase()]
        );

        const usuario = resultado.rows[0];

        // Mesma mensagem para e-mail inexistente e CPF/CNPJ errado (não revela quais e-mails existem)
        if (!usuario || !usuario.cpf || usuario.cpf !== soDigitos(documento)) {
            return res.status(400).json({
                sucesso: false,
                mensagem: 'Os dados informados não conferem.'
            });
        }

        const novoHash = await bcrypt.hash(String(novaSenha), 10);

        await pool.query(
            `
            UPDATE usuarios
            SET senha_hash = $1, atualizado_em = NOW()
            WHERE id = $2
            `,
            [novoHash, usuario.id]
        );

        res.json({
            sucesso: true,
            mensagem: 'Senha redefinida com sucesso!'
        });

    } catch (err) {

        console.error('Erro ao redefinir senha:', err);

        res.status(500).json({
            sucesso: false,
            mensagem: 'Erro ao redefinir a senha.'
        });
    }
});


// ============================================================
// FOTO DE PERFIL (salva como imagem pequena em base64 em usuarios.foto_url)
// Enviar foto: null remove a foto
// ============================================================

app.post('/api/foto-perfil', async (req, res) => {

    const { usuarioId, foto } = req.body;

    if (!usuarioId) {
        return res.status(400).json({
            sucesso: false,
            mensagem: 'Usuário não informado.'
        });
    }

    if (foto !== null && foto !== undefined) {
        const formatoOk =
            typeof foto === 'string' &&
            /^data:image\/(jpeg|png|webp);base64,[A-Za-z0-9+/=]+$/.test(foto);

        if (!formatoOk || foto.length > 300000) {
            return res.status(400).json({
                sucesso: false,
                mensagem: 'Imagem inválida ou muito grande.'
            });
        }
    }

    try {

        const resultado = await pool.query(
            `
            UPDATE usuarios
            SET foto_url = $1, atualizado_em = NOW()
            WHERE id = $2
            RETURNING id
            `,
            [foto || null, usuarioId]
        );

        if (resultado.rows.length === 0) {
            return res.status(404).json({
                sucesso: false,
                mensagem: 'Usuário não encontrado.'
            });
        }

        res.json({
            sucesso: true,
            mensagem: 'Foto atualizada com sucesso!'
        });

    } catch (err) {

        console.error('Erro ao salvar foto:', err);

        res.status(500).json({
            sucesso: false,
            mensagem: 'Erro ao salvar a foto.'
        });
    }
});


// ============================================================
// FAVORITOS (cliente favorita um prestador, identificado pelo CPF/CNPJ)
// ============================================================

// Lista os prestadores favoritos de um cliente
app.get('/api/favoritos', async (req, res) => {

    const { clienteId } = req.query;

    if (!clienteId) {
        return res.status(400).json({
            sucesso: false,
            mensagem: 'Cliente não informado.'
        });
    }

    try {

        const resultado = await pool.query(
            `
            SELECT
                u.id AS "usuarioId",
                u.nome,
                u.telefone,
                u.cpf AS documento,
                u.foto_url AS foto
            FROM favoritos f
            INNER JOIN prestadores p ON p.id = f.prestador_id
            INNER JOIN usuarios u ON u.id = p.usuario_id
            WHERE f.cliente_id = $1
            ORDER BY f.criado_em DESC
            `,
            [clienteId]
        );

        res.json(resultado.rows);

    } catch (err) {

        console.error('Erro ao listar favoritos:', err);

        res.status(500).json({
            sucesso: false,
            mensagem: 'Erro ao carregar os favoritos.'
        });
    }
});


// Descobre qual usuário PRESTADOR é: pelo id da conta; se não der, pelo CPF/CNPJ;
// se não der, pelo nome (só quando houver um único prestador com esse nome)
async function resolverPrestador({ prestadorId, documento, nome }) {

    if (prestadorId && /^[0-9a-f-]{36}$/i.test(String(prestadorId))) {
        const r = await pool.query(
            "SELECT id FROM usuarios WHERE id = $1 AND tipo = 'PRESTADOR'",
            [prestadorId]
        );
        if (r.rows[0]) return r.rows[0].id;
    }

    const doc = soDigitos(documento);

    if (doc) {
        const r = await pool.query(
            "SELECT id FROM usuarios WHERE cpf = $1 AND tipo = 'PRESTADOR'",
            [doc]
        );
        if (r.rows[0]) return r.rows[0].id;
    }

    if (nome) {
        const r = await pool.query(
            "SELECT id FROM usuarios WHERE nome = $1 AND tipo = 'PRESTADOR' LIMIT 2",
            [String(nome)]
        );
        if (r.rows.length === 1) return r.rows[0].id;
    }

    return null;
}


// Favorita um prestador
app.post('/api/favoritos', async (req, res) => {

    const { clienteId, prestadorId, documento, nome } = req.body;

    if (!clienteId || !(prestadorId || documento || nome)) {
        return res.status(400).json({
            sucesso: false,
            mensagem: 'Preencha todos os campos.'
        });
    }

    try {

        const cliente = await pool.query(
            "SELECT id FROM usuarios WHERE id = $1 AND tipo = 'CLIENTE'",
            [clienteId]
        );

        if (cliente.rows.length === 0) {
            return res.status(403).json({
                sucesso: false,
                mensagem: 'Somente clientes podem favoritar prestadores.'
            });
        }

        const usuarioPrestadorId = await resolverPrestador({ prestadorId, documento, nome });

        if (!usuarioPrestadorId) {
            return res.status(404).json({
                sucesso: false,
                mensagem: 'Prestador não encontrado.'
            });
        }

        // O cadastro só cria o usuário; a linha em "prestadores" é criada na primeira vez que alguém o favorita
        const prestador = await pool.query(
            `
            INSERT INTO prestadores (usuario_id)
            VALUES ($1)
            ON CONFLICT (usuario_id) DO UPDATE SET usuario_id = EXCLUDED.usuario_id
            RETURNING id
            `,
            [usuarioPrestadorId]
        );

        await pool.query(
            `
            INSERT INTO favoritos (cliente_id, prestador_id)
            VALUES ($1, $2)
            ON CONFLICT (cliente_id, prestador_id) DO NOTHING
            `,
            [clienteId, prestador.rows[0].id]
        );

        res.status(201).json({
            sucesso: true,
            mensagem: 'Prestador adicionado aos favoritos!',
            usuarioId: usuarioPrestadorId
        });

    } catch (err) {

        console.error('Erro ao favoritar:', err);

        res.status(500).json({
            sucesso: false,
            mensagem: 'Erro ao favoritar o prestador.'
        });
    }
});


// Remove dos favoritos
app.post('/api/favoritos/remover', async (req, res) => {

    const { clienteId, prestadorId, documento, nome } = req.body;

    if (!clienteId || !(prestadorId || documento || nome)) {
        return res.status(400).json({
            sucesso: false,
            mensagem: 'Preencha todos os campos.'
        });
    }

    try {

        const usuarioPrestadorId = await resolverPrestador({ prestadorId, documento, nome });

        if (usuarioPrestadorId) {
            await pool.query(
                `
                DELETE FROM favoritos
                WHERE cliente_id = $1
                  AND prestador_id IN (
                      SELECT id FROM prestadores WHERE usuario_id = $2
                  )
                `,
                [clienteId, usuarioPrestadorId]
            );
        }

        res.json({
            sucesso: true,
            mensagem: 'Prestador removido dos favoritos.',
            usuarioId: usuarioPrestadorId
        });

    } catch (err) {

        console.error('Erro ao remover favorito:', err);

        res.status(500).json({
            sucesso: false,
            mensagem: 'Erro ao remover o favorito.'
        });
    }
});


// ============================================================
// TESTE DO BANCO
// ============================================================

app.get('/api/teste-banco', async (req, res) => {

    try {

        const resultado = await pool.query(
            'SELECT NOW() AS data'
        );

        res.json({
            sucesso: true,
            mensagem: 'PostgreSQL funcionando!',
            data: resultado.rows[0].data
        });

    } catch (err) {

        console.error(
            'Erro ao acessar PostgreSQL:',
            err
        );

        res.status(500).json({
            sucesso: false,
            mensagem: 'Erro ao acessar PostgreSQL.'
        });
    }
});


// ============================================================
// HEALTHCHECK
// ============================================================

app.get('/api/health', (req, res) => {
    res.json({ sucesso: true });
});


// ============================================================
// ROTA NÃO ENCONTRADA
// ============================================================

app.use((req, res) => {

    res.status(404).json({
        sucesso: false,
        mensagem: 'Rota não encontrada.'
    });
});


// ============================================================
// INICIAR SERVIDOR
// ============================================================

app.listen(PORT, () => {

    console.log(
        `Servidor rodando em http://localhost:${PORT}`
    );

});