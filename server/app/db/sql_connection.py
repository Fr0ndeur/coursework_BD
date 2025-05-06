#server/app/db/sql_connection.py
import psycopg
from flask import current_app


def init_db(config):
    """
    Инициализация соединения с PostgreSQL.
    """
    try:
        print(
            "🔗 Testing connection to PostgreSQL with URL:", config.get("SQL_DB_URL")
        )
        conn = psycopg.connect(
            config.get("SQL_DB_URL"),
            options="-c client_encoding=UTF8 -c lc_messages=en_US.UTF-8",
        )
        conn.close()
        print("✅ PostgreSQL connection test successful!")
    except Exception as e:
        print(f"❌ Error connecting to PostgreSQL: {e}")
        raise e



def get_db_connection():
    """
    Создает новое соединение с БД.
    """
    try:
        # Используем текущий контекст приложения для доступа к конфигурации
        db_url = current_app.config["SQL_DB_URL"]
        return psycopg.connect(
            db_url,
            options="-c client_encoding=UTF8 -c lc_messages=en_US.UTF-8",
        )
    except Exception as e:
        print(f"❌ Error creating new PostgreSQL connection: {e}")
        raise e

