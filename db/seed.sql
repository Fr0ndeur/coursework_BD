-- seed.sql
-- 1) создаём тестовую запись в employees
INSERT INTO employees (full_name)
VALUES ('Test Employee');

-- 2) вставляем двух пользователей (admin и user)
INSERT INTO users (username, password_hash, role, employee_id)
VALUES 
  ('admin', 'scrypt:32768:8:1$BTK3ayAeVwAgQnyO$2c8bea0f0e84adb36b902ef5273fdc4e6988c88b6729ed77366ce302d5b3d324ce086ef660ed93980b49a8dd2358ee9f2846b6b61e809d30470c3d3d0e8bc215', 'admin', 1),
  ('user',  'scrypt:32768:8:1$ic6OxvVscIWk7JUa$1be85e992962bc02d5730dc451d7cee20c9b3488d54cf8f585ae9d1341a08ff76a629082823b9fe5e633db066bd79f08e8028e0f053335416022793f53788c20',  'user',  1);
