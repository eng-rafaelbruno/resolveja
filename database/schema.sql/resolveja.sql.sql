CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TYPE tipo_usuario AS ENUM (
    'CLIENTE',
    'PRESTADOR',
    'ADMIN'
);

CREATE TYPE status_usuario AS ENUM (
    'ATIVO',
    'INATIVO',
    'BLOQUEADO'
);

CREATE TABLE IF NOT EXISTS usuarios (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nome VARCHAR(150) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    senha_hash TEXT NOT NULL,
    telefone VARCHAR(20),
    cpf VARCHAR(14) UNIQUE,
    tipo tipo_usuario NOT NULL,
    status status_usuario NOT NULL DEFAULT 'ATIVO',
    foto_url TEXT,
    criado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    atualizado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS categorias (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nome VARCHAR(100) NOT NULL UNIQUE,
    descricao TEXT,
    ativo BOOLEAN NOT NULL DEFAULT TRUE,
    criado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO categorias (nome, descricao)
VALUES
    ('Eletricista', 'Serviços elétricos residenciais e comerciais'),
    ('Encanador', 'Serviços hidráulicos e encanamento'),
    ('Pintor', 'Pintura residencial e comercial'),
    ('Pedreiro', 'Construção, reforma e manutenção'),
    ('Marceneiro', 'Móveis e serviços em madeira'),
    ('Técnico de Informática', 'Manutenção e suporte de computadores'),
    ('Ar-condicionado', 'Instalação e manutenção de ar-condicionado'),
    ('Limpeza', 'Serviços de limpeza residencial e comercial'),
    ('Jardinagem', 'Manutenção e cuidados com jardins'),
    ('Manutenção Geral', 'Serviços diversos de manutenção')
ON CONFLICT (nome) DO NOTHING;

CREATE TABLE IF NOT EXISTS servicos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    categoria_id UUID NOT NULL,
    titulo VARCHAR(150) NOT NULL,
    descricao TEXT,
    preco_base NUMERIC(10,2),
    ativo BOOLEAN NOT NULL DEFAULT TRUE,
    criado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    atualizado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_servicos_categoria
        FOREIGN KEY (categoria_id)
        REFERENCES categorias(id)
        ON DELETE RESTRICT
);

CREATE TABLE IF NOT EXISTS prestadores (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    usuario_id UUID NOT NULL UNIQUE,
    descricao TEXT,
    experiencia_anos INTEGER,
    valor_hora NUMERIC(10,2),
    aprovado BOOLEAN NOT NULL DEFAULT FALSE,
    criado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    atualizado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_prestadores_usuario
        FOREIGN KEY (usuario_id)
        REFERENCES usuarios(id)
        ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS prestador_servicos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    prestador_id UUID NOT NULL,
    servico_id UUID NOT NULL,
    preco NUMERIC(10,2),
    observacoes TEXT,
    ativo BOOLEAN NOT NULL DEFAULT TRUE,
    criado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_prestador_servicos_prestador
        FOREIGN KEY (prestador_id)
        REFERENCES prestadores(id)
        ON DELETE CASCADE,
    CONSTRAINT fk_prestador_servicos_servico
        FOREIGN KEY (servico_id)
        REFERENCES servicos(id)
        ON DELETE CASCADE,
    CONSTRAINT uk_prestador_servico
        UNIQUE (prestador_id, servico_id)
);

CREATE TABLE IF NOT EXISTS enderecos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    usuario_id UUID NOT NULL,
    cep VARCHAR(9) NOT NULL,
    logradouro VARCHAR(200) NOT NULL,
    numero VARCHAR(20) NOT NULL,
    complemento VARCHAR(100),
    bairro VARCHAR(100) NOT NULL,
    cidade VARCHAR(100) NOT NULL,
    estado VARCHAR(2) NOT NULL,
    principal BOOLEAN NOT NULL DEFAULT FALSE,
    criado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    atualizado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_enderecos_usuario
        FOREIGN KEY (usuario_id)
        REFERENCES usuarios(id)
        ON DELETE CASCADE
);

 CREATE TYPE status_solicitacao AS ENUM (
    'ABERTA',
    'EM_NEGOCIACAO',
    'ACEITA',
    'EM_ANDAMENTO',
    'CONCLUIDA',
    'CANCELADA'
);

