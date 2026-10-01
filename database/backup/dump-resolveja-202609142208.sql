--
-- PostgreSQL database cluster dump
--

-- Started on 2026-09-14 22:08:03

\restrict takLwzrBqejtNrry5z4ZuXAFNLeJbRPfCawFF07o0WGkLpTV7RXmwGMblTy4Wuj

SET default_transaction_read_only = off;

SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;

--
-- Roles
--

CREATE ROLE postgres;
ALTER ROLE postgres WITH SUPERUSER INHERIT CREATEROLE CREATEDB LOGIN REPLICATION BYPASSRLS;

--
-- User Configurations
--








\unrestrict takLwzrBqejtNrry5z4ZuXAFNLeJbRPfCawFF07o0WGkLpTV7RXmwGMblTy4Wuj

--
-- Databases
--

--
-- Database "template1" dump
--

\connect template1

--
-- PostgreSQL database dump
--

\restrict qQcwvCsW8pOtqSJGJUy075ODXbCPUrcjsANGYqhTQuRQ5r04v9a58g8JxVwEBy3

-- Dumped from database version 18.6
-- Dumped by pg_dump version 18.6

-- Started on 2026-09-14 22:08:04

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

-- Completed on 2026-09-14 22:08:04

--
-- PostgreSQL database dump complete
--

\unrestrict qQcwvCsW8pOtqSJGJUy075ODXbCPUrcjsANGYqhTQuRQ5r04v9a58g8JxVwEBy3

--
-- Database "resolveja" dump
--

--
-- PostgreSQL database dump
--

\restrict NZcENeAjgljS5fVFGD1yWc0LNaF7t7zozuHIGhvBWL4tZgpShfq2qosnondYyuK

-- Dumped from database version 18.6
-- Dumped by pg_dump version 18.6

-- Started on 2026-09-14 22:08:04

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 5220 (class 1262 OID 16388)
-- Name: resolveja; Type: DATABASE; Schema: -; Owner: postgres
--

CREATE DATABASE resolveja WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'Portuguese_Brazil.1252';


ALTER DATABASE resolveja OWNER TO postgres;

\unrestrict NZcENeAjgljS5fVFGD1yWc0LNaF7t7zozuHIGhvBWL4tZgpShfq2qosnondYyuK
\connect resolveja
\restrict NZcENeAjgljS5fVFGD1yWc0LNaF7t7zozuHIGhvBWL4tZgpShfq2qosnondYyuK

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 2 (class 3079 OID 16389)
-- Name: pgcrypto; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA public;


--
-- TOC entry 5221 (class 0 OID 0)
-- Dependencies: 2
-- Name: EXTENSION pgcrypto; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION pgcrypto IS 'cryptographic functions';


--
-- TOC entry 901 (class 1247 OID 16428)
-- Name: metodo_pagamento; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.metodo_pagamento AS ENUM (
    'PIX',
    'CARTAO_CREDITO',
    'CARTAO_DEBITO',
    'DINHEIRO'
);


ALTER TYPE public.metodo_pagamento OWNER TO postgres;

--
-- TOC entry 934 (class 1247 OID 16644)
-- Name: nota_avaliacao; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.nota_avaliacao AS ENUM (
    '1',
    '2',
    '3',
    '4',
    '5'
);


ALTER TYPE public.nota_avaliacao OWNER TO postgres;

--
-- TOC entry 946 (class 1247 OID 16741)
-- Name: status_pagamento; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.status_pagamento AS ENUM (
    'PENDENTE',
    'PAGO',
    'REEMBOLSADO'
);


ALTER TYPE public.status_pagamento OWNER TO postgres;

--
-- TOC entry 928 (class 1247 OID 16592)
-- Name: status_solicitacao; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.status_solicitacao AS ENUM (
    'ABERTA',
    'EM_NEGOCIACAO',
    'ACEITA',
    'EM_ANDAMENTO',
    'CONCLUIDA',
    'CANCELADA'
);


ALTER TYPE public.status_solicitacao OWNER TO postgres;

--
-- TOC entry 907 (class 1247 OID 16446)
-- Name: status_usuario; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.status_usuario AS ENUM (
    'ATIVO',
    'INATIVO',
    'BLOQUEADO'
);


ALTER TYPE public.status_usuario OWNER TO postgres;

