# server/app/services/billing_service.py
from app.repositories.billing_repository import BillingRepository
from app.repositories.call_repository import CallRepository
from app.services.rate_service import RateService
from app.models.bill import Bill

from datetime import datetime


class BillingService:
    def __init__(self):
        self.call_repo = CallRepository()
        self.repo = BillingRepository()
        self.rate_service = RateService()

    def get_all_bills(self):
        """Получает все счета."""
        return self.repo.find_all()

    def get_bill_by_id(self, bill_id):
        """Получает счет по ID."""
        return self.repo.find_by_id(bill_id)

    def get_bills_by_employee_id(self, employee_id):
        """Получает все счета для указанного employee_id."""
        return self.repo.find_by_employee_id(employee_id)

    def create_bill(self, data):
        """Создает новый счет."""
        bill = Bill(
            employee_id=data["employee_id"],
            month_year=data["month_year"],
            total_duration=data["total_duration"],
            total_cost=data["total_cost"],
            discount_applied=data.get("discount_applied", 0.0),
            final_amount=data["final_amount"],
            payment_status=data.get("payment_status", "UNPAID"),
        )
        return self.repo.insert(bill)

    def update_bill(self, bill_id, data):
        """Обновляет счет."""
        bill = self.repo.find_by_id(bill_id)
        if not bill:
            return None
        bill.total_cost = data.get("total_cost", bill.total_cost)
        bill.payment_status = data.get("payment_status", bill.payment_status)
        return self.repo.update(bill)

    def generate_monthly_report(self, employee_id, month_year):
        """Генерирует отчёт по звонкам с учётом тарифов и скидок."""
        year, month = map(int, month_year.split("-"))
        calls = self.call_repo.find_calls_for_billing(employee_id, year, month)
        if not calls:
            return {"message": "No calls to bill for this employee and month."}

        total_duration = 0
        total_cost = 0.0
        discount_applied = 0.0

        # Получаем стаж сотрудника
        employee = self.call_repo.get_employee_hire_date(employee_id)
        if not employee or "hire_date" not in employee:
            return {"message": "Employee hire date not found."}

        hire_date = datetime.strptime(employee["hire_date"], "%Y-%m-%d")
        years_of_service = max(0, (datetime.now().year - hire_date.year))

        # Рассчитываем стоимость через хранимую процедуру
        for call in calls:
            result = self.repo.calculate_discounted_cost(
                call["call_type"], call["duration"], years_of_service
            )
            total_cost += result["base_cost"]
            discount_applied += result["discount_applied"]
            total_duration += call["duration"]

        # Создаём отчёт
        bill = Bill(
            employee_id=employee_id,
            month_year=month_year,
            total_duration=total_duration,
            total_cost=round(total_cost, 2),  # Полная стоимость
            discount_applied=round(discount_applied, 2),  # Сумма скидки
            final_amount=round(total_cost - discount_applied, 2),  # Итоговая стоимость
            payment_status="UNPAID",
        )

        self.repo.insert(bill)
        self.call_repo.mark_calls_as_billed(calls)

        return {
            "message": "Billing report generated successfully.",
            "bill": bill.to_dict(),
        }

    def delete_bill(self, bill_id):
        """Удаляет счет по ID."""
        return self.repo.delete(bill_id)
    
    def pay_bill(self, bill_id):
        """Оплачивает счет, меняя статус на PAID."""
        bill = self.repo.find_by_id(bill_id)
        if not bill:
            return None

        if bill.payment_status == "PAID":
            raise ValueError("Bill is already paid")

        bill.payment_status = "PAID"
        return self.repo.update(bill)

    def get_billing_summary(self, month_year):
        """
        Получает суммарную информацию о счетах за указанный месяц.
        """
        return self.repo.get_monthly_summary(month_year)
