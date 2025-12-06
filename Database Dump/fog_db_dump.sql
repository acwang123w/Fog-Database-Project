--
-- PostgreSQL database dump
--

\restrict gFULDMxcvaJ2wEJdAGznUwI9jjBKoA2mfqMbxnBG193N8reMiBekBHZjrmC7hW8

-- Dumped from database version 17.7
-- Dumped by pg_dump version 17.7

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
-- Name: steam; Type: SCHEMA; Schema: -; Owner: postgres
--

CREATE SCHEMA steam;


ALTER SCHEMA steam OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: achievements; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.achievements (
    achievement_id integer NOT NULL,
    game_id integer,
    name text NOT NULL,
    description text
);


ALTER TABLE public.achievements OWNER TO postgres;

--
-- Name: achievements_achievement_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.achievements_achievement_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.achievements_achievement_id_seq OWNER TO postgres;

--
-- Name: achievements_achievement_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.achievements_achievement_id_seq OWNED BY public.achievements.achievement_id;


--
-- Name: awards; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.awards (
    award_id integer NOT NULL,
    name text NOT NULL,
    category text NOT NULL,
    year integer NOT NULL
);


ALTER TABLE public.awards OWNER TO postgres;

--
-- Name: awards_award_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.awards_award_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.awards_award_id_seq OWNER TO postgres;

--
-- Name: awards_award_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.awards_award_id_seq OWNED BY public.awards.award_id;


--
-- Name: developers; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.developers (
    developer_id integer NOT NULL,
    name text NOT NULL,
    country text
);


ALTER TABLE public.developers OWNER TO postgres;

--
-- Name: developers_developer_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.developers_developer_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.developers_developer_id_seq OWNER TO postgres;

--
-- Name: developers_developer_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.developers_developer_id_seq OWNED BY public.developers.developer_id;


--
-- Name: friends; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.friends (
    user_id integer NOT NULL,
    friend_user_id integer NOT NULL,
    date_added timestamp without time zone DEFAULT now(),
    status text DEFAULT 'accepted'::text,
    CONSTRAINT friends_check CHECK ((user_id <> friend_user_id))
);


ALTER TABLE public.friends OWNER TO postgres;

--
-- Name: game_awards; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.game_awards (
    award_id integer NOT NULL,
    game_id integer NOT NULL
);


ALTER TABLE public.game_awards OWNER TO postgres;

--
-- Name: games; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.games (
    game_id integer NOT NULL,
    title text NOT NULL,
    developer_id integer,
    price numeric(10,2) NOT NULL,
    release_date date,
    content_rating text,
    categories text[],
    created_at timestamp without time zone DEFAULT now(),
    CONSTRAINT games_price_check CHECK ((price >= (0)::numeric))
);


ALTER TABLE public.games OWNER TO postgres;

--
-- Name: games_game_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.games_game_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.games_game_id_seq OWNER TO postgres;

--
-- Name: games_game_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.games_game_id_seq OWNED BY public.games.game_id;


--
-- Name: purchases; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.purchases (
    transaction_id integer NOT NULL,
    user_id integer,
    game_id integer,
    date timestamp without time zone DEFAULT now(),
    price numeric(10,2) NOT NULL,
    payment_method text NOT NULL,
    CONSTRAINT purchases_price_check CHECK ((price >= (0)::numeric))
);


ALTER TABLE public.purchases OWNER TO postgres;

--
-- Name: purchases_transaction_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.purchases_transaction_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.purchases_transaction_id_seq OWNER TO postgres;

--
-- Name: purchases_transaction_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.purchases_transaction_id_seq OWNED BY public.purchases.transaction_id;


--
-- Name: reviews; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.reviews (
    review_id integer NOT NULL,
    user_id integer,
    game_id integer,
    rating integer,
    contents text,
    date timestamp without time zone DEFAULT now(),
    CONSTRAINT reviews_rating_check CHECK (((rating >= 1) AND (rating <= 10)))
);


ALTER TABLE public.reviews OWNER TO postgres;

--
-- Name: reviews_review_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.reviews_review_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.reviews_review_id_seq OWNER TO postgres;

--
-- Name: reviews_review_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.reviews_review_id_seq OWNED BY public.reviews.review_id;


--
-- Name: user_achievements; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.user_achievements (
    achievement_id integer NOT NULL,
    user_id integer NOT NULL,
    date_achieved timestamp without time zone DEFAULT now(),
    is_hidden boolean DEFAULT false
);


ALTER TABLE public.user_achievements OWNER TO postgres;

--
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    user_id integer NOT NULL,
    email text NOT NULL,
    username text NOT NULL,
    password_hash text NOT NULL,
    country text,
    friend_code text,
    account_balance numeric(10,2) DEFAULT 0,
    status text DEFAULT 'active'::text,
    created_at timestamp without time zone DEFAULT now(),
    CONSTRAINT users_account_balance_check CHECK ((account_balance >= (0)::numeric))
);


ALTER TABLE public.users OWNER TO postgres;

--
-- Name: users_user_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.users_user_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.users_user_id_seq OWNER TO postgres;

--
-- Name: users_user_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.users_user_id_seq OWNED BY public.users.user_id;


--
-- Name: achievements; Type: TABLE; Schema: steam; Owner: postgres
--

CREATE TABLE steam.achievements (
    achievement_id integer NOT NULL,
    game_id integer,
    name text NOT NULL,
    description text
);


ALTER TABLE steam.achievements OWNER TO postgres;

