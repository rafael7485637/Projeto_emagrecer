--
-- PostgreSQL database dump
--

\restrict JlwZf2xcJ4HT2fSFY0fo2JCt1zm0EJq3lQpoydGGriO1Dm3hw9uaG15naoa620s

-- Dumped from database version 17.0
-- Dumped by pg_dump version 17.0

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

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: administrador; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.administrador (
    idadministrador integer NOT NULL,
    nome_adm character varying,
    gmail_adm character varying,
    senha_adm character varying
);


ALTER TABLE public.administrador OWNER TO postgres;

--
-- Name: administrador_idadministrador_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.administrador_idadministrador_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.administrador_idadministrador_seq OWNER TO postgres;

--
-- Name: administrador_idadministrador_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.administrador_idadministrador_seq OWNED BY public.administrador.idadministrador;


--
-- Name: categorias; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.categorias (
    idcategoria integer NOT NULL,
    nome_categoria character varying
);


ALTER TABLE public.categorias OWNER TO postgres;

--
-- Name: categoria_videos_idcategoria_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.categoria_videos_idcategoria_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.categoria_videos_idcategoria_seq OWNER TO postgres;

--
-- Name: categoria_videos_idcategoria_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.categoria_videos_idcategoria_seq OWNED BY public.categorias.idcategoria;


--
-- Name: usuario; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.usuario (
    idusuario integer NOT NULL,
    gmail character varying,
    nome character varying,
    data_nascimento date,
    peso numeric,
    altura numeric,
    telefone character varying,
    status character varying,
    foto character varying,
    senha_usuario character varying,
    "passwordResetToken" character varying,
    "passwordResetExpires" timestamp with time zone
);


ALTER TABLE public.usuario OWNER TO postgres;

--
-- Name: usuario_idusuario_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.usuario_idusuario_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.usuario_idusuario_seq OWNER TO postgres;

--
-- Name: usuario_idusuario_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.usuario_idusuario_seq OWNED BY public.usuario.idusuario;


--
-- Name: video; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.video (
    idvideo integer NOT NULL,
    imagem character varying,
    titulo character varying,
    link text,
    descricao text,
    idcategoria integer
);


ALTER TABLE public.video OWNER TO postgres;

--
-- Name: video_idvideo_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.video_idvideo_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.video_idvideo_seq OWNER TO postgres;

--
-- Name: video_idvideo_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.video_idvideo_seq OWNED BY public.video.idvideo;


--
-- Name: visualizacao; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.visualizacao (
    idvisualizacao integer NOT NULL,
    idusuario integer,
    idvideo integer
);


ALTER TABLE public.visualizacao OWNER TO postgres;

--
-- Name: visualizacao_idvisualizacao_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.visualizacao_idvisualizacao_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.visualizacao_idvisualizacao_seq OWNER TO postgres;

--
-- Name: visualizacao_idvisualizacao_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.visualizacao_idvisualizacao_seq OWNED BY public.visualizacao.idvisualizacao;


--
-- Name: administrador idadministrador; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.administrador ALTER COLUMN idadministrador SET DEFAULT nextval('public.administrador_idadministrador_seq'::regclass);


--
-- Name: categorias idcategoria; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.categorias ALTER COLUMN idcategoria SET DEFAULT nextval('public.categoria_videos_idcategoria_seq'::regclass);


--
-- Name: usuario idusuario; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario ALTER COLUMN idusuario SET DEFAULT nextval('public.usuario_idusuario_seq'::regclass);


--
-- Name: video idvideo; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.video ALTER COLUMN idvideo SET DEFAULT nextval('public.video_idvideo_seq'::regclass);


--
-- Name: visualizacao idvisualizacao; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.visualizacao ALTER COLUMN idvisualizacao SET DEFAULT nextval('public.visualizacao_idvisualizacao_seq'::regclass);


--
-- Data for Name: administrador; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.administrador (idadministrador, nome_adm, gmail_adm, senha_adm) FROM stdin;
1	Rafael Zanelatto dos Santos	rafael.ifc34@gmail.com	$2b$10$.WHysNas/nKKxtcoWMGvjeSsB1NgJKQIpuzvI0wnVqXLjgjBH/l.i
2	Raquel	raquel@gmail.com	$2b$10$jdOLAElp591WlRh3j0SVZOXHSunQwN48qVcSkBC5cosdC1XZIqaZy
\.


--
-- Data for Name: categorias; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.categorias (idcategoria, nome_categoria) FROM stdin;
1	Nutrição
2	Treinos
\.


