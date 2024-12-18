from .sql_connection import init_db
from .couchdb_connection import initialize_couchdb


def initialize_databases(config):
    """
    Инициализирует подключения ко всем базам данных.
    """

    init_db(config)
    initialize_couchdb(config)
