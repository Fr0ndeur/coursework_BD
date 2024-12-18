# app/services/department_service.py
from app.repositories.department_repository import DepartmentRepository
from app.models.department import Department


class DepartmentService:
    def __init__(self):
        self.repo = DepartmentRepository()

    def get_all_departments(self):
        """Получает все департаменты."""
        return self.repo.find_all()

    def get_department_by_id(self, department_id):
        """Получает департамент по его ID."""
        return self.repo.find_by_id(department_id)

    def create_department(self, data):
        """Создает новый департамент."""
        if not data.get("name"):
            raise ValueError("Missing required field: name")
        department = Department(name=data["name"])
        return self.repo.insert(department)

    def update_department(self, department_id, data):
        """Обновляет существующий департамент."""
        department = self.repo.find_by_id(department_id)
        if not department:
            return None
        department.name = data.get("name", department.name)
        return self.repo.update(department)

    def delete_department(self, department_id):
        """Удаляет департамент по его ID."""
        return self.repo.delete(department_id)