--
-- Data for Name: usuario; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.usuario (idusuario, gmail, nome, data_nascimento, peso, altura, telefone, status, foto, senha_usuario, "passwordResetToken", "passwordResetExpires") FROM stdin;
2	gostoso@gmail.com	Willian	2001-05-04	900	1.4	78548261742	Pago	/foto/1768849152018-homem-muito-gordo-34231060.webp	$2b$10$oRyqxsMd4mj/rq1JFR36/.IsMvm8SskSWNsQ1XRFvWaey4UZAM.NO	\N	\N
1	rafa@gmail.com	Rafael Zanelatto dos Santos	2007-03-05	80	1.7	(49) 99816-1984	Pago	\N	$2b$10$vp8QaVpSl5WvlZqm8D5N1e7wCSbe.Y1KtPrWlc6dFmYXNij4ucSqO	\N	\N
3	antoninhosantos11@gmail.com	Antoninho dos santos	1998-06-08	50	1.7	49998105861	Pago	\N	$2b$10$q6.n0OtzKO9ORvPGz03rI.ioqKS35InT2s3iU8nXbNrwqYgTRoxl6	2fd542d536b83317e7e8a096337297cdcaa90d8376b87cca6f83e82d979cc296	2026-01-20 17:24:28.406-03
4	rafazanelatto01849@gmail.com	textegmail	2008-02-05	60	1.2	(49) 99816-1984	Pago	\N	$2b$10$m/xona/QgNrvJL8nUlUC6.0AxotWTVhPa/q5QtkEgMZc3SMAgAMlu	\N	\N
\.


--
-- Data for Name: video; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.video (idvideo, imagem, titulo, link, descricao, idcategoria) FROM stdin;
2	/uploads/imagem/1768852777390-images.jpg	Red Dead Redemprion 2	https://youtu.be/gmA6MrX81z4?si=uW_02FWLBMrucVq5	O melhor jogo do mundo!	2
3	/uploads/imagem/1768957789387-3f7ee6aa3482b514bd443e116022b038a9728f017916ed37da3f09f731a7d5f2.avif	The witcher 3	https://youtu.be/c0i88t0Kacs?si=MSVoMFOwZaOkQeZo	segundo melhor jogo!	2
\.


--
-- Data for Name: visualizacao; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.visualizacao (idvisualizacao, idusuario, idvideo) FROM stdin;
1	1	2
2	1	3
\.


--
-- Name: administrador_idadministrador_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.administrador_idadministrador_seq', 2, true);


--
-- Name: categoria_videos_idcategoria_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.categoria_videos_idcategoria_seq', 2, true);


--
-- Name: usuario_idusuario_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.usuario_idusuario_seq', 5, true);


--
-- Name: video_idvideo_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.video_idvideo_seq', 3, true);


--
-- Name: visualizacao_idvisualizacao_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.visualizacao_idvisualizacao_seq', 2, true);


--
-- Name: administrador adm_gmail_unique; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.administrador
    ADD CONSTRAINT adm_gmail_unique UNIQUE (gmail_adm);


--
-- Name: administrador administrador_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.administrador
    ADD CONSTRAINT administrador_pkey PRIMARY KEY (idadministrador);


--
-- Name: categorias categoria_videos_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.categorias
    ADD CONSTRAINT categoria_videos_pkey PRIMARY KEY (idcategoria);


--
-- Name: usuario usuario_gmail_unique; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_gmail_unique UNIQUE (gmail);


--
-- Name: usuario usuario_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_pkey PRIMARY KEY (idusuario);


--
-- Name: video video_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.video
    ADD CONSTRAINT video_pkey PRIMARY KEY (idvideo);


--
-- Name: visualizacao visualizacao_idusuario_idvideo_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.visualizacao
    ADD CONSTRAINT visualizacao_idusuario_idvideo_key UNIQUE (idusuario, idvideo);


--
-- Name: visualizacao visualizacao_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.visualizacao
    ADD CONSTRAINT visualizacao_pkey PRIMARY KEY (idvisualizacao);


--
-- Name: visualizacao fk_visualizacao_usuario; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.visualizacao
    ADD CONSTRAINT fk_visualizacao_usuario FOREIGN KEY (idusuario) REFERENCES public.usuario(idusuario) ON UPDATE CASCADE NOT VALID;


--
-- PostgreSQL database dump complete
--

\unrestrict JlwZf2xcJ4HT2fSFY0fo2JCt1zm0EJq3lQpoydGGriO1Dm3hw9uaG15naoa620s

