# gunicorn_config.py

import os
import multiprocessing

# Адрес и порт, на котором будет работать сервер
bind = "0.0.0.0:5000"

# Количество рабочих процессов (обычно = количество ядер * 2 + 1)
workers = multiprocessing.cpu_count() * 2 + 1

# Тип воркеров: sync (по умолчанию), async, gevent и т.д.
worker_class = "sync"

# Таймаут для воркеров (если запрос обрабатывается слишком долго, воркер убивается)
timeout = 120

# Логи сервера
accesslog = "-"  # Логи доступа (stdout)
errorlog = "-"  # Логи ошибок (stdout)
loglevel = "info"

# Префорк: используем отдельные воркеры
preload_app = True

# Название процесса (видно в `ps aux`)
proc_name = "my_flask_app"

# Максимальное количество запросов, после которого воркер перезапускается
# (полезно для предотвращения утечек памяти)
max_requests = 1000
max_requests_jitter = 50
