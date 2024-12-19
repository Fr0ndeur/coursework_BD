# Курсова робота з СБД

# Терещенко Олексій

# Сімков Микита

Запуск:

`docker-compose up -d`

`docker cp "C:\the_backup.sql" postgres_container:/the_backup.sql`

`docker exec -i postgres_container psql -U user -d telecom < /the_backup.sql`
