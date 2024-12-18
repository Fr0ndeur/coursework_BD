from app.repositories.user_repository import UserRepository
from werkzeug.security import generate_password_hash, check_password_hash
import jwt
from datetime import datetime, timedelta
from flask import current_app


class UserService:
    def __init__(self):
        self.repo = UserRepository()

    def authenticate_user(self, username, password):
        """Аутентификация пользователя по имени и паролю."""
        user = self.repo.find_by_username(username)
        if not user or not check_password_hash(user.password_hash, password):
            return None  # Неверный логин или пароль

        # Генерация JWT токена
        payload = {
            "user_id": user.user_id,
            "role": user.role,
            "employee_id": user.employee_id,
            "exp": datetime.utcnow() + timedelta(hours=1),  # Срок действия токена
        }
        token = jwt.encode(payload, current_app.config["SECRET_KEY"], algorithm="HS256")
        return {"access_token": token, "role": user.role}

    def get_employee_id_by_user_id(self, user_id):
        """Получает employee_id по user_id."""
        return self.repo.get_employee_id_by_user_id(user_id)

    def create_user(self, username, password, role, employee_id=None):
        """Создание нового пользователя с хэшированием пароля."""
        hashed_password = generate_password_hash(password)
        return self.repo.create_user(username, hashed_password, role, employee_id)

    def get_all_users(self):
        """Получение всех пользователей."""
        return self.repo.get_all_users()

    def get_user_by_id(self, user_id):
        """Получение пользователя по ID."""
        return self.repo.find_by_id(user_id)
