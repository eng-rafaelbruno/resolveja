const express = require('express');
const cors = require('cors');
const path = require('path');
const { Pool } = require('pg');

const app = express();

const PORT = process.env.PORT || 8000;

//=
// MIDDLEWARES
// 

app.use(cors());
app.use(express.json());


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
    host: 'localhost',
    port: 5432,
    database: 'resolvaja',
    user: 'postgres',
    password: '123'
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
// CADASTRO
// ============================================================

// ============================================================
// CADASTRO
// ============================================================

app.post('/api/cadastro', async (req, res) => {
    const {
        nome,
        email,
        senha,
        tipo
    } = req.body;

    if (!nome || !email || !senha || !tipo) {
        return res.status(400).json({
            sucesso: false,
            mensagem: 'Preencha todos os campos.'
        });
    }

    try {
        console.log('----------------------------------------');
        console.log('Tentativa de cadastro:');
        console.log('Nome:', nome);
        console.log('Email:', email);
        console.log('Tipo:', tipo);

        const resultado = await pool.query(
            `
            INSERT INTO usuarios
            (
                nome,
                email,
                senha_hash,
                tipo
            )
            VALUES ($1, $2, $3, $4)
            RETURNING id, nome, email, tipo
            `,
            [
                nome,
                email,
                senha,
                tipo.toUpperCase()
            ]
        );

        console.log('Usuário cadastrado:', resultado.rows[0]);

        res.status(201).json({
            sucesso: true,
            mensagem: 'Cadastro realizado com sucesso!',
            usuario: resultado.rows[0]
        });

    } catch (err) {

        console.error('========================================');
        console.error('ERRO AO CADASTRAR USUÁRIO');
        console.error('Código:', err.code);
        console.error('Mensagem:', err.message);
        console.error('Detalhes:', err.detail);
        console.error('Tabela:', err.table);
        console.error('Coluna:', err.column);
        console.error('Constraint:', err.constraint);
        console.error('========================================');

        if (err.code === '23505') {
            return res.status(400).json({
                sucesso: false,
                mensagem: 'Este e-mail já está cadastrado.'
            });
        }

        res.status(500).json({
            sucesso: false,
            mensagem: 'Erro interno ao cadastrar usuário.',
            erro: err.message
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
                tipo
            FROM usuarios
            WHERE email = $1
            AND senha_hash = $2
            `,
            [
                email,
                senha
            ]
        );

        if (resultado.rows.length === 0) {
            return res.status(401).json({
                sucesso: false,
                mensagem: 'E-mail ou senha inválidos.'
            });
        }

        res.json({
            sucesso: true,
            mensagem: 'Login realizado com sucesso!',
            usuario: resultado.rows[0]
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
            RETURNING id, nome, descricao, preco_base
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