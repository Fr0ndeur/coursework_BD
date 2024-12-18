# app/db/couchdb_connection.py
import os
import couchdb

_couchdb_instance = None


def initialize_couchdb(config):
    """Инициализация подключения к CouchDB."""
    print("Trying to init connection to CouchDB")
    # print("COUCHDB_URL in config:", config.get("COUCHDB_URL"))  # Проверка
    global _couchdb_instance
    if _couchdb_instance is None:
        couchdb_url = config.get("COUCHDB_URL")
        try:
            server = couchdb.Server(couchdb_url)
            _couchdb_instance = server
            print(f"Connected to CouchDB at {couchdb_url}")
        except Exception as e:
            print(f"Failed to connect to CouchDB: {e}")
            raise Exception("Failed to initialize CouchDB connection.")


def get_couchdb():
    """Возвращает экземпляр CouchDB."""
    if _couchdb_instance is None:
        raise Exception("CouchDB connection is not initialized.")
    return _couchdb_instance
