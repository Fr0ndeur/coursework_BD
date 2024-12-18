# app/models/call.py
from dataclasses import dataclass


@dataclass
class Call:
    call_id: str = None
    employee_id: int = None
    date: str = ""
    duration: int = 0
    dialed_number: str = ""
    cost_calculated: bool = False
    call_type: str = "local"  # Тип звонка: local, intercity, international

    def to_dict(self):
        """Преобразует объект Call в словарь."""
        return {
            "_id": self.call_id,
            "employee_id": self.employee_id,
            "date": self.date,
            "duration": self.duration,
            "dialed_number": self.dialed_number,
            "cost_calculated": self.cost_calculated,
            "call_type": self.call_type,
        }

