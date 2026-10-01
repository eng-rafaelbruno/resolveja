# ResolveJá

Plataforma web que conecta clientes a prestadores de serviço, permitindo cadastro, busca e contratação de serviços.

## Integrantes do grupo

- [Rafael Bruno] 
- [Lucas Ferreira]

## Funcionalidades

- Cadastro e login de usuários
- Recuperação de senha
- Painel do usuário
- Listagem de serviços
- Perfil do usuário
- Configurações da conta

## Tecnologias utilizadas

- **Frontend:** HTML, CSS e JavaScript
- **Backend:** Node.js
- **Banco de dados:** PostgreSQL
- **Containerização:** Docker e Docker Compose

## Estrutura do projeto

```
resolveja/
├── backend/        # Servidor Node.js (server.js)
├── database/       # schema.sql e backups do banco
├── frontend/       # Páginas HTML, style.css e script.js
├── Dockerfile
├── docker-compose.yml
└── README.md
```

## Como executar com Docker

### Pré-requisitos

- [Docker](https://www.docker.com/products/docker-desktop/) instalado e em execução
- [Git](https://git-scm.com/) instalado

### Passo a passo

1. Clone o repositório:

```bash
git clone https://github.com/eng-rafaelbruno/resolveja.git
cd resolveja
```

2. Suba os containers:

```bash
docker compose up --build
```

3. Acesse no navegador:

```
http://localhost:[PORTA]
```

4. Para parar o projeto:

```bash
docker compose down
```

## Como executar sem Docker (opcional)

```bash
npm install
cd backend
npm install
node server.js
```

É necessário ter o PostgreSQL instalado e o banco criado a partir do arquivo `database/schema.sql`.

## Banco de dados

O script `database/schema.sql` cria as tabelas do sistema. No Docker, ele é executado automaticamente na primeira vez que o container do banco é iniciado.

## Variáveis de ambiente

| Variável | Descrição | Exemplo |
|----------|-----------|---------|
| `DB_HOST` | Host do banco | `db` |
| `DB_PORT` | Porta do banco | `5432` |
| `DB_USER` | Usuário do banco | `[usuario]` |
| `DB_PASSWORD` | Senha do banco | `[senha]` |
| `DB_NAME` | Nome do banco | `resolveja` |

## Disciplina

Projeto II Engenharia de Software | Gabriel | [6º Semestre/2026]