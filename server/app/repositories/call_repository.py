# app/repositories/call_repository.py
from app.db.couchdb_connection import get_couchdb
from app.db.sql_connection import get_db_connection
from app.models.call import Call
from datetime import datetime

import uuid  # Для генерации уникальных идентификаторов


class CallRepository:
    def __init__(self):
        self.db = get_couchdb()["calls"]  # Получаем коллекцию calls в CouchDB

    def find_all(self):
        """Возвращает все звонки."""
        calls = []
        for doc_id in self.db:
            # Пропускаем design документы
            if doc_id.startswith("_design/"):
                continue

            doc = self.db[doc_id]
            calls.append(
                Call(
                    call_id=doc["_id"],
                    employee_id=doc.get("employee_id", None),  # Защита на случай отсутствия поля
                    date=doc.get("date", "1970-01-01T00:00:00"),
                    duration=doc.get("duration", 0),
                    dialed_number=doc.get("dialed_number", ""),
                    cost_calculated=doc.get("cost_calculated", False),
                    call_type=doc.get("call_type", "local"),
                )
            )
        return calls


    def find_by_id(self, call_id):
        """Находит звонок по его ID."""
        if call_id in self.db:
            doc = self.db[call_id]
            return Call(
                call_id=doc["_id"],
                employee_id=doc["employee_id"],
                date=doc["date"],
                duration=doc["duration"],
                dialed_number=doc["dialed_number"],
                cost_calculated=doc["cost_calculated"],
                call_type=doc.get("call_type", "local"),  # Добавляем call_type
            )
        return None

    def find_calls_by_employee_id(self, employee_id):
        """
        Возвращает все звонки для заданного employee_id, используя CouchDB view.
        """
        result = self.db.view("calls/by_employee_id", key=employee_id)

        calls = []
        for row in result:
            doc = row.value  # Используем данные из view
            if doc["_id"].startswith("_design/"):  # Пропускаем design документы
                continue

            calls.append(
                {
                    "call_id": doc["_id"],
                    "employee_id": doc.get("employee_id", None),
                    "date": doc.get("date", "1970-01-01T00:00:00"),
                    "duration": doc.get("duration", 0),
                    "dialed_number": doc.get("dialed_number", ""),
                    "cost_calculated": doc.get("cost_calculated", False),
                    "call_type": doc.get("call_type", "local"),
                }
            )
        return calls



    def insert(self, call):
        """Добавляет новый звонок."""
        call_dict = call.to_dict()

        # Генерация _id, если его нет
        if not call_dict.get("_id"):
            call_dict["_id"] = str(uuid.uuid4())  # Генерируем уникальный ID

        response = self.db.save(call_dict)
        call.call_id, _ = response  # Распаковываем кортеж (id, rev)
        return call

    def update(self, call):
        """Обновляет существующий звонок."""
        if call.call_id in self.db:
            existing_doc = self.db[call.call_id]
            updated_doc = call.to_dict()
            updated_doc["_rev"] = existing_doc[
                "_rev"
            ]  # CouchDB требует _rev для обновления
            response = self.db.save(updated_doc)
            call.call_id = response["id"]
            return call
        return None

    def find_calls_for_billing(self, employee_id, year, month):
        """
        Находит все звонки сотрудника за определенный месяц, которые не были учтены.
        """
        # Определяем диапазон дат
        start_date = f"{year}-{month:02d}-01T00:00:00"
        if month == 12:
            end_date = f"{year + 1}-01-01T00:00:00"
        else:
            end_date = f"{year}-{month + 1:02d}-01T00:00:00"

        # Запрашиваем представление billing_calls
        result = self.db.view(
            "calls/billing_calls",
            startkey=[employee_id, start_date],
            endkey=[employee_id, end_date]
        )

        # Формируем список звонков
        calls_to_bill = []
        for row in result:
            doc = row.value
            calls_to_bill.append(doc)

        return calls_to_bill


    def mark_calls_as_billed(self, calls):
        """Обновляет звонки, помечая их как учтённые (cost_calculated=True)."""
        for call in calls:
            call["cost_calculated"] = True
            self.db.save(call)

    def get_employee_hire_date(self, employee_id):
        """Возвращает дату найма сотрудника."""
        conn = get_db_connection()
        with conn.cursor() as cur:
            cur.execute(
                "SELECT hire_date FROM employees WHERE employee_id = %s", (employee_id,)
            )
            row = cur.fetchone()
        return {"hire_date": str(row[0])} if row else None

    def delete(self, call_id):
        """Удаляет звонок по его ID."""
        if call_id in self.db:
            doc = self.db[call_id]
            self.db.delete(doc)
            return True
        return False
