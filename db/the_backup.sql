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

CREATE FUNCTION public.calculate_discounted_cost(call_type character varying, duration integer, years_of_service integer) RETURNS TABLE(base_cost numeric, discount_applied numeric, final_cost numeric)
    LANGUAGE plpgsql
    AS $$
DECLARE
    rate RECORD;
    discount_percentage DECIMAL;
    discount_amount DECIMAL;
BEGIN
    -- ╨Я╨╛╨╗╤Г╤З╨░╨╡╨╝ ╤В╨░╤А╨╕╤Д ╨┤╨╗╤П ╨┤╨░╨╜╨╜╨╛╨│╨╛ ╤В╨╕╨┐╨░ ╨╖╨▓╨╛╨╜╨║╨░
    SELECT cost_per_minute, discount_per_year, max_discount
    INTO rate
    FROM rates
    WHERE rates.call_type = call_type;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Rate for call type % not found', call_type;
    END IF;

    -- ╨а╨░╤Б╤Б╤З╨╕╤В╤Л╨▓╨░╨╡╨╝ ╨▒╨░╨╖╨╛╨▓╤Г╤О ╤Б╤В╨╛╨╕╨╝╨╛╤Б╤В╤М
    base_cost := rate.cost_per_minute * duration;

    -- ╨а╨░╤Б╤Б╤З╨╕╤В╤Л╨▓╨░╨╡╨╝ ╤Б╨║╨╕╨┤╨║╤Г
    discount_percentage := LEAST(rate.discount_per_year * years_of_service, rate.max_discount);
    discount_amount := base_cost * discount_percentage;

    -- ╨д╨╕╨╜╨░╨╗╤М╨╜╨░╤П ╤Б╤В╨╛╨╕╨╝╨╛╤Б╤В╤М ╤Б╨╛ ╤Б╨║╨╕╨┤╨║╨╛╨╣
    final_cost := base_cost - discount_amount;

    RETURN QUERY SELECT base_cost, discount_amount, final_cost;
END;
$$;


ALTER FUNCTION public.calculate_discounted_cost(call_type character varying, duration integer, years_of_service integer) OWNER TO "user";

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
1	4	2024-12	120	300.00	10.00	270.00	PAID
2	5	2024-12	22	11.00	0.00	11.00	UNPAID
3	5	2024-11	23	2.30	0.00	2.00	UNPAID
4	5	2024-10	32	16.00	0.00	16.00	UNPAID
5	6	2024-12	29	13.20	1.30	13.00	UNPAID
6	6	2024-11	96	55.70	6.87	49.00	UNPAID
7	4	2024-11	104	83.50	14.34	69.00	UNPAID
\.


--
-- Data for Name: departments; Type: TABLE DATA; Schema: public; Owner: user
--

COPY public.departments (department_id, name) FROM stdin;
2	Test Department for testing purposes
\.


--
-- Data for Name: employees; Type: TABLE DATA; Schema: public; Owner: user
--

COPY public.employees (employee_id, card_number, full_name, "position", department_id, internal_phone_number, hire_date) FROM stdin;
5	875820	Mykyta Simkov	Top Dota Player	2	686456	2021-12-18
6	934614	Mykyta Simkov	Top Dota Player	2	328439	2021-12-18
4	175534	Mykyta Simkov	Top Dota Player	2	51349	2020-12-18
\.


--
-- Data for Name: payments_log; Type: TABLE DATA; Schema: public; Owner: user
--

COPY public.payments_log (log_id, bill_id, old_status, new_status, change_date) FROM stdin;
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
\.


--
-- Name: bills_bill_id_seq; Type: SEQUENCE SET; Schema: public; Owner: user
--

SELECT pg_catalog.setval('public.bills_bill_id_seq', 7, true);


--
-- Name: departments_department_id_seq; Type: SEQUENCE SET; Schema: public; Owner: user
--

SELECT pg_catalog.setval('public.departments_department_id_seq', 2, true);


--
-- Name: employees_employee_id_seq; Type: SEQUENCE SET; Schema: public; Owner: user
--

SELECT pg_catalog.setval('public.employees_employee_id_seq', 6, true);


--
-- Name: payments_log_log_id_seq; Type: SEQUENCE SET; Schema: public; Owner: user
--

SELECT pg_catalog.setval('public.payments_log_log_id_seq', 1, false);


--
-- Name: rates_rate_id_seq; Type: SEQUENCE SET; Schema: public; Owner: user
--

SELECT pg_catalog.setval('public.rates_rate_id_seq', 4, true);


--
-- Name: users_user_id_seq; Type: SEQUENCE SET; Schema: public; Owner: user
--

SELECT pg_catalog.setval('public.users_user_id_seq', 2, true);


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
    ADD CONSTRAINT payments_log_bill_id_fkey FOREIGN KEY (bill_id) REFERENCES public.bills(bill_id);


--
-- PostgreSQL database dump complete
--

