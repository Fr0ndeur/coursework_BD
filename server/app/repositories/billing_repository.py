# server/app/repositories/billing_repository.py
from app.db.sql_connection import get_db_connection
from app.models.bill import Bill


class BillingRepository:
    def find_all(self):
        """Возвращает все счета."""
        conn = get_db_connection()
        with conn.cursor() as cur:
            cur.execute(
                """
                SELECT bill_id, employee_id, month_year, total_duration, total_cost, 
                       discount_applied, final_amount, payment_status 
                FROM bills
            """
            )
            rows = cur.fetchall()
        return [
            Bill(
                bill_id=row[0],
                employee_id=row[1],
                month_year=row[2],
                total_duration=row[3],
                total_cost=row[4],
                discount_applied=row[5],
                final_amount=row[6],
                payment_status=row[7],
            )
            for row in rows
        ]

    def find_by_id(self, bill_id):
        """Возвращает счет по его ID."""
        conn = get_db_connection()
        with conn.cursor() as cur:
            cur.execute(
                """
                SELECT bill_id, employee_id, month_year, total_duration, total_cost, 
                       discount_applied, final_amount, payment_status 
                FROM bills WHERE bill_id = %s
            """,
                (bill_id,),
            )
            row = cur.fetchone()
        if row:
            return Bill(
                bill_id=row[0],
                employee_id=row[1],
                month_year=row[2],
                total_duration=row[3],
                total_cost=row[4],
                discount_applied=row[5],
                final_amount=row[6],
                payment_status=row[7],
            )
        return None

    def find_by_employee_id(self, employee_id):
        """
        Возвращает все счета для указанного employee_id.
        """
        conn = get_db_connection()
        with conn.cursor() as cur:
            cur.execute(
                """
                SELECT bill_id, employee_id, month_year, total_duration,
                       total_cost, discount_applied, final_amount, payment_status
                FROM bills
                WHERE employee_id = %s
                """,
                (employee_id,),
            )
            rows = cur.fetchall()
        # Возвращаем список счетов в виде словарей
        return [
            {
                "bill_id": row[0],
                "employee_id": row[1],
                "month_year": row[2],
                "total_duration": row[3],
                "total_cost": row[4],
                "discount_applied": row[5],
                "final_amount": row[6],
                "payment_status": row[7],
            }
            for row in rows
        ]

    def insert(self, bill):
        """Добавляет новый счет в БД."""
        conn = get_db_connection()
        with conn.cursor() as cur:
            cur.execute(
                """
                INSERT INTO bills (employee_id, month_year, total_duration, total_cost, 
                                   discount_applied, final_amount, payment_status) 
                VALUES (%s, %s, %s, %s, %s, %s, %s) RETURNING bill_id
            """,
                (
                    bill.employee_id,
                    bill.month_year,
                    bill.total_duration,
                    bill.total_cost,
                    bill.discount_applied,
                    bill.final_amount,
                    bill.payment_status,
                ),
            )
            bill.bill_id = cur.fetchone()[0]
        conn.commit()
        return bill

    def update(self, bill):
        """Обновляет существующий счет."""
        conn = get_db_connection()
        with conn.cursor() as cur:
            cur.execute(
                """
                UPDATE bills SET employee_id = %s, month_year = %s, total_duration = %s, 
                                 total_cost = %s, discount_applied = %s, final_amount = %s, 
                                 payment_status = %s WHERE bill_id = %s RETURNING bill_id
            """,
                (
                    bill.employee_id,
                    bill.month_year,
                    bill.total_duration,
                    bill.total_cost,
                    bill.discount_applied,
                    bill.final_amount,
                    bill.payment_status,
                    bill.bill_id,
                ),
            )
            updated_id = cur.fetchone()
        conn.commit()
        return bill if updated_id else None

    def calculate_discounted_cost(self, call_type, duration, years_of_service):
        """
        Вызывает хранимую процедуру для расчета стоимости звонка с учетом скидки.
        """
        conn = get_db_connection()
        with conn.cursor() as cur:
            cur.execute(
                """
                SELECT * FROM calculate_discounted_cost(%s, %s, %s)
            """,
                (call_type, duration, years_of_service),
            )
            result = cur.fetchone()
        return {
            "base_cost": float(result[0]),
            "discount_applied": float(result[1]),
            "final_cost": float(result[2]),
        }

    def delete(self, bill_id):
        """Удаляет счет по его ID."""
        conn = get_db_connection()
        with conn.cursor() as cur:
            cur.execute(
                "DELETE FROM bills WHERE bill_id = %s RETURNING bill_id", (bill_id,)
            )
            deleted_id = cur.fetchone()
        conn.commit()
        return deleted_id is not None

    def get_monthly_summary(self, month_year):
        """
        Вызывает хранимую процедуру для получения суммарной информации о счетах за указанный месяц.
        """
        conn = get_db_connection()
        with conn.cursor() as cur:
            # Вызов хранимой процедуры
            cur.execute(
                """
                SELECT * FROM get_monthly_billing_summary(%s)
                """,
                (month_year,)
            )
            result = cur.fetchone()

        if result:
            return {
                "total_amount": float(result[0]),
                "paid_amount": float(result[1]),
                "unpaid_bills": result[2],
            }
        return None
