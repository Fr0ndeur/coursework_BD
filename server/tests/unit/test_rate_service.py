import pytest
from datetime import datetime
from app.services.rate_service import RateService

class DummyRepo:
    def get_all_rates(self): 
        class R: call_type="local"; discount_per_year=0.1; max_discount=0.5
        return [R()]
class DummyEmpRepo:
    def get_hire_date_by_id(self, i): return datetime(2020,1,1)

@pytest.fixture(autouse=True)
def svc(monkeypatch):
    from app.services.rate_service import RateService as RS
    monkeypatch.setattr("app.services.rate_service.RateRepository",    lambda *a,**k: DummyRepo())
    monkeypatch.setattr("app.services.rate_service.EmployeeRepository",lambda *a,**k: DummyEmpRepo())
    return RS()

def test_get_discounts(svc):
    discounts = svc.get_discounts_by_employee_id(1)
    assert isinstance(discounts, list)
    assert discounts[0]["discount"] >= 0
