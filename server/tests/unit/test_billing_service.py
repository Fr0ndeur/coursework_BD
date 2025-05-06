# tests/unit/test_billing_service.py
import pytest
from datetime import datetime

# ——— ваши DummyRepo, DummyCallRepo, DummyRateSvc, DummyUserSvc ———
class DummyRepo:
    def insert(self, bill):
        bill.bill_id = 1
        return bill

    def find_by_id(self, _):
        from app.models.bill import Bill
        return Bill(1,2,"2024-05",10,100.0,0.0,100.0)

    def find_by_employee_id(self, _):
        return [{"bill_id":1,"employee_id":2,"month_year":"2024-05",
                 "total_duration":10,"total_cost":100.0,
                 "discount_applied":0.0,"final_amount":100.0}]

    # добавляем эту заглушку:
    def calculate_discounted_cost(self, call_type, duration, years_of_service):
        return {"base_cost":duration,"discount_applied":0.0,"final_cost":duration}

class DummyCallRepo:
    def find_calls_for_billing(self, *_): return [{"call_type":"local","duration":5},{"call_type":"local","duration":5}]
    def get_employee_hire_date(self, _): return {"hire_date":"2020-01-01"}
    def mark_calls_as_billed(self, _): pass

class DummyRateSvc:
    def calculate_discounted_cost(self, call_type, duration, years_of_service):
        return {"base_cost":duration,"discount_applied":0.0,"final_cost":duration}

class DummyUserSvc:
    def get_employee_id_by_user_id(self, uid): return uid

@pytest.fixture(autouse=True)
def svc(monkeypatch):
    import app.services.billing_service as bsmod
    # подменяем классы в конструкторе BillingService
    monkeypatch.setattr(bsmod, "BillingRepository", lambda *a, **k: DummyRepo())
    monkeypatch.setattr(bsmod, "CallRepository",    lambda *a, **k: DummyCallRepo())
    monkeypatch.setattr(bsmod, "RateService",       lambda *a, **k: DummyRateSvc())
    monkeypatch.setattr(bsmod, "UserService",       lambda *a, **k: DummyUserSvc())
    return bsmod.BillingService()

def test_create_bill(svc):
    data = {"employee_id":2,"month_year":"2024-05","total_duration":10,"total_cost":100.0,"final_amount":100.0}
    bill = svc.create_bill(data)
    assert bill.bill_id == 1
    assert bill.final_amount == 100.0

def test_generate_monthly_report(svc):
    report = svc.generate_monthly_report(2, "2024-05")
    # два звонка по 5 минут → total_duration = 10
    assert report["bill"]["total_duration"] == 10