--
-- Name: achievements_achievement_id_seq; Type: SEQUENCE; Schema: steam; Owner: postgres
--

CREATE SEQUENCE steam.achievements_achievement_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE steam.achievements_achievement_id_seq OWNER TO postgres;

--
-- Name: achievements_achievement_id_seq; Type: SEQUENCE OWNED BY; Schema: steam; Owner: postgres
--

ALTER SEQUENCE steam.achievements_achievement_id_seq OWNED BY steam.achievements.achievement_id;


--
-- Name: awards; Type: TABLE; Schema: steam; Owner: postgres
--

CREATE TABLE steam.awards (
    award_id integer NOT NULL,
    name text NOT NULL,
    category text NOT NULL,
    year integer NOT NULL
);


ALTER TABLE steam.awards OWNER TO postgres;

--
-- Name: awards_award_id_seq; Type: SEQUENCE; Schema: steam; Owner: postgres
--

CREATE SEQUENCE steam.awards_award_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE steam.awards_award_id_seq OWNER TO postgres;

--
-- Name: awards_award_id_seq; Type: SEQUENCE OWNED BY; Schema: steam; Owner: postgres
--

ALTER SEQUENCE steam.awards_award_id_seq OWNED BY steam.awards.award_id;


--
-- Name: developers; Type: TABLE; Schema: steam; Owner: postgres
--

CREATE TABLE steam.developers (
    developer_id integer NOT NULL,
    name text NOT NULL,
    country text
);


ALTER TABLE steam.developers OWNER TO postgres;

--
-- Name: developers_developer_id_seq; Type: SEQUENCE; Schema: steam; Owner: postgres
--

CREATE SEQUENCE steam.developers_developer_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE steam.developers_developer_id_seq OWNER TO postgres;

--
-- Name: developers_developer_id_seq; Type: SEQUENCE OWNED BY; Schema: steam; Owner: postgres
--

ALTER SEQUENCE steam.developers_developer_id_seq OWNED BY steam.developers.developer_id;


--
-- Name: friends; Type: TABLE; Schema: steam; Owner: postgres
--

CREATE TABLE steam.friends (
    user_id integer NOT NULL,
    friend_user_id integer NOT NULL,
    date_added timestamp without time zone DEFAULT now(),
    status text DEFAULT 'accepted'::text,
    CONSTRAINT friends_check CHECK ((user_id <> friend_user_id))
);


ALTER TABLE steam.friends OWNER TO postgres;

--
-- Name: game_awards; Type: TABLE; Schema: steam; Owner: postgres
--

CREATE TABLE steam.game_awards (
    award_id integer NOT NULL,
    game_id integer NOT NULL
);


ALTER TABLE steam.game_awards OWNER TO postgres;

--
-- Name: games; Type: TABLE; Schema: steam; Owner: postgres
--

CREATE TABLE steam.games (
    game_id integer NOT NULL,
    title text NOT NULL,
    developer_id integer,
    price numeric(10,2) NOT NULL,
    release_date date,
    content_rating text,
    categories text[],
    created_at timestamp without time zone DEFAULT now(),
    CONSTRAINT games_price_check CHECK ((price >= (0)::numeric))
);


ALTER TABLE steam.games OWNER TO postgres;

--
-- Name: games_game_id_seq; Type: SEQUENCE; Schema: steam; Owner: postgres
--

CREATE SEQUENCE steam.games_game_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE steam.games_game_id_seq OWNER TO postgres;

--
-- Name: games_game_id_seq; Type: SEQUENCE OWNED BY; Schema: steam; Owner: postgres
--

ALTER SEQUENCE steam.games_game_id_seq OWNED BY steam.games.game_id;


--
-- Name: purchases; Type: TABLE; Schema: steam; Owner: postgres
--

CREATE TABLE steam.purchases (
    transaction_id integer NOT NULL,
    user_id integer,
    game_id integer,
    date timestamp without time zone DEFAULT now(),
    price numeric(10,2) NOT NULL,
    payment_method text NOT NULL,
    CONSTRAINT purchases_price_check CHECK ((price >= (0)::numeric))
);


ALTER TABLE steam.purchases OWNER TO postgres;

--
-- Name: purchases_transaction_id_seq; Type: SEQUENCE; Schema: steam; Owner: postgres
--

CREATE SEQUENCE steam.purchases_transaction_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE steam.purchases_transaction_id_seq OWNER TO postgres;

--
-- Name: purchases_transaction_id_seq; Type: SEQUENCE OWNED BY; Schema: steam; Owner: postgres
--

ALTER SEQUENCE steam.purchases_transaction_id_seq OWNED BY steam.purchases.transaction_id;


--
-- Name: reviews; Type: TABLE; Schema: steam; Owner: postgres
--

CREATE TABLE steam.reviews (
    review_id integer NOT NULL,
    user_id integer,
    game_id integer,
    rating integer,
    contents text,
    date timestamp without time zone DEFAULT now(),
    CONSTRAINT reviews_rating_check CHECK (((rating >= 1) AND (rating <= 10)))
);


ALTER TABLE steam.reviews OWNER TO postgres;

--
-- Name: reviews_review_id_seq; Type: SEQUENCE; Schema: steam; Owner: postgres
--

CREATE SEQUENCE steam.reviews_review_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE steam.reviews_review_id_seq OWNER TO postgres;

--
-- Name: reviews_review_id_seq; Type: SEQUENCE OWNED BY; Schema: steam; Owner: postgres
--

