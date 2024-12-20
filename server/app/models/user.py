#server/app/models/user.py
class User:
    def __init__(self, user_id, username, password_hash, role, employee_id=None):
        self.user_id = user_id
        self.username = username
        self.password_hash = password_hash
        self.role = role
        self.employee_id = employee_id  # Ссылка на employee_id
