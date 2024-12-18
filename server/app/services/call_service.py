# app/services/call_service.py
from app.repositories.call_repository import CallRepository
from app.models.call import Call
import random
from datetime import datetime, timedelta


class CallService:
    def __init__(self):
        self.repo = CallRepository()

    def get_all_calls(self):
        """Получает все звонки."""
        return self.repo.find_all()

    def get_call_by_id(self, call_id):
        """Получает звонок по его ID."""
        return self.repo.find_by_id(call_id)

    def get_calls_by_employee_id(self, employee_id):
        """
        Получает все звонки для сотрудника по его ID.
        """
        return self.repo.find_calls_by_employee_id(employee_id)

    def create_call(self, data):
        """Создает новый звонок с автоматическим определением типа звонка."""
        call_type = self.determine_call_type(data["dialed_number"])

        call = Call(
            employee_id=data["employee_id"],
            date=data["date"],
            duration=data["duration"],
            dialed_number=data["dialed_number"],
            cost_calculated=data.get("cost_calculated", False),
            call_type=call_type,  # Добавляем тип звонка
        )
        return self.repo.insert(call)

    @staticmethod
    def determine_call_type(number):
        """Определяет тип звонка по номеру телефона."""
        if number.startswith("+"):
            return "international"
        elif number.startswith("0"):
            return "intercity"
        else:
            return "local"

    def update_call(self, call_id, data):
        """Обновляет существующий звонок."""
        call = self.repo.find_by_id(call_id)
        if not call:
            return None
        call.employee_id = data.get("employee_id", call.employee_id)
        call.date = data.get("date", call.date)
        call.duration = data.get("duration", call.duration)
        call.dialed_number = data.get("dialed_number", call.dialed_number)
        call.cost_calculated = data.get("cost_calculated", call.cost_calculated)
        return self.repo.update(call)

    def populate_calls(self, employee_ids, min_calls=1, max_calls=5):
        """
        Генерирует случайные звонки для всех абонентов.

        :param employee_ids: Список ID сотрудников
        :param min_calls: Минимальное количество звонков для сотрудника
        :param max_calls: Максимальное количество звонков для сотрудника
        """
        call_types = ["local", "intercity", "international"]
        phone_prefixes = {"local": "+38044", "intercity": "+380", "international": "+1"}

        generated_calls = []

        for employee_id in employee_ids:
            num_calls = random.randint(min_calls, max_calls)
            for _ in range(num_calls):
                call_type = random.choice(call_types)
                dialed_number = (
                    f"{phone_prefixes[call_type]}{random.randint(1000000, 9999999)}"
                )
                duration = random.randint(1, 60)  # длительность от 1 до 60 минут
                date = datetime.now() - timedelta(
                    days=random.randint(1, 180)
                )  # случайная дата за последний месяц

                call = Call(
                    employee_id=employee_id,
                    date=date.strftime("%Y-%m-%dT%H:%M:%S"),
                    duration=duration,
                    dialed_number=dialed_number,
                    cost_calculated=False,
                    call_type=call_type,
                )
                self.repo.insert(call)
                generated_calls.append(call)
        return generated_calls

    def delete_call(self, call_id):
        """Удаляет звонок по его ID."""
        return self.repo.delete(call_id)