ALTER SEQUENCE steam.reviews_review_id_seq OWNED BY steam.reviews.review_id;


--
-- Name: user_achievements; Type: TABLE; Schema: steam; Owner: postgres
--

CREATE TABLE steam.user_achievements (
    achievement_id integer NOT NULL,
    user_id integer NOT NULL,
    date_achieved timestamp without time zone DEFAULT now(),
    is_hidden boolean DEFAULT false
);


ALTER TABLE steam.user_achievements OWNER TO postgres;

--
-- Name: user_library; Type: VIEW; Schema: steam; Owner: postgres
--

CREATE VIEW steam.user_library AS
 SELECT user_id,
    game_id,
    max(date) AS purchased_at
   FROM steam.purchases p
  GROUP BY user_id, game_id;


ALTER VIEW steam.user_library OWNER TO postgres;

--
-- Name: users; Type: TABLE; Schema: steam; Owner: postgres
--

CREATE TABLE steam.users (
    user_id integer NOT NULL,
    email text NOT NULL,
    username text NOT NULL,
    password_hash text NOT NULL,
    country text,
    friend_code text,
    account_balance numeric(10,2) DEFAULT 0,
    status text DEFAULT 'active'::text,
    created_at timestamp without time zone DEFAULT now(),
    CONSTRAINT users_account_balance_check CHECK ((account_balance >= (0)::numeric))
);


ALTER TABLE steam.users OWNER TO postgres;

--
-- Name: users_user_id_seq; Type: SEQUENCE; Schema: steam; Owner: postgres
--

CREATE SEQUENCE steam.users_user_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE steam.users_user_id_seq OWNER TO postgres;

--
-- Name: users_user_id_seq; Type: SEQUENCE OWNED BY; Schema: steam; Owner: postgres
--

ALTER SEQUENCE steam.users_user_id_seq OWNED BY steam.users.user_id;


--
-- Name: achievements achievement_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.achievements ALTER COLUMN achievement_id SET DEFAULT nextval('public.achievements_achievement_id_seq'::regclass);


--
-- Name: awards award_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.awards ALTER COLUMN award_id SET DEFAULT nextval('public.awards_award_id_seq'::regclass);


--
-- Name: developers developer_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.developers ALTER COLUMN developer_id SET DEFAULT nextval('public.developers_developer_id_seq'::regclass);


--
-- Name: games game_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.games ALTER COLUMN game_id SET DEFAULT nextval('public.games_game_id_seq'::regclass);


--
-- Name: purchases transaction_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchases ALTER COLUMN transaction_id SET DEFAULT nextval('public.purchases_transaction_id_seq'::regclass);


--
-- Name: reviews review_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reviews ALTER COLUMN review_id SET DEFAULT nextval('public.reviews_review_id_seq'::regclass);


--
-- Name: users user_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users ALTER COLUMN user_id SET DEFAULT nextval('public.users_user_id_seq'::regclass);


--
-- Name: achievements achievement_id; Type: DEFAULT; Schema: steam; Owner: postgres
--

ALTER TABLE ONLY steam.achievements ALTER COLUMN achievement_id SET DEFAULT nextval('steam.achievements_achievement_id_seq'::regclass);


--
-- Name: awards award_id; Type: DEFAULT; Schema: steam; Owner: postgres
--

ALTER TABLE ONLY steam.awards ALTER COLUMN award_id SET DEFAULT nextval('steam.awards_award_id_seq'::regclass);


--
-- Name: developers developer_id; Type: DEFAULT; Schema: steam; Owner: postgres
--

ALTER TABLE ONLY steam.developers ALTER COLUMN developer_id SET DEFAULT nextval('steam.developers_developer_id_seq'::regclass);


--
-- Name: games game_id; Type: DEFAULT; Schema: steam; Owner: postgres
--

ALTER TABLE ONLY steam.games ALTER COLUMN game_id SET DEFAULT nextval('steam.games_game_id_seq'::regclass);


--
-- Name: purchases transaction_id; Type: DEFAULT; Schema: steam; Owner: postgres
--

ALTER TABLE ONLY steam.purchases ALTER COLUMN transaction_id SET DEFAULT nextval('steam.purchases_transaction_id_seq'::regclass);


--
-- Name: reviews review_id; Type: DEFAULT; Schema: steam; Owner: postgres
--

ALTER TABLE ONLY steam.reviews ALTER COLUMN review_id SET DEFAULT nextval('steam.reviews_review_id_seq'::regclass);


--
-- Name: users user_id; Type: DEFAULT; Schema: steam; Owner: postgres
--

ALTER TABLE ONLY steam.users ALTER COLUMN user_id SET DEFAULT nextval('steam.users_user_id_seq'::regclass);


--
-- Data for Name: achievements; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.achievements (achievement_id, game_id, name, description) FROM stdin;
1	1	Out of the Box	Finish test chamber 00
2	1	Cake Is a Lie	Discover the truth
3	2	Crowbar Beginner	Use crowbar
4	3	First Colony Founded	Build your first colony
\.


--
-- Data for Name: awards; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.awards (award_id, name, category, year) FROM stdin;
1	Fog Awards	Game of the Year	2023
2	Fog Awards	Labor of Love	2023
\.


--
-- Data for Name: developers; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.developers (developer_id, name, country) FROM stdin;
1	Valve	US
2	Black Mesa Devs	US
3	Night Owl Studios	UK
4	Sunbeam Interactive	JP
5	Arctic Fox	SE
6	Nebula Forge	US
\.


