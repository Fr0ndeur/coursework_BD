# app/models/employee.py
from dataclasses import dataclass, field
from typing import Optional
from datetime import date


@dataclass
class Employee:
    employee_id: Optional[int] = None
    card_number: Optional[str] = None
    full_name: str = ""
    position: str = ""
    department_id: Optional[int] = None
    internal_phone_number: Optional[str] = None
    hire_date: Optional[date] = field(default_factory=date.today)

    def to_dict(self):
        return {
            "employee_id": self.employee_id,
            "card_number": self.card_number,
            "full_name": self.full_name,
            "position": self.position,
            "department_id": self.department_id,
            "internal_phone_number": self.internal_phone_number,
            "hire_date": str(self.hire_date),  # Преобразование даты в строку
        }
