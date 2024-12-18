from app.repositories.rate_repository import RateRepository
from app.repositories.employee_repository import EmployeeRepository
from datetime import datetime


class RateService:
    def __init__(self):
        self.repo = RateRepository()
        self.employee_repo = EmployeeRepository()

    def get_all_rates(self):
        """Возвращает все тарифы."""
        return self.repo.get_all_rates()

    def get_rate_by_type(self, call_type):
        """Возвращает тариф по типу звонка."""
        return self.repo.get_rate_by_type(call_type)

    def get_discounts_by_employee_id(self, employee_id):
        """
        Возвращает скидки для сотрудника по каждому типу звонков.
        """
        # Получаем дату найма сотрудника
        hire_date = self.employee_repo.get_hire_date_by_id(employee_id)
        if not hire_date:
            return {"message": "Employee hire date not found."}

        # Рассчитываем стаж сотрудника
        from datetime import datetime

        years_of_service = max(0, (datetime.now().year - hire_date.year))

        # Получаем все тарифы
        rates = self.repo.get_all_rates()

        # Рассчитываем скидки
        discounts = []
        for rate in rates:
            discount = min(rate.discount_per_year * years_of_service, rate.max_discount)
            discounts.append(
                {
                    "call_type": rate.call_type,
                    "discount": round(discount * 100, 2),  # В процентах
                }
            )
        return discounts