--
-- Data for Name: friends; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.friends (user_id, friend_user_id, date_added, status) FROM stdin;
\.


--
-- Data for Name: game_awards; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.game_awards (award_id, game_id) FROM stdin;
1	3
2	1
\.


--
-- Data for Name: games; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.games (game_id, title, developer_id, price, release_date, content_rating, categories, created_at) FROM stdin;
1	Portal	1	9.99	2007-10-10	T	{Puzzle,Singleplayer}	2025-12-04 15:25:19.402816
2	Half-Life 2	1	7.99	2004-11-16	M	{FPS,"Story Rich"}	2025-12-04 15:25:19.402816
3	Sky Colony	2	14.99	2023-05-12	T	{Indie,Strategy}	2025-12-04 15:25:19.402816
4	Star Drifter	6	19.99	2024-02-10	T	{Indie,Space,Roguelike}	2025-12-04 15:25:19.426047
5	Echoes of Dawn	4	24.99	2022-09-18	T	{RPG,Singleplayer,"Story Rich"}	2025-12-04 15:25:19.426047
6	Frostline	5	12.99	2021-12-05	T	{Survival,Crafting}	2025-12-04 15:25:19.426047
7	Circuit Clash	3	9.99	2020-07-21	E	{Arcade,Multiplayer}	2025-12-04 15:25:19.426047
8	Mystic Orchard	4	14.99	2023-04-15	E	{Simulation,Cozy}	2025-12-04 15:25:19.426047
9	Velocity Rush	6	29.99	2024-06-30	T	{Racing,Online}	2025-12-04 15:25:19.426047
10	Kingdoms & Keys	3	39.99	2022-11-11	T	{Strategy,"City Builder"}	2025-12-04 15:25:19.426047
\.


--
-- Data for Name: purchases; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.purchases (transaction_id, user_id, game_id, date, price, payment_method) FROM stdin;
1	1	1	2025-12-04 15:25:19.414748	9.99	card
2	1	2	2025-12-04 15:25:19.414748	7.99	card
3	2	1	2025-12-04 15:25:19.414748	9.99	balance
4	1	4	2025-12-04 15:25:19.428588	19.99	card
5	1	5	2025-12-04 15:25:19.428588	24.99	card
6	1	6	2025-12-04 15:25:19.428588	12.99	card
7	1	7	2025-12-04 15:25:19.428588	9.99	card
8	1	8	2025-12-04 15:25:19.428588	14.99	card
9	1	9	2025-12-04 15:25:19.428588	29.99	card
10	1	10	2025-12-04 15:25:19.428588	39.99	card
11	2	4	2025-12-04 15:25:19.431204	19.99	card
12	2	6	2025-12-04 15:25:19.431204	12.99	card
13	2	7	2025-12-04 15:25:19.431204	9.99	card
14	2	8	2025-12-04 15:25:19.431204	14.99	card
15	3	5	2025-12-04 15:25:19.433473	24.99	card
16	3	9	2025-12-04 15:25:19.433473	29.99	card
17	3	10	2025-12-04 15:25:19.433473	39.99	card
\.


--
-- Data for Name: reviews; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.reviews (review_id, user_id, game_id, rating, contents, date) FROM stdin;
1	1	1	10	Still amazing.	2025-12-04 15:25:19.417662
2	2	1	9	Mind-bending puzzles!	2025-12-04 15:25:19.417662
3	1	4	8	Great roguelike loops and space vibes.	2025-12-04 15:25:19.435365
4	2	4	7	Fun, could use more ship types.	2025-12-04 15:25:19.437281
5	1	5	9	Narrative is top tier.	2025-12-04 15:25:19.439245
6	3	5	8	Beautiful OST and art direction.	2025-12-04 15:25:19.440891
7	2	6	6	Chilly grind, satisfying crafting.	2025-12-04 15:25:19.442931
8	1	7	7	Arcade chaos with friends.	2025-12-04 15:25:19.444633
9	2	7	7	Simple and addictive.	2025-12-04 15:25:19.446276
10	1	8	9	Ultra cozy farming loop.	2025-12-04 15:25:19.447703
11	2	8	8	Chill and cute.	2025-12-04 15:25:19.449407
12	1	9	8	Fast and clean handling.	2025-12-04 15:25:19.451122
13	3	9	7	Online lobbies are lively.	2025-12-04 15:25:19.453232
14	1	10	8	Deep systems; tough but fair.	2025-12-04 15:25:19.454976
15	3	10	9	City-builder bliss with puzzles.	2025-12-04 15:25:19.456671
\.


--
-- Data for Name: user_achievements; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.user_achievements (achievement_id, user_id, date_achieved, is_hidden) FROM stdin;
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (user_id, email, username, password_hash, country, friend_code, account_balance, status, created_at) FROM stdin;
1	alice@example.com	aliceuser	$2b$10$dummydummydummydummydummy111	US	ALC-123	50.00	active	2025-12-04 15:25:19.395766
2	bob@example.com	bobuser	$2b$10$dummydummydummydummydummy222	US	BOB-456	20.00	active	2025-12-04 15:25:19.395766
3	cara@example.com	carauser	$2b$10$dummydummydummydummydummy333	CA	CAR-789	10.00	active	2025-12-04 15:25:19.395766
\.


--
-- Data for Name: achievements; Type: TABLE DATA; Schema: steam; Owner: postgres
--

