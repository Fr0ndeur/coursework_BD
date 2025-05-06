# Курсова робота з СБД

# Терещенко Олексій

# Сімков Микита

`python3 -m venv .venv`

`./.venv/scripts/Activate`

`pip install -r .\requirements.txt`

`waitress-serve --listen=0.0.0.0:5000 app.main:app`

`npm install -g @pact-foundation/pact-cli`

`docker run -d --name lab_postgres -e POSTGRES_USER=postgres -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=labdb -p 5432:5432 postgres:15`
`docker run -d --name lab_couch -e COUCHDB_USER=admin -e COUCHDB_PASSWORD=password -p 5984:5984 couchdb:3`

`$env:SQL_DB_URL  = "postgresql://postgres:postgres@localhost:5432/labdb"`
`$env:COUCHDB_URL = "http://admin:password@localhost:5984/"`

`Get-Content .\schema.sql | docker exec -i lab_postgres psql -U postgres -d labdb`

`docker cp .\seed.sql lab_postgres:/seed.sql`
`docker exec lab_postgres psql -U postgres -d labdb -f /seed.sql`

`docker run --rm -d --name pact-mock -p 1234:1234 -v "${PWD}\pacts:/pacts" pactfoundation/pact-cli:latest sh -c "pact-mock-service start --consumer FrontendApp --provider AuthService --host 0.0.0.0 --port 1234 --pact-dir /pacts && tail -f /dev/null"`

# зайти в контейнер

`docker exec -it lab_couch bash`

# внутри контейнера

`curl -X PUT http://admin:password@localhost:5984/calls`
`exit`
