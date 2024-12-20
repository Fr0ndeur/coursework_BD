# server/app/repositories/department_repository.py
from app.db.sql_connection import get_db_connection
from app.models.department import Department


class DepartmentRepository:
    def find_all(self):
        """Возвращает список всех департаментов."""
        conn = get_db_connection()
        with conn.cursor() as cur:
            cur.execute("SELECT department_id, name FROM departments")
            rows = cur.fetchall()
        return [Department(department_id=row[0], name=row[1]) for row in rows]

    def find_by_id(self, department_id):
        """Возвращает департамент по его ID."""
        conn = get_db_connection()
        with conn.cursor() as cur:
            cur.execute(
                "SELECT department_id, name FROM departments WHERE department_id = %s",
                (department_id,),
            )
            row = cur.fetchone()
        if row:
            return Department(department_id=row[0], name=row[1])
        return None

    def insert(self, department):
        """Добавляет новый департамент в БД."""
        conn = get_db_connection()
        with conn.cursor() as cur:
            cur.execute(
                "INSERT INTO departments (name) VALUES (%s) RETURNING department_id",
                (department.name,),
            )
            department_id = cur.fetchone()[0]
        conn.commit()
        department.department_id = department_id
        return department

    def update(self, department):
        """Обновляет существующий департамент."""
        conn = get_db_connection()
        with conn.cursor() as cur:
            cur.execute(
                "UPDATE departments SET name = %s WHERE department_id = %s RETURNING department_id",
                (department.name, department.department_id),
            )
            updated_id = cur.fetchone()
        conn.commit()
        return department if updated_id else None

    def delete(self, department_id):
        """Удаляет департамент по его ID."""
        conn = get_db_connection()
        with conn.cursor() as cur:
            cur.execute(
                "DELETE FROM departments WHERE department_id = %s RETURNING department_id",
                (department_id,),
            )
            deleted_id = cur.fetchone()
        conn.commit()
        return deleted_id is not None