COPY steam.achievements (achievement_id, game_id, name, description) FROM stdin;
1	1	Out of the Box	Finish test chamber 00
2	1	Cake Is a Lie	Discover the truth
3	2	Crowbar Beginner	Use crowbar
4	3	First Colony Founded	Build your first colony
6	1	Defeat Glados!	You have bested GlaDoS!
\.


--
-- Data for Name: awards; Type: TABLE DATA; Schema: steam; Owner: postgres
--

COPY steam.awards (award_id, name, category, year) FROM stdin;
1	Fog Awards	Game of the Year	2023
2	Fog Awards	Labor of Love	2023
\.


--
-- Data for Name: developers; Type: TABLE DATA; Schema: steam; Owner: postgres
--

COPY steam.developers (developer_id, name, country) FROM stdin;
1	Valve	US
2	Black Mesa Devs	US
3	Night Owl Studios	UK
4	Sunbeam Interactive	JP
5	Arctic Fox	SE
6	Nebula Forge	US
\.


--
-- Data for Name: friends; Type: TABLE DATA; Schema: steam; Owner: postgres
--

COPY steam.friends (user_id, friend_user_id, date_added, status) FROM stdin;
2	1	2025-12-04 20:13:43.903249	accepted
1	3	2025-12-04 20:54:30.19151	accepted
4	1	\N	pending
3	4	2025-12-04 22:59:14.603862	accepted
5	4	\N	pending
5	2	\N	pending
5	1	2025-12-04 23:03:14.392889	accepted
6	1	2025-12-04 23:47:00.308843	accepted
\.


--
-- Data for Name: game_awards; Type: TABLE DATA; Schema: steam; Owner: postgres
--

COPY steam.game_awards (award_id, game_id) FROM stdin;
1	3
2	1
\.


--
-- Data for Name: games; Type: TABLE DATA; Schema: steam; Owner: postgres
--

COPY steam.games (game_id, title, developer_id, price, release_date, content_rating, categories, created_at) FROM stdin;
1	Portal	1	9.99	2007-10-10	T	{Puzzle,Singleplayer}	2025-12-04 16:35:26.572405
2	Half-Life 2	1	7.99	2004-11-16	M	{FPS,"Story Rich"}	2025-12-04 16:35:26.572405
3	Sky Colony	2	14.99	2023-05-12	T	{Indie,Strategy}	2025-12-04 16:35:26.572405
4	Star Drifter	6	19.99	2024-02-10	T	{Indie,Space,Roguelike}	2025-12-04 16:35:36.486934
5	Echoes of Dawn	4	24.99	2022-09-18	T	{RPG,Singleplayer,"Story Rich"}	2025-12-04 16:35:36.486934
6	Frostline	5	12.99	2021-12-05	T	{Survival,Crafting}	2025-12-04 16:35:36.486934
7	Circuit Clash	3	9.99	2020-07-21	E	{Arcade,Multiplayer}	2025-12-04 16:35:36.486934
8	Mystic Orchard	4	14.99	2023-04-15	E	{Simulation,Cozy}	2025-12-04 16:35:36.486934
9	Velocity Rush	6	29.99	2024-06-30	T	{Racing,Online}	2025-12-04 16:35:36.486934
10	Kingdoms & Keys	3	39.99	2022-11-11	T	{Strategy,"City Builder"}	2025-12-04 16:35:36.486934
\.


--
-- Data for Name: purchases; Type: TABLE DATA; Schema: steam; Owner: postgres
--

COPY steam.purchases (transaction_id, user_id, game_id, date, price, payment_method) FROM stdin;
3	2	1	2025-12-04 16:35:26.58149	9.99	balance
11	2	4	2025-12-04 16:35:36.491695	19.99	card
12	2	6	2025-12-04 16:35:36.491695	12.99	card
13	2	7	2025-12-04 16:35:36.491695	9.99	card
14	2	8	2025-12-04 16:35:36.491695	14.99	card
15	3	5	2025-12-04 16:35:36.492285	24.99	card
16	3	9	2025-12-04 16:35:36.492285	29.99	card
17	3	10	2025-12-04 16:35:36.492285	39.99	card
28	1	7	2025-12-04 22:48:35.595539	9.99	balance
29	1	2	2025-12-04 22:48:42.175499	7.99	balance
30	1	1	2025-12-04 22:48:47.551544	9.99	balance
31	1	3	2025-12-04 22:49:48.736844	14.99	balance
32	1	4	2025-12-04 22:49:53.116969	19.99	balance
33	4	1	2025-12-04 22:57:53.605141	9.99	balance
35	6	1	2025-12-04 23:45:51.384059	9.99	balance
36	6	2	2025-12-04 23:46:12.350852	7.99	balance
\.


--
-- Data for Name: reviews; Type: TABLE DATA; Schema: steam; Owner: postgres
--

