# app/services/employee_service.py
from app.repositories.employee_repository import EmployeeRepository
from app.services.user_service import UserService  # Импортируем UserService
from app.models.employee import Employee
from datetime import date

import random


class EmployeeService:
    def __init__(self):
        self.repo = EmployeeRepository()
        self.user_service = UserService()  # Инициализируем UserService

    def get_all_employees(self):
        """Получает всех сотрудников."""
        return self.repo.find_all()

    def get_employee_by_id(self, employee_id):
        """Получает сотрудника по ID."""
        return self.repo.find_by_id(employee_id)

    def create_employee(self, data):
        """
        Создаёт нового сотрудника.
        """
        card_number = data.get("card_number") or self.generate_card_number()
        hire_date = data.get("hire_date", str(date.today()))
        internal_phone_number = (
            data.get("internal_phone_number") or self.generate_phone_number()
        )

        employee = Employee(
            full_name=data["full_name"],
            department_id=data["department_id"],
            position=data.get("position"),
            card_number=card_number,
            hire_date=hire_date,
            internal_phone_number=internal_phone_number,  # Добавляем поле
        )
        return self.repo.insert(employee)

    @staticmethod
    def generate_card_number():
        """Генерирует случайный номер карты."""
        return str(random.randint(100000, 999999))

    @staticmethod
    def generate_phone_number():
        """Генерирует случайный внутренний номер телефона."""
        return str(random.randint(1000, 999999))

    def update_employee(self, employee_id, data):
        """Обновляет данные сотрудника."""
        employee = self.repo.find_by_id(employee_id)
        if not employee:
            return None  # Сотрудник не найден

        # Обновляем поля
        employee.full_name = data.get("full_name", employee.full_name)
        employee.position = data.get("position", employee.position)
        employee.department_id = data.get("department_id", employee.department_id)
        employee.hire_date = data.get("hire_date", employee.hire_date)
        employee.card_number = data.get("card_number", employee.card_number)
        employee.internal_phone_number = data.get(
            "internal_phone_number", employee.internal_phone_number
        )

        return self.repo.update(employee)

    def delete_employee(self, employee_id, current_user_id):
        """
        Удаляет сотрудника по ID.
        Проверяет, чтобы текущий пользователь не удалил сам себя.
        """
        # Получаем данные текущего пользователя
        current_user = self.user_service.get_user_by_id(current_user_id)
        if not current_user:
            raise ValueError("Current user not found")

        # Проверяем, пытается ли пользователь удалить себя
        if current_user.employee_id == employee_id:
            raise ValueError("You cannot delete yourself")

        # Удаляем сотрудника
        return self.repo.delete(employee_id)
