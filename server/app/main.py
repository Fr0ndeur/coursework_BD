# app/main.py
from flask import Flask
from flask_cors import CORS
import os
from dotenv import load_dotenv

# Загрузка переменных из .env
load_dotenv()
from app.config import DevelopmentConfig, ProductionConfig
from app.db import initialize_databases


def create_app():
    """Создание и настройка Flask-приложения."""
    app = Flask(__name__)

    CORS(app, supports_credentials=True)
    # Подключение конфигурации
    environment = os.getenv("FLASK_ENV", "development")
    if environment == "production":
        app.config.from_object(ProductionConfig)
    else:
        app.config.from_object(DevelopmentConfig)

    # Инициализация баз данных
    initialize_databases(app.config)

    # Регистрация маршрутов
    from app.routes import init_routes

    init_routes(app)

    return app


app = create_app()

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=app.config["DEBUG"])
