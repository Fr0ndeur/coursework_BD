# app/repositories/employee_repository.py
from app.db.sql_connection import get_db_connection
from app.models.employee import Employee


class EmployeeRepository:
    def find_all(self):
        """Возвращает всех сотрудников из БД."""
        conn = get_db_connection()
        with conn.cursor() as cur:
            cur.execute(
                """
                SELECT employee_id, card_number, full_name, position, department_id, 
                       internal_phone_number, hire_date 
                FROM employees
                """
            )
            rows = cur.fetchall()
        # Преобразование строк из БД в объекты модели
        return [
            Employee(
                employee_id=row[0],
                card_number=row[1],
                full_name=row[2],
                position=row[3],
                department_id=row[4],
                internal_phone_number=row[5],
                hire_date=row[6],
            )
            for row in rows
        ]

    def find_by_id(self, employee_id):
        """Возвращает сотрудника по его ID."""
        conn = get_db_connection()
        with conn.cursor() as cur:
            cur.execute(
                """
                SELECT employee_id, card_number, full_name, position, department_id, 
                       internal_phone_number, hire_date 
                FROM employees 
                WHERE employee_id = %s
                """,
                (employee_id,),
            )
            row = cur.fetchone()
        # Если сотрудник найден, преобразуем в объект модели
        if row:
            return Employee(
                employee_id=row[0],
                card_number=row[1],
                full_name=row[2],
                position=row[3],
                department_id=row[4],
                internal_phone_number=row[5],
                hire_date=row[6],
            )
        return None

    def insert(self, employee):
        """
        Добавляет нового сотрудника в БД.
        """
        conn = get_db_connection()
        with conn.cursor() as cur:
            cur.execute(
                """
                INSERT INTO employees (card_number, full_name, department_id, position, hire_date, internal_phone_number)
                VALUES (%s, %s, %s, %s, %s, %s)
                RETURNING employee_id
                """,
                (
                    employee.card_number,
                    employee.full_name,
                    employee.department_id,
                    employee.position,
                    employee.hire_date or "NOW()",
                    employee.internal_phone_number,  # Добавляем поле
                ),
            )
            new_id = cur.fetchone()[0]
        conn.commit()

        # Возвращаем полный объект Employee с обновлённым ID
        employee.employee_id = new_id
        return employee

    def get_hire_date_by_id(self, employee_id):
        """
        Возвращает дату найма сотрудника по его ID.
        """
        conn = get_db_connection()
        query = "SELECT hire_date FROM employees WHERE employee_id = %s"
        with conn.cursor() as cur:
            cur.execute(query, (employee_id,))
            row = cur.fetchone()
        if row:
            return row[0]  # Возвращаем только hire_date
        return None

    def update(self, employee):
        """Обновляет существующего сотрудника."""
        conn = get_db_connection()
        with conn.cursor() as cur:
            cur.execute(
                """
                UPDATE employees 
                SET full_name = %s, position = %s, department_id = %s, 
                    hire_date = %s, card_number = %s, internal_phone_number = %s
                WHERE employee_id = %s RETURNING employee_id
                """,
                (
                    employee.full_name,
                    employee.position,
                    employee.department_id,
                    employee.hire_date,
                    employee.card_number,
                    employee.internal_phone_number,
                    employee.employee_id,
                ),
            )
            updated_id = cur.fetchone()
        conn.commit()
        return employee if updated_id else None

    def delete(self, employee_id):
        """Удаляет сотрудника по его ID."""
        conn = get_db_connection()
        with conn.cursor() as cur:
            cur.execute(
                "DELETE FROM employees WHERE employee_id = %s RETURNING employee_id",
                (employee_id,),
            )
            deleted_id = cur.fetchone()
        conn.commit()
        return deleted_id is not None
