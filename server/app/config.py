# app/config.py
import os


class Config:
    """Базовая конфигурация приложения."""

    DEBUG = os.getenv("DEBUG", "False").lower() in ["true", "1"]
    SQL_DB_URL = os.getenv("SQL_DB_URL")
    COUCHDB_URL = os.getenv("COUCHDB_URL")
    SECRET_KEY = os.getenv("SECRET_KEY", "default_secret_key")


class DevelopmentConfig(Config):
    """Конфигурация для разработки."""

    DEBUG = True


class ProductionConfig(Config):
    """Конфигурация для продакшена."""

    DEBUG = False
