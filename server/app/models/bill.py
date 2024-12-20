# server/app/models/bill.py
from dataclasses import dataclass
from datetime import date


@dataclass
class Bill:
    bill_id: int = None
    employee_id: int = None
    month_year: str = ""
    total_duration: int = 0
    total_cost: float = 0.0
    discount_applied: float = 0.0
    final_amount: float = 0.0
    payment_status: str = "UNPAID"

    def to_dict(self):
        """Преобразует объект Bill в словарь для ответа клиенту."""
        return {
            "bill_id": self.bill_id,
            "employee_id": self.employee_id,
            "month_year": self.month_year,
            "total_duration": self.total_duration,
            "total_cost": self.total_cost,
            "discount_applied": self.discount_applied,
            "final_amount": self.final_amount,
            "payment_status": self.payment_status,
        }
