# tests/unit/test_department_service.py
import pytest
from app.services.department_service import DepartmentService
from app.models.department import Department

class DummyRepo:
    def __init__(self):
        self._db = {1: Department(1, "HR")}
    def find_all(self): return list(self._db.values())
    def find_by_id(self, i): return self._db.get(i)
    def insert(self, dept):
        dept.department_id = 2
        self._db[2] = dept
        return dept
    def update(self, dept): return dept
    def delete(self, i): return i in self._db

@pytest.fixture(autouse=True)
def svc(monkeypatch):
    from app.services.department_service import DepartmentService as DS
    monkeypatch.setattr("app.services.department_service.DepartmentRepository", lambda *a,**k: DummyRepo())
    return DS()

def test_get_all_and_by_id(svc):
    all_ = svc.get_all_departments()
    assert len(all_) == 1 and isinstance(all_[0], Department)
    assert svc.get_department_by_id(1).name == "HR"

def test_create_and_update_and_delete(svc):
    new = svc.create_department({"name":"IT"})
    assert new.department_id == 2
    updated = svc.update_department(2, {"name":"DevOps"})
    assert updated.name == "DevOps"
    assert svc.delete_department(2) is True
