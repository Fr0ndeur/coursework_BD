# tests/integration/test_security_endpoints.py
import os, pytest

@pytest.fixture(scope="module")
def client():
    os.environ["SQL_DB_URL"]  = "postgresql://postgres:postgres@localhost:5432/labdb"
    os.environ["COUCHDB_URL"] = "http://admin:password@localhost:5984/"
    os.environ["SECRET_KEY"]  = "your_secret_key"  # именно так, чтобы совпало с auth_decorator

    from app.main import create_app
    app = create_app()
    return app.test_client()

def login(client, username, password):
    r = client.post("/users/login", json={"username":username,"password":password})
    assert r.status_code == 200
    # возвращаем заголовок Authorization
    token = r.get_json()["token"]
    return {"Authorization": f"Bearer {token}"}

def test_admin_can_list_bills(client):
    headers = login(client, "admin", "admin")
    r = client.get("/billing/", headers=headers)
    assert r.status_code in (200, 404)

def test_user_cannot_list_bills(client):
    headers = login(client, "user", "user")
    r = client.get("/billing/", headers=headers)
    assert r.status_code == 403