COPY steam.reviews (review_id, user_id, game_id, rating, contents, date) FROM stdin;
1	1	1	10	Still amazing.	2025-12-04 16:35:26.582855
2	2	1	9	Mind-bending puzzles!	2025-12-04 16:35:26.582855
3	1	4	8	Great roguelike loops and space vibes.	2025-12-04 16:35:36.49278
4	2	4	7	Fun, could use more ship types.	2025-12-04 16:35:36.493739
5	1	5	9	Narrative is top tier.	2025-12-04 16:35:36.494336
6	3	5	8	Beautiful OST and art direction.	2025-12-04 16:35:36.494803
7	2	6	6	Chilly grind, satisfying crafting.	2025-12-04 16:35:36.495236
8	1	7	7	Arcade chaos with friends.	2025-12-04 16:35:36.495704
9	2	7	7	Simple and addictive.	2025-12-04 16:35:36.496115
10	1	8	9	Ultra cozy farming loop.	2025-12-04 16:35:36.496451
11	2	8	8	Chill and cute.	2025-12-04 16:35:36.49677
12	1	9	8	Fast and clean handling.	2025-12-04 16:35:36.497111
13	3	9	7	Online lobbies are lively.	2025-12-04 16:35:36.497527
14	1	10	8	Deep systems; tough but fair.	2025-12-04 16:35:36.49798
15	3	10	9	City-builder bliss with puzzles.	2025-12-04 16:35:36.498471
16	1	3	10	Great Game!	2025-12-04 19:55:56.506531
19	5	3	10	Nvm it's ok	2025-12-04 23:02:15.701645
21	6	1	10	This game is awesome!!	2025-12-04 23:46:04.891587
22	6	2	1	This game sucks!	2025-12-04 23:46:23.865702
\.


--
-- Data for Name: user_achievements; Type: TABLE DATA; Schema: steam; Owner: postgres
--

COPY steam.user_achievements (achievement_id, user_id, date_achieved, is_hidden) FROM stdin;
3	1	2025-12-04 20:43:31.422051	f
1	1	2025-12-04 22:53:35.771162	f
6	1	2025-12-04 23:03:41.458618	f
2	4	2025-12-04 23:35:48.790888	f
6	4	2025-12-04 23:35:49.857882	f
1	4	2025-12-04 23:35:50.570071	f
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: steam; Owner: postgres
--

COPY steam.users (user_id, email, username, password_hash, country, friend_code, account_balance, status, created_at) FROM stdin;
2	bob@example.com	bobuser	bobpass	US	BOB-456	20.00	active	2025-12-04 16:35:26.566437
3	cara@example.com	carauser	carapass	CA	CAR-789	10.00	Dreaming of a Blue Moon	2025-12-04 16:35:26.566437
4	test1@gmail.com	testuser	testpass	US	EGU-312	40.01	active	2025-12-04 20:39:26.936563
5	alex@gmail.com	alex	alexpass	US	UTM-912	0.00	Hello	2025-12-04 23:00:18.02043
6	demo@gmail.com	demouser	demopass	CA	XHT-278	32.02	Hello World!	2025-12-04 23:44:36.706296
1	alice@example.com	aliceuser	alicepass	US	ALC-123	52.06	Freedom!	2025-12-04 16:35:26.566437
\.


--
-- Name: achievements_achievement_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.achievements_achievement_id_seq', 4, true);


--
-- Name: awards_award_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.awards_award_id_seq', 2, true);


--
-- Name: developers_developer_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.developers_developer_id_seq', 6, true);


--
-- Name: games_game_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.games_game_id_seq', 10, true);


--
-- Name: purchases_transaction_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.purchases_transaction_id_seq', 17, true);


--
-- Name: reviews_review_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.reviews_review_id_seq', 15, true);


--
-- Name: users_user_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_user_id_seq', 3, true);


--
-- Name: achievements_achievement_id_seq; Type: SEQUENCE SET; Schema: steam; Owner: postgres
--

SELECT pg_catalog.setval('steam.achievements_achievement_id_seq', 6, true);


--
-- Name: awards_award_id_seq; Type: SEQUENCE SET; Schema: steam; Owner: postgres
--

SELECT pg_catalog.setval('steam.awards_award_id_seq', 2, true);


--
-- Name: developers_developer_id_seq; Type: SEQUENCE SET; Schema: steam; Owner: postgres
--

SELECT pg_catalog.setval('steam.developers_developer_id_seq', 6, true);


--
-- Name: games_game_id_seq; Type: SEQUENCE SET; Schema: steam; Owner: postgres
--

SELECT pg_catalog.setval('steam.games_game_id_seq', 10, true);


--
-- Name: purchases_transaction_id_seq; Type: SEQUENCE SET; Schema: steam; Owner: postgres
--

SELECT pg_catalog.setval('steam.purchases_transaction_id_seq', 36, true);


--
-- Name: reviews_review_id_seq; Type: SEQUENCE SET; Schema: steam; Owner: postgres
--

SELECT pg_catalog.setval('steam.reviews_review_id_seq', 22, true);


--
-- Name: users_user_id_seq; Type: SEQUENCE SET; Schema: steam; Owner: postgres
--

SELECT pg_catalog.setval('steam.users_user_id_seq', 6, true);


--
-- Name: achievements achievements_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.achievements
    ADD CONSTRAINT achievements_pkey PRIMARY KEY (achievement_id);


--
-- Name: awards awards_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.awards
    ADD CONSTRAINT awards_pkey PRIMARY KEY (award_id);


--
-- Name: developers developers_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.developers
    ADD CONSTRAINT developers_pkey PRIMARY KEY (developer_id);


--
-- Name: friends friends_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.friends
    ADD CONSTRAINT friends_pkey PRIMARY KEY (user_id, friend_user_id);


--
-- Name: game_awards game_awards_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.game_awards
    ADD CONSTRAINT game_awards_pkey PRIMARY KEY (award_id, game_id);


--
-- Name: games games_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.games
    ADD CONSTRAINT games_pkey PRIMARY KEY (game_id);


