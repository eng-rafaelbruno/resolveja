# ResolveJá

Plataforma que conecta clientes a prestadores de serviços (eletricista, encanador, pintor, etc.).

> 🚧 **Projeto em desenvolvimento.** Cadastro, login, listagem de serviços e agendamentos usam a API + PostgreSQL.
> As telas `painel`, `servicos`, `perfil` e `configuracoes` ainda guardam dados no `localStorage` do navegador
> (não são compartilhados entre usuários). "Atualizar senha", "Esqueci a senha" e "Excluir conta" são apenas simulações visuais por enquanto.

## Tecnologias

- **Backend:** Node.js, Express, `pg`, `bcryptjs`
- **Banco de dados:** PostgreSQL 18
- **Frontend:** HTML, CSS e JavaScript puro (servido pelo próprio backend)
- **Infra:** Docker e Docker Compose

## Estrutura

```
resolveja/
├── backend/
│   ├── server.js
│   ├── package.json
│   └── Dockerfile
├── frontend/                  # HTML, CSS e script.js
├── database/
│   ├── schema/resolveja.sql   # criação das tabelas + dados iniciais
│   └── backup/                # dumps locais (ignorado pelo Git)
├── docker-compose.yml
├── .env.example
└── README.md
```

## Como rodar com Docker (recomendado)

Requisitos: [Docker](https://www.docker.com/) com Docker Compose.

```bash
# 1. Configure as variáveis de ambiente
cp .env.example .env          # no Windows (PowerShell): copy .env.example .env
# edite o .env e troque DB_PASSWORD por uma senha sua

# 2. Suba tudo
docker compose up --build
```

Acesse: **http://localhost:8000**

- Para parar: `docker compose down`
- Para apagar também o banco: `docker compose down -v`

> O script `database/schema/resolveja.sql` só roda na **primeira** criação do banco.
> Se alterar o schema, rode `docker compose down -v` e suba novamente (isso apaga os dados).

> Se aparecer erro de porta `5432` ocupada (por exemplo, PostgreSQL instalado no Windows),
> troque `"127.0.0.1:5432:5432"` por `"127.0.0.1:5433:5432"` no `docker-compose.yml`.

## Como rodar sem Docker

Requisitos: Node.js 18+ e PostgreSQL instalado.

```bash
# 1. Crie o banco e aplique o schema
createdb -U postgres resolveja
psql -U postgres -d resolveja -f database/schema/resolveja.sql

# 2. Configure o .env (DB_HOST=localhost)
cp .env.example .env

# 3. Instale e inicie o backend
cd backend
npm install
npm start
```

Acesse: **http://localhost:8000**

## Principais rotas da API

| Método | Rota                | Descrição                           |
|--------|---------------------|-------------------------------------|
| POST   | `/api/cadastro`     | Cria usuário (CLIENTE ou PRESTADOR) |
| POST   | `/api/login`        | Autentica usuário                   |
| GET    | `/api/categorias`   | Lista categorias                    |
| GET    | `/api/servicos`     | Lista serviços                      |
| POST   | `/api/servicos`     | Cria serviço                        |
| GET    | `/api/agendamentos` | Lista agendamentos                  |
| POST   | `/api/agendamentos` | Cria agendamento                    |
| GET    | `/api/health`       | Verificação de saúde                |

## Segurança

- Senhas são armazenadas com hash (bcrypt).
- Credenciais ficam no `.env`, que **não** é versionado.
- Ainda **não há autenticação por token (JWT/sessão)** nas rotas — próximo passo importante.

## Próximos passos

- Autenticação com JWT e controle de permissões por tipo de usuário
- Cadastro de endereço (necessário para criar agendamentos)
- Migrar painel/serviços/perfil do `localStorage` para a API
- Recuperação de senha por e-mail