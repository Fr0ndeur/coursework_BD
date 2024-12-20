PGDMP     9    /                |            telecom     14.15 (Debian 14.15-1.pgdg120+1)     14.15 (Debian 14.15-1.pgdg120+1) 1    L
           0    0    ENCODING    ENCODING        SET client_encoding = 'UTF8';
                      false            M
           0    0 
   STDSTRINGS 
   STDSTRINGS     (   SET standard_conforming_strings = 'on';
                      false            N
           0    0 
   SEARCHPATH 
   SEARCHPATH     8   SELECT pg_catalog.set_config('search_path', '', false);
                      false            O
           1262    16384    telecom    DATABASE     [   CREATE DATABASE telecom WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE = 'en_US.utf8';
    DROP DATABASE telecom;
                user    false            ь            1255    16484 >   calculate_discounted_cost(character varying, integer, integer)    FUNCTION     _  CREATE FUNCTION public.calculate_discounted_cost(v_call_type character varying, v_duration integer, v_years_of_service integer) RETURNS TABLE(base_cost numeric, discount_applied numeric, final_cost numeric)
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
    DROP FUNCTION public.calculate_discounted_cost(v_call_type character varying, v_duration integer, v_years_of_service integer);
       public          user    false            ▐            1255    16434    calculate_tenure(date)    FUNCTION     ┴   CREATE FUNCTION public.calculate_tenure(hire_date date) RETURNS integer
    LANGUAGE plpgsql
    AS $$
BEGIN
    RETURN EXTRACT(YEAR FROM CURRENT_DATE) - EXTRACT(YEAR FROM hire_date);
END;
$$;
 7   DROP FUNCTION public.calculate_tenure(hire_date date);
       public          user    false            э            1255    16485 .   get_monthly_billing_summary(character varying)    FUNCTION     L  CREATE FUNCTION public.get_monthly_billing_summary(month_year_input character varying) RETURNS TABLE(total_amount numeric, paid_amount numeric, unpaid_bills integer[])
    LANGUAGE plpgsql
    AS $$
BEGIN
    -- ╨Ю╨▒╤Й╨░╤П ╤Б╤Г╨╝╨╝╨░ ╨┤╨╡╨╜╨╡╨│ ╨╖╨░ ╨╝╨╡╤Б╤П╤Ж
    RETURN QUERY
    SELECT
        COALESCE(SUM(final_amount), 0) AS total_amount,
        COALESCE(SUM(final_amount) FILTER (WHERE payment_status = 'PAID'), 0) AS paid_amount,
        ARRAY_AGG(bill_id) FILTER (WHERE payment_status = 'UNPAID') AS unpaid_bills
    FROM bills
    WHERE month_year = month_year_input;
END;
$$;
 V   DROP FUNCTION public.get_monthly_billing_summary(month_year_input character varying);
       public          user    false            р            1255    16450    log_payment_status_change()    FUNCTION       CREATE FUNCTION public.log_payment_status_change() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    INSERT INTO payments_log (bill_id, old_status, new_status)
    VALUES (OLD.bill_id, OLD.payment_status, NEW.payment_status);
    RETURN NEW;
END;
$$;
 2   DROP FUNCTION public.log_payment_status_change();
       public          user    false            ▀            1255    16435    round_final_amount()    FUNCTION     л   CREATE FUNCTION public.round_final_amount() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    NEW.final_amount := ROUND(NEW.final_amount);
    RETURN NEW;
END;
$$;
 +   DROP FUNCTION public.round_final_amount();
       public          user    false            ╓            1259    16418    bills    TABLE     ╢  CREATE TABLE public.bills (
    bill_id integer NOT NULL,
    employee_id integer NOT NULL,
    month_year character varying(7) NOT NULL,
    total_duration integer DEFAULT 0 NOT NULL,
    total_cost numeric(10,2) DEFAULT 0.00 NOT NULL,
    discount_applied numeric(10,2) DEFAULT 0.00 NOT NULL,
    final_amount numeric(10,2) DEFAULT 0.00 NOT NULL,
    payment_status character varying(20) DEFAULT 'UNPAID'::character varying NOT NULL
);
    DROP TABLE public.bills;
       public         heap    user    false            ╒            1259    16417    bills_bill_id_seq    SEQUENCE     Й   CREATE SEQUENCE public.bills_bill_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 (   DROP SEQUENCE public.bills_bill_id_seq;
       public          user    false    214            P
           0    0    bills_bill_id_seq    SEQUENCE OWNED BY     G   ALTER SEQUENCE public.bills_bill_id_seq OWNED BY public.bills.bill_id;
          public          user    false    213            ╥            1259    16389    departments    TABLE     r   CREATE TABLE public.departments (
    department_id integer NOT NULL,
    name character varying(100) NOT NULL
);
    DROP TABLE public.departments;
       public         heap    user    false            ╘            1259    16396 	   employees    TABLE     E  CREATE TABLE public.employees (
    employee_id integer NOT NULL,
    card_number character varying(50) NOT NULL,
    full_name character varying(255) NOT NULL,
    "position" character varying(100),
    department_id integer NOT NULL,
    internal_phone_number character varying(20) NOT NULL,
    hire_date date NOT NULL
);
    DROP TABLE public.employees;
       public         heap    user    false            ┘            1259    16452    department_phone_directory    VIEW       CREATE VIEW public.department_phone_directory AS
 SELECT d.name AS department_name,
    e.full_name,
    e.internal_phone_number
   FROM (public.employees e
     JOIN public.departments d ON ((e.department_id = d.department_id)))
  ORDER BY d.name, e.full_name;
 -   DROP VIEW public.department_phone_directory;
       public          user    false    212    210    210    212    212            ╤            1259    16388    departments_department_id_seq    SEQUENCE     Х   CREATE SEQUENCE public.departments_department_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 4   DROP SEQUENCE public.departments_department_id_seq;
       public          user    false    210            Q
           0    0    departments_department_id_seq    SEQUENCE OWNED BY     _   ALTER SEQUENCE public.departments_department_id_seq OWNED BY public.departments.department_id;
          public          user    false    209            ╙            1259    16395    employees_employee_id_seq    SEQUENCE     С   CREATE SEQUENCE public.employees_employee_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 0   DROP SEQUENCE public.employees_employee_id_seq;
       public          user    false    212            R
           0    0    employees_employee_id_seq    SEQUENCE OWNED BY     W   ALTER SEQUENCE public.employees_employee_id_seq OWNED BY public.employees.employee_id;
          public          user    false    211            ╪            1259    16438    payments_log    TABLE     ъ   CREATE TABLE public.payments_log (
    log_id integer NOT NULL,
    bill_id integer,
    old_status character varying(20),
    new_status character varying(20),
    change_date timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);
     DROP TABLE public.payments_log;
       public         heap    user    false            ╫            1259    16437    payments_log_log_id_seq    SEQUENCE     П   CREATE SEQUENCE public.payments_log_log_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 .   DROP SEQUENCE public.payments_log_log_id_seq;
       public          user    false    216            S
           0    0    payments_log_log_id_seq    SEQUENCE OWNED BY     S   ALTER SEQUENCE public.payments_log_log_id_seq OWNED BY public.payments_log.log_id;
          public          user    false    215            █            1259    16457    rates    TABLE     С  CREATE TABLE public.rates (
    rate_id integer NOT NULL,
    call_type character varying NOT NULL,
    cost_per_minute numeric NOT NULL,
    discount_per_year numeric NOT NULL,
    max_discount numeric NOT NULL,
    CONSTRAINT rates_call_type_check CHECK (((call_type)::text = ANY ((ARRAY['local'::character varying, 'intercity'::character varying, 'international'::character varying])::text[])))
);
    DROP TABLE public.rates;
       public         heap    user    false            ┌            1259    16456    rates_rate_id_seq    SEQUENCE     Й   CREATE SEQUENCE public.rates_rate_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 (   DROP SEQUENCE public.rates_rate_id_seq;
       public          user    false    219            T
           0    0    rates_rate_id_seq    SEQUENCE OWNED BY     G   ALTER SEQUENCE public.rates_rate_id_seq OWNED BY public.rates.rate_id;
          public          user    false    218            ▌            1259    16468    users    TABLE     Ж  CREATE TABLE public.users (
    user_id integer NOT NULL,
    username character varying(50) NOT NULL,
    password_hash character varying(255) NOT NULL,
    role character varying(50) NOT NULL,
    employee_id integer,
    CONSTRAINT users_role_check CHECK (((role)::text = ANY ((ARRAY['admin'::character varying, 'accountant'::character varying, 'user'::character varying])::text[])))
);
    DROP TABLE public.users;
       public         heap    user    false            ▄            1259    16467    users_user_id_seq    SEQUENCE     Й   CREATE SEQUENCE public.users_user_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 (   DROP SEQUENCE public.users_user_id_seq;
       public          user    false    221            U
           0    0    users_user_id_seq    SEQUENCE OWNED BY     G   ALTER SEQUENCE public.users_user_id_seq OWNED BY public.users.user_id;
          public          user    false    220            Ъ           2604    16421 
   bills bill_id    DEFAULT     n   ALTER TABLE ONLY public.bills ALTER COLUMN bill_id SET DEFAULT nextval('public.bills_bill_id_seq'::regclass);
 <   ALTER TABLE public.bills ALTER COLUMN bill_id DROP DEFAULT;
       public          user    false    213    214    214            Ш           2604    16392    departments department_id    DEFAULT     Ж   ALTER TABLE ONLY public.departments ALTER COLUMN department_id SET DEFAULT nextval('public.departments_department_id_seq'::regclass);
 H   ALTER TABLE public.departments ALTER COLUMN department_id DROP DEFAULT;
       public          user    false    209    210    210            Щ           2604    16399    employees employee_id    DEFAULT     ~   ALTER TABLE ONLY public.employees ALTER COLUMN employee_id SET DEFAULT nextval('public.employees_employee_id_seq'::regclass);
 D   ALTER TABLE public.employees ALTER COLUMN employee_id DROP DEFAULT;
       public          user    false    211    212    212            а           2604    16441    payments_log log_id    DEFAULT     z   ALTER TABLE ONLY public.payments_log ALTER COLUMN log_id SET DEFAULT nextval('public.payments_log_log_id_seq'::regclass);
 B   ALTER TABLE public.payments_log ALTER COLUMN log_id DROP DEFAULT;
       public          user    false    215    216    216            в           2604    16460 
   rates rate_id    DEFAULT     n   ALTER TABLE ONLY public.rates ALTER COLUMN rate_id SET DEFAULT nextval('public.rates_rate_id_seq'::regclass);
 <   ALTER TABLE public.rates ALTER COLUMN rate_id DROP DEFAULT;
       public          user    false    219    218    219            д           2604    16471 
   users user_id    DEFAULT     n   ALTER TABLE ONLY public.users ALTER COLUMN user_id SET DEFAULT nextval('public.users_user_id_seq'::regclass);
 <   ALTER TABLE public.users ALTER COLUMN user_id DROP DEFAULT;
       public          user    false    221    220    221            н           2606    16428    bills bills_pkey 
   CONSTRAINT     S   ALTER TABLE ONLY public.bills
    ADD CONSTRAINT bills_pkey PRIMARY KEY (bill_id);
 :   ALTER TABLE ONLY public.bills DROP CONSTRAINT bills_pkey;
       public            user    false    214            з           2606    16394    departments departments_pkey 
   CONSTRAINT     e   ALTER TABLE ONLY public.departments
    ADD CONSTRAINT departments_pkey PRIMARY KEY (department_id);
 F   ALTER TABLE ONLY public.departments DROP CONSTRAINT departments_pkey;
       public            user    false    210            й           2606    16403 #   employees employees_card_number_key 
   CONSTRAINT     e   ALTER TABLE ONLY public.employees
    ADD CONSTRAINT employees_card_number_key UNIQUE (card_number);
 M   ALTER TABLE ONLY public.employees DROP CONSTRAINT employees_card_number_key;
       public            user    false    212            л           2606    16401    employees employees_pkey 
   CONSTRAINT     _   ALTER TABLE ONLY public.employees
    ADD CONSTRAINT employees_pkey PRIMARY KEY (employee_id);
 B   ALTER TABLE ONLY public.employees DROP CONSTRAINT employees_pkey;
       public            user    false    212            п           2606    16444    payments_log payments_log_pkey 
   CONSTRAINT     `   ALTER TABLE ONLY public.payments_log
    ADD CONSTRAINT payments_log_pkey PRIMARY KEY (log_id);
 H   ALTER TABLE ONLY public.payments_log DROP CONSTRAINT payments_log_pkey;
       public            user    false    216            ▒           2606    16465    rates rates_pkey 
   CONSTRAINT     S   ALTER TABLE ONLY public.rates
    ADD CONSTRAINT rates_pkey PRIMARY KEY (rate_id);
 :   ALTER TABLE ONLY public.rates DROP CONSTRAINT rates_pkey;
       public            user    false    219            │           2606    16478    users users_employee_id_key 
   CONSTRAINT     ]   ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_employee_id_key UNIQUE (employee_id);
 E   ALTER TABLE ONLY public.users DROP CONSTRAINT users_employee_id_key;
       public            user    false    221            ╡           2606    16474    users users_pkey 
   CONSTRAINT     S   ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (user_id);
 :   ALTER TABLE ONLY public.users DROP CONSTRAINT users_pkey;
       public            user    false    221            ╖           2606    16476    users users_username_key 
   CONSTRAINT     W   ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_username_key UNIQUE (username);
 B   ALTER TABLE ONLY public.users DROP CONSTRAINT users_username_key;
       public            user    false    221            ╝           2620    16451     bills trigger_log_payment_status    TRIGGER     ы   CREATE TRIGGER trigger_log_payment_status AFTER UPDATE OF payment_status ON public.bills FOR EACH ROW WHEN (((old.payment_status)::text IS DISTINCT FROM (new.payment_status)::text)) EXECUTE FUNCTION public.log_payment_status_change();
 9   DROP TRIGGER trigger_log_payment_status ON public.bills;
       public          user    false    214    224    214    214            ╜           2620    16436     bills trigger_round_final_amount    TRIGGER     Н   CREATE TRIGGER trigger_round_final_amount BEFORE INSERT OR UPDATE ON public.bills FOR EACH ROW EXECUTE FUNCTION public.round_final_amount();
 9   DROP TRIGGER trigger_round_final_amount ON public.bills;
       public          user    false    223    214            ╣           2606    16429    bills bills_employee_id_fkey 
   FK CONSTRAINT     ░   ALTER TABLE ONLY public.bills
    ADD CONSTRAINT bills_employee_id_fkey FOREIGN KEY (employee_id) REFERENCES public.employees(employee_id) ON UPDATE CASCADE ON DELETE CASCADE;
 F   ALTER TABLE ONLY public.bills DROP CONSTRAINT bills_employee_id_fkey;
       public          user    false    214    212    3243            ╕           2606    16404 &   employees employees_department_id_fkey 
   FK CONSTRAINT     ┴   ALTER TABLE ONLY public.employees
    ADD CONSTRAINT employees_department_id_fkey FOREIGN KEY (department_id) REFERENCES public.departments(department_id) ON UPDATE CASCADE ON DELETE RESTRICT;
 P   ALTER TABLE ONLY public.employees DROP CONSTRAINT employees_department_id_fkey;
       public          user    false    212    3239    210            ╗           2606    16479    users fk_employee 
   FK CONSTRAINT     Ф   ALTER TABLE ONLY public.users
    ADD CONSTRAINT fk_employee FOREIGN KEY (employee_id) REFERENCES public.employees(employee_id) ON DELETE SET NULL;
 ;   ALTER TABLE ONLY public.users DROP CONSTRAINT fk_employee;
       public          user    false    221    212    3243            ║           2606    16486 &   payments_log payments_log_bill_id_fkey 
   FK CONSTRAINT     Ь   ALTER TABLE ONLY public.payments_log
    ADD CONSTRAINT payments_log_bill_id_fkey FOREIGN KEY (bill_id) REFERENCES public.bills(bill_id) ON DELETE CASCADE;
 P   ALTER TABLE ONLY public.payments_log DROP CONSTRAINT payments_log_bill_id_fkey;
       public          user    false    216    214    3245           
