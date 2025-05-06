-- schema.sql
CREATE TABLE IF NOT EXISTS users (
  user_id      SERIAL PRIMARY KEY,
  username     TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role         TEXT NOT NULL,
  employee_id  INTEGER
);

CREATE TABLE IF NOT EXISTS employees (
  employee_id  SERIAL PRIMARY KEY,
  card_number  TEXT,
  full_name    TEXT NOT NULL,
  position     TEXT,
  department_id INTEGER,
  internal_phone_number TEXT,
  hire_date    DATE DEFAULT CURRENT_DATE
);

CREATE TABLE IF NOT EXISTS departments (
  department_id SERIAL PRIMARY KEY,
  name           TEXT UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS rates (
  rate_id         SERIAL PRIMARY KEY,
  call_type       TEXT,
  cost_per_minute NUMERIC,
  discount_per_year NUMERIC,
  max_discount    NUMERIC
);

CREATE TABLE IF NOT EXISTS bills (
  bill_id        SERIAL PRIMARY KEY,
  employee_id    INTEGER REFERENCES employees(employee_id),
  month_year     TEXT,
  total_duration INTEGER,
  total_cost     NUMERIC,
  discount_applied NUMERIC,
  final_amount   NUMERIC,
  payment_status TEXT
);
