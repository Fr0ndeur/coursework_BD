from app.db.sql_connection import get_db_connection
from app.models.user import User


class UserRepository:
    def find_by_username(self, username):
        """Находит пользователя по его имени."""
        conn = get_db_connection()
        try:
            with conn.cursor() as cur:
                cur.execute(
                    """
                    SELECT user_id, username, password_hash, role, employee_id
                    FROM users WHERE username = %s
                    """,
                    (username,),
                )
                row = cur.fetchone()
            if row:
                return User(row[0], row[1], row[2], row[3], row[4])
        finally:
            conn.close()
        return None

    def find_by_id(self, user_id):
        """Находит пользователя по его ID."""
        conn = get_db_connection()
        try:
            with conn.cursor() as cur:
                cur.execute(
                    """
                    SELECT user_id, username, password_hash, role, employee_id
                    FROM users WHERE user_id = %s
                    """,
                    (user_id,),
                )
                row = cur.fetchone()
            if row:
                return User(row[0], row[1], row[2], row[3], row[4])
        finally:
            conn.close()
        return None

    def create_user(self, username, password_hash, role, employee_id=None):
        """Создаёт нового пользователя."""
        conn = get_db_connection()
        try:
            with conn.cursor() as cur:
                cur.execute(
                    """
                    INSERT INTO users (username, password_hash, role, employee_id)
                    VALUES (%s, %s, %s, %s) RETURNING user_id
                    """,
                    (username, password_hash, role, employee_id),
                )
                user_id = cur.fetchone()[0]
            conn.commit()
            return user_id
        finally:
            conn.close()

    def get_all_users(self):
        """Возвращает всех пользователей."""
        conn = get_db_connection()
        try:
            with conn.cursor() as cur:
                cur.execute(
                    """
                    SELECT user_id, username, role, employee_id FROM users
                    """
                )
                rows = cur.fetchall()
            return [User(row[0], row[1], None, row[2], row[3]) for row in rows]
        finally:
            conn.close()

    def get_employee_id_by_user_id(self, user_id):
        """Возвращает employee_id по user_id."""
        conn = get_db_connection()
        try:
            with conn.cursor() as cur:
                cur.execute("SELECT employee_id FROM users WHERE user_id = %s", (user_id,))
                row = cur.fetchone()
            return row[0] if row else None
        finally:
            conn.close()
