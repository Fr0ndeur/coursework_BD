# tests/unit/test_employee_service.py
import pytest
from datetime import date
from app.services.employee_service import EmployeeService
from app.models.employee import Employee

class DummyRepo:
    def __init__(self):
        self._db = {1: Employee(employee_id=1,
                               card_number="0001",
                               full_name="John Doe",
                               position="Dev",
                               department_id=1,
                               internal_phone_number="1000",
                               hire_date=date.today())}
    def find_all(self): return list(self._db.values())
    def find_by_id(self,i): return self._db.get(i)
    def insert(self, emp):
        emp.employee_id = 2
        self._db[2] = emp
        return emp
    def update(self, emp): return emp
    def delete(self, i): return i in self._db

class DummyUserService:
    def __init__(self): pass
    def get_user_by_id(self, uid): 
        class U: employee_id=1
        return U()

@pytest.fixture(autouse=True)
def svc(monkeypatch):
    from app.services.employee_service import EmployeeService as ES
    monkeypatch.setattr("app.services.employee_service.EmployeeRepository", lambda *a,**k: DummyRepo())
    monkeypatch.setattr("app.services.employee_service.UserService",     lambda *a,**k: DummyUserService())
    return ES()

def test_crud_employee(svc):
    all_ = svc.get_all_employees()
    assert all_[0].employee_id == 1
    emp = svc.create_employee({"full_name":"Jane","department_id":2})
    assert emp.employee_id == 2
    emp.full_name = "Jane D"
    upd = svc.update_employee(2, {"full_name":"Jane D"})
    assert upd.full_name == "Jane D"
    # cannot delete self
    with pytest.raises(ValueError):
        svc.delete_employee(1, 1)
