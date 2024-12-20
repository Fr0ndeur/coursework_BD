# server/app/main.py
from flask import Flask
from flask_cors import CORS
import os
from dotenv import load_dotenv

load_dotenv()
from app.config import DevelopmentConfig, ProductionConfig
from app.db import initialize_databases

def create_app():
    app = Flask(__name__)
    CORS(app, supports_credentials=True)

    environment = os.getenv("FLASK_ENV", "development")
    if environment == "production":
        app.config.from_object(ProductionConfig)
    else:
        app.config.from_object(DevelopmentConfig)

    with app.app_context():
        # Инициализируем базы данных здесь, в контексте приложения
        initialize_databases(app.config)

        # Регистрация маршрутов тоже внутри контекста
        from app.routes import init_routes
        init_routes(app)

    return app


app = create_app()
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=app.config["DEBUG"])