--
-- Name: purchases purchases_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchases
    ADD CONSTRAINT purchases_pkey PRIMARY KEY (transaction_id);


--
-- Name: reviews reviews_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT reviews_pkey PRIMARY KEY (review_id);


--
-- Name: reviews reviews_user_id_game_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT reviews_user_id_game_id_key UNIQUE (user_id, game_id);


--
-- Name: user_achievements user_achievements_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_achievements
    ADD CONSTRAINT user_achievements_pkey PRIMARY KEY (achievement_id, user_id);


--
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- Name: users users_friend_code_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_friend_code_key UNIQUE (friend_code);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (user_id);


--
-- Name: achievements achievements_pkey; Type: CONSTRAINT; Schema: steam; Owner: postgres
--

ALTER TABLE ONLY steam.achievements
    ADD CONSTRAINT achievements_pkey PRIMARY KEY (achievement_id);


--
-- Name: awards awards_pkey; Type: CONSTRAINT; Schema: steam; Owner: postgres
--

ALTER TABLE ONLY steam.awards
    ADD CONSTRAINT awards_pkey PRIMARY KEY (award_id);


--
-- Name: developers developers_pkey; Type: CONSTRAINT; Schema: steam; Owner: postgres
--

ALTER TABLE ONLY steam.developers
    ADD CONSTRAINT developers_pkey PRIMARY KEY (developer_id);


--
-- Name: friends friends_pkey; Type: CONSTRAINT; Schema: steam; Owner: postgres
--

ALTER TABLE ONLY steam.friends
    ADD CONSTRAINT friends_pkey PRIMARY KEY (user_id, friend_user_id);


--
-- Name: game_awards game_awards_pkey; Type: CONSTRAINT; Schema: steam; Owner: postgres
--

ALTER TABLE ONLY steam.game_awards
    ADD CONSTRAINT game_awards_pkey PRIMARY KEY (award_id, game_id);


--
-- Name: games games_pkey; Type: CONSTRAINT; Schema: steam; Owner: postgres
--

ALTER TABLE ONLY steam.games
    ADD CONSTRAINT games_pkey PRIMARY KEY (game_id);


--
-- Name: purchases purchases_pkey; Type: CONSTRAINT; Schema: steam; Owner: postgres
--

ALTER TABLE ONLY steam.purchases
    ADD CONSTRAINT purchases_pkey PRIMARY KEY (transaction_id);


--
-- Name: reviews reviews_pkey; Type: CONSTRAINT; Schema: steam; Owner: postgres
--

ALTER TABLE ONLY steam.reviews
    ADD CONSTRAINT reviews_pkey PRIMARY KEY (review_id);


--
-- Name: reviews reviews_user_id_game_id_key; Type: CONSTRAINT; Schema: steam; Owner: postgres
--

ALTER TABLE ONLY steam.reviews
    ADD CONSTRAINT reviews_user_id_game_id_key UNIQUE (user_id, game_id);


--
-- Name: user_achievements user_achievements_pkey; Type: CONSTRAINT; Schema: steam; Owner: postgres
--

ALTER TABLE ONLY steam.user_achievements
    ADD CONSTRAINT user_achievements_pkey PRIMARY KEY (achievement_id, user_id);


--
-- Name: users users_email_key; Type: CONSTRAINT; Schema: steam; Owner: postgres
--

ALTER TABLE ONLY steam.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- Name: users users_friend_code_key; Type: CONSTRAINT; Schema: steam; Owner: postgres
--

ALTER TABLE ONLY steam.users
    ADD CONSTRAINT users_friend_code_key UNIQUE (friend_code);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: steam; Owner: postgres
--

ALTER TABLE ONLY steam.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (user_id);


--
-- Name: idx_games_categories; Type: INDEX; Schema: steam; Owner: postgres
--

CREATE INDEX idx_games_categories ON steam.games USING gin (categories);


--
-- Name: idx_games_title; Type: INDEX; Schema: steam; Owner: postgres
--

CREATE INDEX idx_games_title ON steam.games USING gin (to_tsvector('english'::regconfig, title));


--
-- Name: idx_reviews_game; Type: INDEX; Schema: steam; Owner: postgres
--

CREATE INDEX idx_reviews_game ON steam.reviews USING btree (game_id);


--
-- Name: achievements achievements_game_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.achievements
    ADD CONSTRAINT achievements_game_id_fkey FOREIGN KEY (game_id) REFERENCES public.games(game_id) ON DELETE CASCADE;


--
-- Name: friends friends_friend_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.friends
    ADD CONSTRAINT friends_friend_user_id_fkey FOREIGN KEY (friend_user_id) REFERENCES public.users(user_id) ON DELETE CASCADE;


--
-- Name: friends friends_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.friends
    ADD CONSTRAINT friends_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(user_id) ON DELETE CASCADE;


--
-- Name: game_awards game_awards_award_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.game_awards
    ADD CONSTRAINT game_awards_award_id_fkey FOREIGN KEY (award_id) REFERENCES public.awards(award_id) ON DELETE CASCADE;


--
-- Name: game_awards game_awards_game_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.game_awards
    ADD CONSTRAINT game_awards_game_id_fkey FOREIGN KEY (game_id) REFERENCES public.games(game_id) ON DELETE CASCADE;


--
-- Name: games games_developer_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.games
    ADD CONSTRAINT games_developer_id_fkey FOREIGN KEY (developer_id) REFERENCES public.developers(developer_id) ON DELETE SET NULL;