CREATE TABLE IF NOT EXISTS solicitacoes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    cliente_id UUID NOT NULL,
    prestador_id UUID,
    servico_id UUID NOT NULL,
    endereco_id UUID NOT NULL,
    descricao TEXT,
    data_agendada TIMESTAMP,
    valor_combinado NUMERIC(10,2),
    status status_solicitacao NOT NULL DEFAULT 'ABERTA',
    criado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    atualizado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_solicitacoes_cliente
        FOREIGN KEY (cliente_id)
        REFERENCES usuarios(id)
        ON DELETE CASCADE,
    CONSTRAINT fk_solicitacoes_prestador
        FOREIGN KEY (prestador_id)
        REFERENCES prestadores(id)
        ON DELETE SET NULL,
    CONSTRAINT fk_solicitacoes_servico
        FOREIGN KEY (servico_id)
        REFERENCES servicos(id)
        ON DELETE RESTRICT,
    CONSTRAINT fk_solicitacoes_endereco
        FOREIGN KEY (endereco_id)
        REFERENCES enderecos(id)
        ON DELETE RESTRICT
);

CREATE TYPE status_pagamento AS ENUM (
    'PENDENTE',
    'PAGO',
    'REEMBOLSADO'
);

CREATE TABLE IF NOT EXISTS pagamentos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    solicitacao_id UUID NOT NULL UNIQUE,
    valor NUMERIC(10,2) NOT NULL,
    status status_pagamento NOT NULL DEFAULT 'PENDENTE',
    pago_em TIMESTAMP,
    reembolso_valor NUMERIC(10,2),
    reembolsado_em TIMESTAMP,
    observacoes TEXT,
    criado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    atualizado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_pagamentos_solicitacao
        FOREIGN KEY (solicitacao_id)
        REFERENCES solicitacoes(id)
        ON DELETE CASCADE,
    CONSTRAINT chk_pagamentos_valor
        CHECK (valor >= 0),
    CONSTRAINT chk_pagamentos_reembolso
        CHECK (
            reembolso_valor IS NULL
            OR (
                reembolso_valor >= 0
                AND reembolso_valor <= valor
            )
        )
);

CREATE TYPE nota_avaliacao AS ENUM ('1', '2', '3', '4', '5');

CREATE TABLE IF NOT EXISTS avaliacoes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    solicitacao_id UUID NOT NULL,
    cliente_id UUID NOT NULL,
    prestador_id UUID NOT NULL,
    nota nota_avaliacao NOT NULL,
    comentario TEXT,
    criado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_avaliacoes_solicitacao
        FOREIGN KEY (solicitacao_id)
        REFERENCES solicitacoes(id)
        ON DELETE CASCADE,
    CONSTRAINT fk_avaliacoes_cliente
        FOREIGN KEY (cliente_id)
        REFERENCES usuarios(id)
        ON DELETE CASCADE,
    CONSTRAINT fk_avaliacoes_prestador
        FOREIGN KEY (prestador_id)
        REFERENCES prestadores(id)
        ON DELETE CASCADE,
    CONSTRAINT uk_avaliacao_solicitacao
        UNIQUE (solicitacao_id)
);

CREATE TABLE IF NOT EXISTS mensagens (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    solicitacao_id UUID NOT NULL,
    remetente_id UUID NOT NULL,
    destinatario_id UUID NOT NULL,
    mensagem TEXT NOT NULL,
    lida BOOLEAN NOT NULL DEFAULT FALSE,
    criado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_mensagens_solicitacao
        FOREIGN KEY (solicitacao_id)
        REFERENCES solicitacoes(id)
        ON DELETE CASCADE,
    CONSTRAINT fk_mensagens_remetente
        FOREIGN KEY (remetente_id)
        REFERENCES usuarios(id)
        ON DELETE CASCADE,
    CONSTRAINT fk_mensagens_destinatario
        FOREIGN KEY (destinatario_id)
        REFERENCES usuarios(id)
        ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS notificacoes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    usuario_id UUID NOT NULL,
    titulo VARCHAR(150) NOT NULL,
    mensagem TEXT NOT NULL,
    lida BOOLEAN NOT NULL DEFAULT FALSE,
    criado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_notificacoes_usuario
        FOREIGN KEY (usuario_id)
        REFERENCES usuarios(id)
        ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS favoritos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    cliente_id UUID NOT NULL,
    prestador_id UUID NOT NULL,
    criado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_favoritos_cliente
        FOREIGN KEY (cliente_id)
        REFERENCES usuarios(id)
        ON DELETE CASCADE,
    CONSTRAINT fk_favoritos_prestador
        FOREIGN KEY (prestador_id)
        REFERENCES prestadores(id)
        ON DELETE CASCADE,
    CONSTRAINT uk_favorito_cliente_prestador
        UNIQUE (cliente_id, prestador_id)
);