--
-- PostgreSQL database dump
--

-- Dumped from database version 14.15 (Debian 14.15-1.pgdg120+1)
-- Dumped by pg_dump version 14.15 (Debian 14.15-1.pgdg120+1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: calculate_discounted_cost(character varying, integer, integer); Type: FUNCTION; Schema: public; Owner: user
--

CREATE FUNCTION public.calculate_discounted_cost(v_call_type character varying, v_duration integer, v_years_of_service integer) RETURNS TABLE(base_cost numeric, discount_applied numeric, final_cost numeric)
    LANGUAGE plpgsql
    AS $$
BEGIN
    RETURN QUERY
    SELECT 
        v_duration * r.cost_per_minute AS base_cost,
        LEAST(r.discount_per_year * v_years_of_service, r.max_discount) AS discount_applied,
        v_duration * r.cost_per_minute * (1 - LEAST(r.discount_per_year * v_years_of_service, r.max_discount)) AS final_cost
    FROM rates r
    WHERE r.call_type = v_call_type;
END;
$$;


ALTER FUNCTION public.calculate_discounted_cost(v_call_type character varying, v_duration integer, v_years_of_service integer) OWNER TO "user";

--
-- Name: calculate_tenure(date); Type: FUNCTION; Schema: public; Owner: user
--

CREATE FUNCTION public.calculate_tenure(hire_date date) RETURNS integer
    LANGUAGE plpgsql
    AS $$
BEGIN
    RETURN EXTRACT(YEAR FROM CURRENT_DATE) - EXTRACT(YEAR FROM hire_date);
END;
$$;


ALTER FUNCTION public.calculate_tenure(hire_date date) OWNER TO "user";

--
-- Name: get_employee_contact_info(); Type: FUNCTION; Schema: public; Owner: user
--

CREATE FUNCTION public.get_employee_contact_info() RETURNS TABLE(full_name character varying, "position" character varying, department_name character varying, internal_phone_number character varying)
    LANGUAGE plpgsql
    AS $$
BEGIN
    RETURN QUERY
    SELECT 
        e.full_name, 
        e."position",
        d.name AS department_name,
        e.internal_phone_number
    FROM employees e
    INNER JOIN departments d ON e.department_id = d.department_id
    ORDER BY d.name; -- Сортировка по департаменту
END;
$$;


ALTER FUNCTION public.get_employee_contact_info() OWNER TO "user";

--
-- Name: get_monthly_billing_summary(character varying); Type: FUNCTION; Schema: public; Owner: user
--

CREATE FUNCTION public.get_monthly_billing_summary(month_year_input character varying) RETURNS TABLE(total_amount numeric, paid_amount numeric, unpaid_bills integer[])
    LANGUAGE plpgsql
    AS $$
BEGIN
    -- Общая сумма денег за месяц
    RETURN QUERY
    SELECT
        COALESCE(SUM(final_amount), 0) AS total_amount,
        COALESCE(SUM(final_amount) FILTER (WHERE payment_status = 'PAID'), 0) AS paid_amount,
        ARRAY_AGG(bill_id) FILTER (WHERE payment_status = 'UNPAID') AS unpaid_bills
    FROM bills
    WHERE month_year = month_year_input;
END;
$$;


ALTER FUNCTION public.get_monthly_billing_summary(month_year_input character varying) OWNER TO "user";

--
-- Name: log_payment_status_change(); Type: FUNCTION; Schema: public; Owner: user
--

CREATE FUNCTION public.log_payment_status_change() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    INSERT INTO payments_log (bill_id, old_status, new_status)
    VALUES (OLD.bill_id, OLD.payment_status, NEW.payment_status);
    RETURN NEW;
END;
$$;


ALTER FUNCTION public.log_payment_status_change() OWNER TO "user";

--
-- Name: round_final_amount(); Type: FUNCTION; Schema: public; Owner: user
--

CREATE FUNCTION public.round_final_amount() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    NEW.final_amount := ROUND(NEW.final_amount);
    RETURN NEW;
END;
$$;


ALTER FUNCTION public.round_final_amount() OWNER TO "user";

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: bills; Type: TABLE; Schema: public; Owner: user
--

CREATE TABLE public.bills (
    bill_id integer NOT NULL,
    employee_id integer NOT NULL,
    month_year character varying(7) NOT NULL,
    total_duration integer DEFAULT 0 NOT NULL,
    total_cost numeric(10,2) DEFAULT 0.00 NOT NULL,
    discount_applied numeric(10,2) DEFAULT 0.00 NOT NULL,
    final_amount numeric(10,2) DEFAULT 0.00 NOT NULL,
    payment_status character varying(20) DEFAULT 'UNPAID'::character varying NOT NULL
);


ALTER TABLE public.bills OWNER TO "user";

--
-- Name: bills_bill_id_seq; Type: SEQUENCE; Schema: public; Owner: user
--

CREATE SEQUENCE public.bills_bill_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.bills_bill_id_seq OWNER TO "user";

--
-- Name: bills_bill_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: user
--

ALTER SEQUENCE public.bills_bill_id_seq OWNED BY public.bills.bill_id;


--
-- Name: departments; Type: TABLE; Schema: public; Owner: user
--

CREATE TABLE public.departments (
    department_id integer NOT NULL,
    name character varying(100) NOT NULL
);


ALTER TABLE public.departments OWNER TO "user";

--
-- Name: employees; Type: TABLE; Schema: public; Owner: user
--

CREATE TABLE public.employees (
    employee_id integer NOT NULL,
    card_number character varying(50) NOT NULL,
    full_name character varying(255) NOT NULL,
    "position" character varying(100),
    department_id integer NOT NULL,
    internal_phone_number character varying(20) NOT NULL,
    hire_date date NOT NULL
);


ALTER TABLE public.employees OWNER TO "user";

--
-- Name: department_phone_directory; Type: VIEW; Schema: public; Owner: user
--

CREATE VIEW public.department_phone_directory AS
 SELECT d.name AS department_name,
    e.full_name,
    e.internal_phone_number
   FROM (public.employees e
     JOIN public.departments d ON ((e.department_id = d.department_id)))
  ORDER BY d.name, e.full_name;


ALTER TABLE public.department_phone_directory OWNER TO "user";

--
-- Name: departments_department_id_seq; Type: SEQUENCE; Schema: public; Owner: user
--

CREATE SEQUENCE public.departments_department_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.departments_department_id_seq OWNER TO "user";

--
-- Name: departments_department_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: user
--

ALTER SEQUENCE public.departments_department_id_seq OWNED BY public.departments.department_id;


--
-- Name: employees_employee_id_seq; Type: SEQUENCE; Schema: public; Owner: user
--

CREATE SEQUENCE public.employees_employee_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.employees_employee_id_seq OWNER TO "user";

--
-- Name: employees_employee_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: user
--

ALTER SEQUENCE public.employees_employee_id_seq OWNED BY public.employees.employee_id;


--
-- Name: payments_log; Type: TABLE; Schema: public; Owner: user
--

CREATE TABLE public.payments_log (
    log_id integer NOT NULL,
    bill_id integer,
    old_status character varying(20),
    new_status character varying(20),
    change_date timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.payments_log OWNER TO "user";

--
-- Name: payments_log_log_id_seq; Type: SEQUENCE; Schema: public; Owner: user
--

CREATE SEQUENCE public.payments_log_log_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.payments_log_log_id_seq OWNER TO "user";

--
-- Name: payments_log_log_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: user
--

ALTER SEQUENCE public.payments_log_log_id_seq OWNED BY public.payments_log.log_id;


--
-- Name: rates; Type: TABLE; Schema: public; Owner: user
--

CREATE TABLE public.rates (
    rate_id integer NOT NULL,
    call_type character varying NOT NULL,
    cost_per_minute numeric NOT NULL,
    discount_per_year numeric NOT NULL,
    max_discount numeric NOT NULL,
    CONSTRAINT rates_call_type_check CHECK (((call_type)::text = ANY ((ARRAY['local'::character varying, 'intercity'::character varying, 'international'::character varying])::text[])))
);


ALTER TABLE public.rates OWNER TO "user";

--
-- Name: rates_rate_id_seq; Type: SEQUENCE; Schema: public; Owner: user
--

CREATE SEQUENCE public.rates_rate_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.rates_rate_id_seq OWNER TO "user";

--
-- Name: rates_rate_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: user
--

ALTER SEQUENCE public.rates_rate_id_seq OWNED BY public.rates.rate_id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: user
--

CREATE TABLE public.users (
    user_id integer NOT NULL,
    username character varying(50) NOT NULL,
    password_hash character varying(255) NOT NULL,
    role character varying(50) NOT NULL,
    employee_id integer,
    CONSTRAINT users_role_check CHECK (((role)::text = ANY ((ARRAY['admin'::character varying, 'accountant'::character varying, 'user'::character varying])::text[])))
);


ALTER TABLE public.users OWNER TO "user";

--
-- Name: users_user_id_seq; Type: SEQUENCE; Schema: public; Owner: user
--

CREATE SEQUENCE public.users_user_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.users_user_id_seq OWNER TO "user";

--
-- Name: users_user_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: user
--

ALTER SEQUENCE public.users_user_id_seq OWNED BY public.users.user_id;


--
-- Name: bills bill_id; Type: DEFAULT; Schema: public; Owner: user
--

ALTER TABLE ONLY public.bills ALTER COLUMN bill_id SET DEFAULT nextval('public.bills_bill_id_seq'::regclass);


--
-- Name: departments department_id; Type: DEFAULT; Schema: public; Owner: user
--

ALTER TABLE ONLY public.departments ALTER COLUMN department_id SET DEFAULT nextval('public.departments_department_id_seq'::regclass);


--
-- Name: employees employee_id; Type: DEFAULT; Schema: public; Owner: user
--

ALTER TABLE ONLY public.employees ALTER COLUMN employee_id SET DEFAULT nextval('public.employees_employee_id_seq'::regclass);


--
-- Name: payments_log log_id; Type: DEFAULT; Schema: public; Owner: user
--

ALTER TABLE ONLY public.payments_log ALTER COLUMN log_id SET DEFAULT nextval('public.payments_log_log_id_seq'::regclass);


--
-- Name: rates rate_id; Type: DEFAULT; Schema: public; Owner: user
--

ALTER TABLE ONLY public.rates ALTER COLUMN rate_id SET DEFAULT nextval('public.rates_rate_id_seq'::regclass);


--
-- Name: users user_id; Type: DEFAULT; Schema: public; Owner: user
--

ALTER TABLE ONLY public.users ALTER COLUMN user_id SET DEFAULT nextval('public.users_user_id_seq'::regclass);


--
-- Data for Name: bills; Type: TABLE DATA; Schema: public; Owner: user
--

COPY public.bills (bill_id, employee_id, month_year, total_duration, total_cost, discount_applied, final_amount, payment_status) FROM stdin;
15	5	2024-11	53	5.30	0.06	5.00	UNPAID
17	4	2024-06	32	16.00	0.12	16.00	UNPAID
16	4	2024-11	59	29.50	0.12	29.00	PAID
14	5	2024-12	9	10.80	0.15	11.00	PAID
19	8	2024-10	70	84.00	0.00	84.00	PAID
20	5	2024-10	92	48.80	0.42	48.00	UNPAID
\.


--
-- Data for Name: departments; Type: TABLE DATA; Schema: public; Owner: user
--

COPY public.departments (department_id, name) FROM stdin;
2	Test Department for testing purposes
4	Katsapchuk Department
5	DA-21
6	Department
7	Lisa Department
8	DEpartment Test
\.


--
-- Data for Name: employees; Type: TABLE DATA; Schema: public; Owner: user
--

COPY public.employees (employee_id, card_number, full_name, "position", department_id, internal_phone_number, hire_date) FROM stdin;
4	175534	Oleksii Simkov	Top Dota Player	2	51349	2020-12-18
5	875820	Mykyta Tereshchenko	Top Overwatch Player	2	686456	2021-12-18
13	667280	Ivan	IT Specialist	7	341341	2024-12-20
8	187057	Терещенко Олексій Ihorovich	Top Player	4	343534	2024-12-19
14	781241	Kalyta Mykyta Ivanovich	Engineer	2	333333	2024-12-20
\.


--
-- Data for Name: payments_log; Type: TABLE DATA; Schema: public; Owner: user
--

COPY public.payments_log (log_id, bill_id, old_status, new_status, change_date) FROM stdin;
2	16	UNPAID	PAID	2024-12-19 17:32:46.025068
3	14	UNPAID	PAID	2024-12-20 12:41:29.694129
5	19	UNPAID	PAID	2024-12-20 13:21:46.745517
\.


--
-- Data for Name: rates; Type: TABLE DATA; Schema: public; Owner: user
--

COPY public.rates (rate_id, call_type, cost_per_minute, discount_per_year, max_discount) FROM stdin;
2	local	0.10	0.02	0.20
3	intercity	0.50	0.03	0.30
4	international	1.20	0.05	0.50
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: user
--

COPY public.users (user_id, username, password_hash, role, employee_id) FROM stdin;
2	admin	scrypt:32768:8:1$JvdaiZPIRv9qN8aN$895d48b9d3aba36c071708b6220b58f33702c85d8827516e6f9b131e49daf3053c0cdc3e6478bdd757f499e9896539e3ae96c479025c75739dafc03c3bc38230	admin	4
3	mykyta	scrypt:32768:8:1$Ilsv6zbq2gYr0z6V$b00b8244ad83604472059bec006ed41191ea4b214fc1ce78cb1728584294344d27fe20dc93579bf3130672611802678d612834f8f222b4338cdbc129d204b0e8	accountant	5
4	oleksii	scrypt:32768:8:1$ozaP2mRIE5hbNtt5$91ba71afc2bde9e2268ac73b3916115b055652d9eca54b26c6bc491d0973e2206f6ed5e5046f2aaae563fe0524516752cf177e9479f7599cd355089f912a216e	user	8
6	simkov	scrypt:32768:8:1$zyUJ3hWjnqRRCJez$5e80b22df8d787d65c2fd02987214bdc4ef8501882b47fa536cfc77e76d00d3cac3bc3e6e4e76c7a187829a908d059f546373b8a381b85f9c6bc034788ef7a56	accountant	\N
7	lisa	scrypt:32768:8:1$tQNDErwJwVNVkxQn$d021e68f9ace92f5ee5a066a5a6a6be65291071466d06a68abb73b14090cd2a831a0678dd282e3d06cfe683db207df97c49188b14025cc0bf2735796f0a3ce93	admin	\N
9	ivan	scrypt:32768:8:1$0zmgwIj6vSR6ocTN$654405bc4e692e389842c2e553bb30e61d2700d47c2f4131a5129f3683cf1e4f143ac2c114e2b0069fe54c15757bca7ee47b8e67e4f3da050a76b729a8546b1a	admin	13
10	kalyta	scrypt:32768:8:1$ab5KSPwWMsjZYpWC$5be3e17832c7f70ee984a9405cfd1c37db6be026f9f75ba268a5f3ccce411ddb1de264e1cf27f96216ffbc68ef67b7bd87505630624ece8fddbf9eb0a1861e48	admin	14
\.


--
-- Name: bills_bill_id_seq; Type: SEQUENCE SET; Schema: public; Owner: user
--

SELECT pg_catalog.setval('public.bills_bill_id_seq', 20, true);


--
-- Name: departments_department_id_seq; Type: SEQUENCE SET; Schema: public; Owner: user
--

SELECT pg_catalog.setval('public.departments_department_id_seq', 8, true);


--
-- Name: employees_employee_id_seq; Type: SEQUENCE SET; Schema: public; Owner: user
--

SELECT pg_catalog.setval('public.employees_employee_id_seq', 15, true);


--
-- Name: payments_log_log_id_seq; Type: SEQUENCE SET; Schema: public; Owner: user
--

SELECT pg_catalog.setval('public.payments_log_log_id_seq', 5, true);


--
-- Name: rates_rate_id_seq; Type: SEQUENCE SET; Schema: public; Owner: user
--

SELECT pg_catalog.setval('public.rates_rate_id_seq', 4, true);


--
-- Name: users_user_id_seq; Type: SEQUENCE SET; Schema: public; Owner: user
--

SELECT pg_catalog.setval('public.users_user_id_seq', 10, true);


--
-- Name: bills bills_pkey; Type: CONSTRAINT; Schema: public; Owner: user
--

ALTER TABLE ONLY public.bills
    ADD CONSTRAINT bills_pkey PRIMARY KEY (bill_id);


--
-- Name: departments departments_pkey; Type: CONSTRAINT; Schema: public; Owner: user
--

ALTER TABLE ONLY public.departments
    ADD CONSTRAINT departments_pkey PRIMARY KEY (department_id);


--
-- Name: employees employees_card_number_key; Type: CONSTRAINT; Schema: public; Owner: user
--

ALTER TABLE ONLY public.employees
    ADD CONSTRAINT employees_card_number_key UNIQUE (card_number);


--
-- Name: employees employees_pkey; Type: CONSTRAINT; Schema: public; Owner: user
--

ALTER TABLE ONLY public.employees
    ADD CONSTRAINT employees_pkey PRIMARY KEY (employee_id);


--
-- Name: payments_log payments_log_pkey; Type: CONSTRAINT; Schema: public; Owner: user
--

ALTER TABLE ONLY public.payments_log
    ADD CONSTRAINT payments_log_pkey PRIMARY KEY (log_id);


--
-- Name: rates rates_pkey; Type: CONSTRAINT; Schema: public; Owner: user
--

ALTER TABLE ONLY public.rates
    ADD CONSTRAINT rates_pkey PRIMARY KEY (rate_id);


--
-- Name: users users_employee_id_key; Type: CONSTRAINT; Schema: public; Owner: user
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_employee_id_key UNIQUE (employee_id);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: user
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (user_id);


--
-- Name: users users_username_key; Type: CONSTRAINT; Schema: public; Owner: user
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_username_key UNIQUE (username);


--
-- Name: bills trigger_log_payment_status; Type: TRIGGER; Schema: public; Owner: user
--

CREATE TRIGGER trigger_log_payment_status AFTER UPDATE OF payment_status ON public.bills FOR EACH ROW WHEN (((old.payment_status)::text IS DISTINCT FROM (new.payment_status)::text)) EXECUTE FUNCTION public.log_payment_status_change();


--
-- Name: bills trigger_round_final_amount; Type: TRIGGER; Schema: public; Owner: user
--

CREATE TRIGGER trigger_round_final_amount BEFORE INSERT OR UPDATE ON public.bills FOR EACH ROW EXECUTE FUNCTION public.round_final_amount();


--
-- Name: bills bills_employee_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: user
--

ALTER TABLE ONLY public.bills
    ADD CONSTRAINT bills_employee_id_fkey FOREIGN KEY (employee_id) REFERENCES public.employees(employee_id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: employees employees_department_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: user
--

ALTER TABLE ONLY public.employees
    ADD CONSTRAINT employees_department_id_fkey FOREIGN KEY (department_id) REFERENCES public.departments(department_id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: users fk_employee; Type: FK CONSTRAINT; Schema: public; Owner: user
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT fk_employee FOREIGN KEY (employee_id) REFERENCES public.employees(employee_id) ON DELETE SET NULL;


--
-- Name: payments_log payments_log_bill_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: user
--

ALTER TABLE ONLY public.payments_log
    ADD CONSTRAINT payments_log_bill_id_fkey FOREIGN KEY (bill_id) REFERENCES public.bills(bill_id) ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

