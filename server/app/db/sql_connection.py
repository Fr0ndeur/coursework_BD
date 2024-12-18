# app/db/sql_connection.py
import psycopg
from flask import current_app

db_connection = None


def init_db(config):
    """
    Инициализация соединения с PostgreSQL.
    """
    global db_connection
    try:
        print(
            "🔗 Connecting to PostgreSQL with URL:", config.get("SQL_DB_URL")
        )  # Отладочный вывод
        db_connection = psycopg.connect(
            config.get("SQL_DB_URL"),
            options="-c client_encoding=UTF8 -c lc_messages=en_US.UTF-8",
        )
        print("✅ PostgreSQL connected successfully!")
    except Exception as e:
        print(f"❌ Error connecting to PostgreSQL: {e}")


def get_db_connection():
    """
    Возвращает текущее соединение с БД.
    """
    if db_connection is None:
        raise Exception("Database connection is not initialized.")
    return db_connection