--
-- TOC entry 904 (class 1247 OID 16438)
-- Name: tipo_usuario; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.tipo_usuario AS ENUM (
    'CLIENTE',
    'PRESTADOR',
    'ADMIN'
);


ALTER TYPE public.tipo_usuario OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 227 (class 1259 OID 16655)
-- Name: avaliacoes; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.avaliacoes (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    solicitacao_id uuid NOT NULL,
    cliente_id uuid NOT NULL,
    prestador_id uuid NOT NULL,
    nota public.nota_avaliacao NOT NULL,
    comentario text,
    criado_em timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.avaliacoes OWNER TO postgres;

--
-- TOC entry 221 (class 1259 OID 16476)
-- Name: categorias; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.categorias (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    nome character varying(100) NOT NULL,
    descricao text,
    ativo boolean DEFAULT true NOT NULL,
    criado_em timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.categorias OWNER TO postgres;

--
-- TOC entry 225 (class 1259 OID 16564)
-- Name: enderecos; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.enderecos (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    usuario_id uuid NOT NULL,
    cep character varying(9) NOT NULL,
    logradouro character varying(200) NOT NULL,
    numero character varying(20) NOT NULL,
    complemento character varying(100),
    bairro character varying(100) NOT NULL,
    cidade character varying(100) NOT NULL,
    estado character varying(2) NOT NULL,
    principal boolean DEFAULT false NOT NULL,
    criado_em timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    atualizado_em timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.enderecos OWNER TO postgres;

--
-- TOC entry 231 (class 1259 OID 16773)
-- Name: favoritos; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.favoritos (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    cliente_id uuid NOT NULL,
    prestador_id uuid NOT NULL,
    criado_em timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.favoritos OWNER TO postgres;

--
-- TOC entry 228 (class 1259 OID 16687)
-- Name: mensagens; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.mensagens (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    solicitacao_id uuid NOT NULL,
    remetente_id uuid NOT NULL,
    destinatario_id uuid NOT NULL,
    mensagem text NOT NULL,
    lida boolean DEFAULT false NOT NULL,
    criado_em timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.mensagens OWNER TO postgres;

--
-- TOC entry 229 (class 1259 OID 16719)
-- Name: notificacoes; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.notificacoes (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    usuario_id uuid NOT NULL,
    titulo character varying(150) NOT NULL,
    mensagem text NOT NULL,
    lida boolean DEFAULT false NOT NULL,
    criado_em timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.notificacoes OWNER TO postgres;

--
-- TOC entry 230 (class 1259 OID 16747)
-- Name: pagamentos; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.pagamentos (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    solicitacao_id uuid NOT NULL,
    valor numeric(10,2) NOT NULL,
    status public.status_pagamento DEFAULT 'PENDENTE'::public.status_pagamento NOT NULL,
    pago_em timestamp without time zone,
    reembolso_valor numeric(10,2),
    reembolsado_em timestamp without time zone,
    observacoes text,
    criado_em timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    atualizado_em timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT chk_pagamentos_reembolso CHECK (((reembolso_valor IS NULL) OR ((reembolso_valor >= (0)::numeric) AND (reembolso_valor <= valor)))),
    CONSTRAINT chk_pagamentos_valor CHECK ((valor >= (0)::numeric))
);


ALTER TABLE public.pagamentos OWNER TO postgres;

--
-- TOC entry 224 (class 1259 OID 16537)
-- Name: prestador_servicos; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.prestador_servicos (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    prestador_id uuid NOT NULL,
    servico_id uuid NOT NULL,
    preco numeric(10,2),
    observacoes text,
    ativo boolean DEFAULT true NOT NULL,
    criado_em timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.prestador_servicos OWNER TO postgres;

--
-- TOC entry 223 (class 1259 OID 16514)
-- Name: prestadores; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.prestadores (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    usuario_id uuid NOT NULL,
    descricao text,
    experiencia_anos integer,
    valor_hora numeric(10,2),
    aprovado boolean DEFAULT false NOT NULL,
    criado_em timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    atualizado_em timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.prestadores OWNER TO postgres;

--
-- TOC entry 222 (class 1259 OID 16492)
-- Name: servicos; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.servicos (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    categoria_id uuid NOT NULL,
    titulo character varying(150) NOT NULL,
    descricao text,
    preco_base numeric(10,2),
    ativo boolean DEFAULT true NOT NULL,
    criado_em timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    atualizado_em timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.servicos OWNER TO postgres;

--
-- TOC entry 226 (class 1259 OID 16605)
-- Name: solicitacoes; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.solicitacoes (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    cliente_id uuid NOT NULL,
    prestador_id uuid,
    servico_id uuid NOT NULL,
    endereco_id uuid NOT NULL,
    descricao text,
    data_agendada timestamp without time zone,
    valor_combinado numeric(10,2),
    status public.status_solicitacao DEFAULT 'ABERTA'::public.status_solicitacao NOT NULL,
    criado_em timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    atualizado_em timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.solicitacoes OWNER TO postgres;

--
-- TOC entry 220 (class 1259 OID 16453)
-- Name: usuarios; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.usuarios (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    nome character varying(150) NOT NULL,
    email character varying(150) NOT NULL,
    senha_hash text NOT NULL,
    telefone character varying(20),
    cpf character varying(14),
    tipo public.tipo_usuario NOT NULL,
    status public.status_usuario DEFAULT 'ATIVO'::public.status_usuario NOT NULL,
    foto_url text,
    criado_em timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    atualizado_em timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.usuarios OWNER TO postgres;

--
-- TOC entry 5210 (class 0 OID 16655)
-- Dependencies: 227
-- Data for Name: avaliacoes; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.avaliacoes (id, solicitacao_id, cliente_id, prestador_id, nota, comentario, criado_em) FROM stdin;
\.


--
-- TOC entry 5204 (class 0 OID 16476)
-- Dependencies: 221
-- Data for Name: categorias; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.categorias (id, nome, descricao, ativo, criado_em) FROM stdin;
b71d525e-41fe-4345-9b09-6388785f7ea7	Eletricista	Serviços elétricos residenciais e comerciais	t	2026-09-13 22:25:07.843849
ec16cef1-cafc-4c9c-8092-afa61833ba66	Encanador	Serviços hidráulicos e encanamento	t	2026-09-13 22:25:07.843849
c6b637e1-5d4d-4125-b01f-e84ce4cc3a07	Pintor	Pintura residencial e comercial	t	2026-09-13 22:25:07.843849
e360f5f2-fe11-4d27-8c0d-b06261d2e5a4	Pedreiro	Construção, reforma e manutenção	t	2026-09-13 22:25:07.843849
bfe3ceac-a0e0-474d-b6d6-6f7f99a7ed58	Marceneiro	Móveis e serviços em madeira	t	2026-09-13 22:25:07.843849
16062b5f-b93c-44ec-9a16-77b686f1479e	Técnico de Informática	Manutenção e suporte de computadores	t	2026-09-13 22:25:07.843849
8cef1958-9c09-43f8-83cf-f1bdb2a01f89	Ar-condicionado	Instalação e manutenção de ar-condicionado	t	2026-09-13 22:25:07.843849
9e6991f5-a06e-4b60-a084-0432d240b88c	Limpeza	Serviços de limpeza residencial e comercial	t	2026-09-13 22:25:07.843849
fe708a0f-59f8-4984-8ca9-2e13ba9c1225	Jardinagem	Manutenção e cuidados com jardins	t	2026-09-13 22:25:07.843849
7497145a-c7cf-4096-84ab-5e424bca4e2f	Manutenção Geral	Serviços diversos de manutenção	t	2026-09-13 22:25:07.843849
\.


--
-- TOC entry 5208 (class 0 OID 16564)
-- Dependencies: 225
-- Data for Name: enderecos; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.enderecos (id, usuario_id, cep, logradouro, numero, complemento, bairro, cidade, estado, principal, criado_em, atualizado_em) FROM stdin;
\.


--
-- TOC entry 5214 (class 0 OID 16773)
-- Dependencies: 231
-- Data for Name: favoritos; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.favoritos (id, cliente_id, prestador_id, criado_em) FROM stdin;
\.


--
-- TOC entry 5211 (class 0 OID 16687)
-- Dependencies: 228
-- Data for Name: mensagens; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.mensagens (id, solicitacao_id, remetente_id, destinatario_id, mensagem, lida, criado_em) FROM stdin;
\.


--
-- TOC entry 5212 (class 0 OID 16719)
-- Dependencies: 229
-- Data for Name: notificacoes; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.notificacoes (id, usuario_id, titulo, mensagem, lida, criado_em) FROM stdin;
\.


--
-- TOC entry 5213 (class 0 OID 16747)
-- Dependencies: 230
-- Data for Name: pagamentos; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.pagamentos (id, solicitacao_id, valor, status, pago_em, reembolso_valor, reembolsado_em, observacoes, criado_em, atualizado_em) FROM stdin;
\.


--
-- TOC entry 5207 (class 0 OID 16537)
-- Dependencies: 224
-- Data for Name: prestador_servicos; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.prestador_servicos (id, prestador_id, servico_id, preco, observacoes, ativo, criado_em) FROM stdin;
\.


--
-- TOC entry 5206 (class 0 OID 16514)
-- Dependencies: 223
-- Data for Name: prestadores; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.prestadores (id, usuario_id, descricao, experiencia_anos, valor_hora, aprovado, criado_em, atualizado_em) FROM stdin;
\.


--
-- TOC entry 5205 (class 0 OID 16492)
-- Dependencies: 222
-- Data for Name: servicos; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.servicos (id, categoria_id, titulo, descricao, preco_base, ativo, criado_em, atualizado_em) FROM stdin;
\.


--
-- TOC entry 5209 (class 0 OID 16605)
-- Dependencies: 226
-- Data for Name: solicitacoes; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.solicitacoes (id, cliente_id, prestador_id, servico_id, endereco_id, descricao, data_agendada, valor_combinado, status, criado_em, atualizado_em) FROM stdin;
\.


--
-- TOC entry 5203 (class 0 OID 16453)
-- Dependencies: 220
-- Data for Name: usuarios; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.usuarios (id, nome, email, senha_hash, telefone, cpf, tipo, status, foto_url, criado_em, atualizado_em) FROM stdin;
8d5611b6-d655-4ae7-b1ac-f854788454ad	Rafael - Cliente	cliente@gmail.com	123	\N	\N	CLIENTE	ATIVO	\N	2026-09-13 22:33:52.882279	2026-09-13 22:33:52.882279
f9a22028-2cc2-46e4-b8fb-b9fd0304e615	Bruno - Profissional	profissional@gmail.com	123	\N	\N	PRESTADOR	ATIVO	\N	2026-09-13 22:37:23.297691	2026-09-13 22:37:23.297691
\.


--
-- TOC entry 5022 (class 2606 OID 16669)
-- Name: avaliacoes avaliacoes_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.avaliacoes
    ADD CONSTRAINT avaliacoes_pkey PRIMARY KEY (id);


--
-- TOC entry 5004 (class 2606 OID 16491)
-- Name: categorias categorias_nome_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.categorias
    ADD CONSTRAINT categorias_nome_key UNIQUE (nome);


--
-- TOC entry 5006 (class 2606 OID 16489)
-- Name: categorias categorias_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.categorias
    ADD CONSTRAINT categorias_pkey PRIMARY KEY (id);


--
-- TOC entry 5018 (class 2606 OID 16585)
-- Name: enderecos enderecos_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.enderecos
    ADD CONSTRAINT enderecos_pkey PRIMARY KEY (id);


--
-- TOC entry 5034 (class 2606 OID 16783)
-- Name: favoritos favoritos_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.favoritos
    ADD CONSTRAINT favoritos_pkey PRIMARY KEY (id);


--
-- TOC entry 5026 (class 2606 OID 16703)
-- Name: mensagens mensagens_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.mensagens
    ADD CONSTRAINT mensagens_pkey PRIMARY KEY (id);


--
-- TOC entry 5028 (class 2606 OID 16734)
-- Name: notificacoes notificacoes_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notificacoes
    ADD CONSTRAINT notificacoes_pkey PRIMARY KEY (id);


--
-- TOC entry 5030 (class 2606 OID 16765)
-- Name: pagamentos pagamentos_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pagamentos
    ADD CONSTRAINT pagamentos_pkey PRIMARY KEY (id);


--
-- TOC entry 5032 (class 2606 OID 16767)
-- Name: pagamentos pagamentos_solicitacao_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pagamentos
    ADD CONSTRAINT pagamentos_solicitacao_id_key UNIQUE (solicitacao_id);


--
-- TOC entry 5014 (class 2606 OID 16551)
-- Name: prestador_servicos prestador_servicos_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.prestador_servicos
    ADD CONSTRAINT prestador_servicos_pkey PRIMARY KEY (id);


--
-- TOC entry 5010 (class 2606 OID 16529)
-- Name: prestadores prestadores_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.prestadores
    ADD CONSTRAINT prestadores_pkey PRIMARY KEY (id);


--
-- TOC entry 5012 (class 2606 OID 16531)
-- Name: prestadores prestadores_usuario_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.prestadores
    ADD CONSTRAINT prestadores_usuario_id_key UNIQUE (usuario_id);


--
-- TOC entry 5008 (class 2606 OID 16508)
-- Name: servicos servicos_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.servicos
    ADD CONSTRAINT servicos_pkey PRIMARY KEY (id);


--
-- TOC entry 5020 (class 2606 OID 16622)
-- Name: solicitacoes solicitacoes_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.solicitacoes
    ADD CONSTRAINT solicitacoes_pkey PRIMARY KEY (id);


--
-- TOC entry 5024 (class 2606 OID 16671)
-- Name: avaliacoes uk_avaliacao_solicitacao; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.avaliacoes
    ADD CONSTRAINT uk_avaliacao_solicitacao UNIQUE (solicitacao_id);


--
-- TOC entry 5036 (class 2606 OID 16785)
-- Name: favoritos uk_favorito_cliente_prestador; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.favoritos
    ADD CONSTRAINT uk_favorito_cliente_prestador UNIQUE (cliente_id, prestador_id);


--
-- TOC entry 5016 (class 2606 OID 16553)
-- Name: prestador_servicos uk_prestador_servico; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.prestador_servicos
    ADD CONSTRAINT uk_prestador_servico UNIQUE (prestador_id, servico_id);


--
-- TOC entry 4998 (class 2606 OID 16475)
-- Name: usuarios usuarios_cpf_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuarios
    ADD CONSTRAINT usuarios_cpf_key UNIQUE (cpf);


--
-- TOC entry 5000 (class 2606 OID 16473)
-- Name: usuarios usuarios_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuarios
    ADD CONSTRAINT usuarios_email_key UNIQUE (email);


--
-- TOC entry 5002 (class 2606 OID 16471)
-- Name: usuarios usuarios_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuarios
    ADD CONSTRAINT usuarios_pkey PRIMARY KEY (id);


--
-- TOC entry 5046 (class 2606 OID 16677)
-- Name: avaliacoes fk_avaliacoes_cliente; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.avaliacoes
    ADD CONSTRAINT fk_avaliacoes_cliente FOREIGN KEY (cliente_id) REFERENCES public.usuarios(id) ON DELETE CASCADE;


--
-- TOC entry 5047 (class 2606 OID 16682)
-- Name: avaliacoes fk_avaliacoes_prestador; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.avaliacoes
    ADD CONSTRAINT fk_avaliacoes_prestador FOREIGN KEY (prestador_id) REFERENCES public.prestadores(id) ON DELETE CASCADE;


--
-- TOC entry 5048 (class 2606 OID 16672)
-- Name: avaliacoes fk_avaliacoes_solicitacao; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.avaliacoes
    ADD CONSTRAINT fk_avaliacoes_solicitacao FOREIGN KEY (solicitacao_id) REFERENCES public.solicitacoes(id) ON DELETE CASCADE;


--
-- TOC entry 5041 (class 2606 OID 16586)
-- Name: enderecos fk_enderecos_usuario; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.enderecos
    ADD CONSTRAINT fk_enderecos_usuario FOREIGN KEY (usuario_id) REFERENCES public.usuarios(id) ON DELETE CASCADE;


--
-- TOC entry 5054 (class 2606 OID 16786)
-- Name: favoritos fk_favoritos_cliente; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.favoritos
    ADD CONSTRAINT fk_favoritos_cliente FOREIGN KEY (cliente_id) REFERENCES public.usuarios(id) ON DELETE CASCADE;


--
-- TOC entry 5055 (class 2606 OID 16791)
-- Name: favoritos fk_favoritos_prestador; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.favoritos
    ADD CONSTRAINT fk_favoritos_prestador FOREIGN KEY (prestador_id) REFERENCES public.prestadores(id) ON DELETE CASCADE;


--
-- TOC entry 5049 (class 2606 OID 16714)
-- Name: mensagens fk_mensagens_destinatario; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.mensagens
    ADD CONSTRAINT fk_mensagens_destinatario FOREIGN KEY (destinatario_id) REFERENCES public.usuarios(id) ON DELETE CASCADE;


--
-- TOC entry 5050 (class 2606 OID 16709)
-- Name: mensagens fk_mensagens_remetente; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.mensagens
    ADD CONSTRAINT fk_mensagens_remetente FOREIGN KEY (remetente_id) REFERENCES public.usuarios(id) ON DELETE CASCADE;


--
-- TOC entry 5051 (class 2606 OID 16704)
-- Name: mensagens fk_mensagens_solicitacao; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.mensagens
    ADD CONSTRAINT fk_mensagens_solicitacao FOREIGN KEY (solicitacao_id) REFERENCES public.solicitacoes(id) ON DELETE CASCADE;


--
-- TOC entry 5052 (class 2606 OID 16735)
-- Name: notificacoes fk_notificacoes_usuario; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notificacoes
    ADD CONSTRAINT fk_notificacoes_usuario FOREIGN KEY (usuario_id) REFERENCES public.usuarios(id) ON DELETE CASCADE;


--
-- TOC entry 5053 (class 2606 OID 16768)
-- Name: pagamentos fk_pagamentos_solicitacao; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pagamentos
    ADD CONSTRAINT fk_pagamentos_solicitacao FOREIGN KEY (solicitacao_id) REFERENCES public.solicitacoes(id) ON DELETE CASCADE;


--
-- TOC entry 5039 (class 2606 OID 16554)
-- Name: prestador_servicos fk_prestador_servicos_prestador; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.prestador_servicos
    ADD CONSTRAINT fk_prestador_servicos_prestador FOREIGN KEY (prestador_id) REFERENCES public.prestadores(id) ON DELETE CASCADE;


--
-- TOC entry 5040 (class 2606 OID 16559)
-- Name: prestador_servicos fk_prestador_servicos_servico; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.prestador_servicos
    ADD CONSTRAINT fk_prestador_servicos_servico FOREIGN KEY (servico_id) REFERENCES public.servicos(id) ON DELETE CASCADE;


--
-- TOC entry 5038 (class 2606 OID 16532)
-- Name: prestadores fk_prestadores_usuario; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.prestadores
    ADD CONSTRAINT fk_prestadores_usuario FOREIGN KEY (usuario_id) REFERENCES public.usuarios(id) ON DELETE CASCADE;


--
-- TOC entry 5037 (class 2606 OID 16509)
-- Name: servicos fk_servicos_categoria; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.servicos
    ADD CONSTRAINT fk_servicos_categoria FOREIGN KEY (categoria_id) REFERENCES public.categorias(id) ON DELETE RESTRICT;


--
-- TOC entry 5042 (class 2606 OID 16623)
-- Name: solicitacoes fk_solicitacoes_cliente; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.solicitacoes
    ADD CONSTRAINT fk_solicitacoes_cliente FOREIGN KEY (cliente_id) REFERENCES public.usuarios(id) ON DELETE CASCADE;


--
-- TOC entry 5043 (class 2606 OID 16638)
-- Name: solicitacoes fk_solicitacoes_endereco; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.solicitacoes
    ADD CONSTRAINT fk_solicitacoes_endereco FOREIGN KEY (endereco_id) REFERENCES public.enderecos(id) ON DELETE RESTRICT;


--
-- TOC entry 5044 (class 2606 OID 16628)
-- Name: solicitacoes fk_solicitacoes_prestador; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.solicitacoes
    ADD CONSTRAINT fk_solicitacoes_prestador FOREIGN KEY (prestador_id) REFERENCES public.prestadores(id) ON DELETE SET NULL;


--
-- TOC entry 5045 (class 2606 OID 16633)
-- Name: solicitacoes fk_solicitacoes_servico; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.solicitacoes
    ADD CONSTRAINT fk_solicitacoes_servico FOREIGN KEY (servico_id) REFERENCES public.servicos(id) ON DELETE RESTRICT;


-- Completed on 2026-09-14 22:08:04

--
-- PostgreSQL database dump complete
--

\unrestrict NZcENeAjgljS5fVFGD1yWc0LNaF7t7zozuHIGhvBWL4tZgpShfq2qosnondYyuK

-- Completed on 2026-09-14 22:08:04

--
-- PostgreSQL database cluster dump complete
--

