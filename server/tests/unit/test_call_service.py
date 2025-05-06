# tests/unit/test_call_service.py
import pytest
from datetime import datetime
from app.services.call_service import CallService
from app.models.call import Call

class DummyRepo:
    def __init__(self):
        self.storage = {}
    def insert(self, call):
        call.call_id = "id-123"
        self.storage[call.call_id] = call
        return call
    def find_by_id(self, call_id):
        return self.storage.get(call_id)
    @staticmethod
    def find_calls_by_employee_id(emp_id):
        return [{"call_id":"a","employee_id":emp_id,"date":"2024-01-01T00:00:00","duration":1,"dialed_number":"123","cost_calculated":False,"call_type":"local"}]

@pytest.fixture(autouse=True)
def svc(monkeypatch):
    from app.services.call_service import CallService as CS, CallRepository
    monkeypatch.setattr("app.services.call_service.CallRepository", lambda *a,**k: DummyRepo())
    return CS()

def test_determine_call_type():
    assert CallService.determine_call_type("+380123") == "international"
    assert CallService.determine_call_type("0123")    == "intercity"
    assert CallService.determine_call_type("123")     == "local"

def test_create_and_fetch_call(svc):
    data = {"employee_id":5, "date":"2024-02-02T12:00:00","duration":10,"dialed_number":"999"}
    call = svc.create_call(data)
    assert call.call_id == "id-123"
    fetched = svc.get_call_by_id("id-123")
    assert fetched.employee_id == 5

def test_get_calls_by_employee_id(svc):
    calls = svc.get_calls_by_employee_id(42)
    assert isinstance(calls, list) and calls[0]["employee_id"] == 42