--
-- Name: purchases purchases_game_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchases
    ADD CONSTRAINT purchases_game_id_fkey FOREIGN KEY (game_id) REFERENCES public.games(game_id) ON DELETE CASCADE;


--
-- Name: purchases purchases_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchases
    ADD CONSTRAINT purchases_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(user_id) ON DELETE CASCADE;


--
-- Name: reviews reviews_game_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT reviews_game_id_fkey FOREIGN KEY (game_id) REFERENCES public.games(game_id) ON DELETE CASCADE;


--
-- Name: reviews reviews_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT reviews_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(user_id) ON DELETE CASCADE;


--
-- Name: user_achievements user_achievements_achievement_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_achievements
    ADD CONSTRAINT user_achievements_achievement_id_fkey FOREIGN KEY (achievement_id) REFERENCES public.achievements(achievement_id) ON DELETE CASCADE;


--
-- Name: user_achievements user_achievements_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_achievements
    ADD CONSTRAINT user_achievements_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(user_id) ON DELETE CASCADE;


--
-- Name: achievements achievements_game_id_fkey; Type: FK CONSTRAINT; Schema: steam; Owner: postgres
--

ALTER TABLE ONLY steam.achievements
    ADD CONSTRAINT achievements_game_id_fkey FOREIGN KEY (game_id) REFERENCES steam.games(game_id) ON DELETE CASCADE;


--
-- Name: friends friends_friend_user_id_fkey; Type: FK CONSTRAINT; Schema: steam; Owner: postgres
--

ALTER TABLE ONLY steam.friends
    ADD CONSTRAINT friends_friend_user_id_fkey FOREIGN KEY (friend_user_id) REFERENCES steam.users(user_id) ON DELETE CASCADE;


--
-- Name: friends friends_user_id_fkey; Type: FK CONSTRAINT; Schema: steam; Owner: postgres
--

ALTER TABLE ONLY steam.friends
    ADD CONSTRAINT friends_user_id_fkey FOREIGN KEY (user_id) REFERENCES steam.users(user_id) ON DELETE CASCADE;


--
-- Name: game_awards game_awards_award_id_fkey; Type: FK CONSTRAINT; Schema: steam; Owner: postgres
--

ALTER TABLE ONLY steam.game_awards
    ADD CONSTRAINT game_awards_award_id_fkey FOREIGN KEY (award_id) REFERENCES steam.awards(award_id) ON DELETE CASCADE;


--
-- Name: game_awards game_awards_game_id_fkey; Type: FK CONSTRAINT; Schema: steam; Owner: postgres
--

ALTER TABLE ONLY steam.game_awards
    ADD CONSTRAINT game_awards_game_id_fkey FOREIGN KEY (game_id) REFERENCES steam.games(game_id) ON DELETE CASCADE;


--
-- Name: games games_developer_id_fkey; Type: FK CONSTRAINT; Schema: steam; Owner: postgres
--

ALTER TABLE ONLY steam.games
    ADD CONSTRAINT games_developer_id_fkey FOREIGN KEY (developer_id) REFERENCES steam.developers(developer_id) ON DELETE SET NULL;


--
-- Name: purchases purchases_game_id_fkey; Type: FK CONSTRAINT; Schema: steam; Owner: postgres
--

ALTER TABLE ONLY steam.purchases
    ADD CONSTRAINT purchases_game_id_fkey FOREIGN KEY (game_id) REFERENCES steam.games(game_id) ON DELETE CASCADE;


--
-- Name: purchases purchases_user_id_fkey; Type: FK CONSTRAINT; Schema: steam; Owner: postgres
--

ALTER TABLE ONLY steam.purchases
    ADD CONSTRAINT purchases_user_id_fkey FOREIGN KEY (user_id) REFERENCES steam.users(user_id) ON DELETE CASCADE;


--
-- Name: reviews reviews_game_id_fkey; Type: FK CONSTRAINT; Schema: steam; Owner: postgres
--

ALTER TABLE ONLY steam.reviews
    ADD CONSTRAINT reviews_game_id_fkey FOREIGN KEY (game_id) REFERENCES steam.games(game_id) ON DELETE CASCADE;


--
-- Name: reviews reviews_user_id_fkey; Type: FK CONSTRAINT; Schema: steam; Owner: postgres
--

ALTER TABLE ONLY steam.reviews
    ADD CONSTRAINT reviews_user_id_fkey FOREIGN KEY (user_id) REFERENCES steam.users(user_id) ON DELETE CASCADE;


--
-- Name: user_achievements user_achievements_achievement_id_fkey; Type: FK CONSTRAINT; Schema: steam; Owner: postgres
--

ALTER TABLE ONLY steam.user_achievements
    ADD CONSTRAINT user_achievements_achievement_id_fkey FOREIGN KEY (achievement_id) REFERENCES steam.achievements(achievement_id) ON DELETE CASCADE;


--
-- Name: user_achievements user_achievements_user_id_fkey; Type: FK CONSTRAINT; Schema: steam; Owner: postgres
--

ALTER TABLE ONLY steam.user_achievements
    ADD CONSTRAINT user_achievements_user_id_fkey FOREIGN KEY (user_id) REFERENCES steam.users(user_id) ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

\unrestrict gFULDMxcvaJ2wEJdAGznUwI9jjBKoA2mfqMbxnBG193N8reMiBekBHZjrmC7hW8

