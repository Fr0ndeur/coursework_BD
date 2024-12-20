# server/utils/genpass.py
from werkzeug.security import generate_password_hash

# Создание хеша пароля
password = "password"  # Пароль, который нужно хешировать
hashed_password = generate_password_hash(password)

print("Хеш пароля:", hashed_password)
