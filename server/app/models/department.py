# server/app/models/department.py
from dataclasses import dataclass


@dataclass
class Department:
    department_id: int = None
    name: str = ""

    def to_dict(self):
        """Преобразует объект Department в словарь для ответа клиенту."""
        return {"department_id": self.department_id, "name": self.name}
