# server/app/repositories/rate_repositories.py
from app.db.sql_connection import get_db_connection
from app.models.rate import Rate


class RateRepository:
    def __init__(self):
        self.conn = get_db_connection()

    def get_all_rates(self):
        """Получает все тарифы из базы данных."""
        with self.conn.cursor() as cur:
            cur.execute(
                "SELECT rate_id, call_type, cost_per_minute, discount_per_year, max_discount FROM rates"
            )
            rows = cur.fetchall()
        return [Rate(*row) for row in rows]

    def get_rate_by_type(self, call_type):
        """Получает тариф по типу звонка."""
        with self.conn.cursor() as cur:
            cur.execute(
                "SELECT rate_id, call_type, cost_per_minute, discount_per_year, max_discount FROM rates WHERE call_type = %s",
                (call_type,),
            )
            row = cur.fetchone()
        if row:
            return Rate(*row)
        return None
