import os, pytest, jwt
from datetime import datetime, timedelta

@pytest.fixture(scope="module")
def client():
    os.environ.update({
      "SQL_DB_URL":"postgresql://postgres:postgres@localhost:5432/labdb",
      "COUCHDB_URL":"http://admin:password@localhost:5984/",
      "SECRET_KEY":"your_secret_key"
    })
    from app.main import create_app
    return create_app().test_client()

def login_token(role):
    payload = {"user_id":1,"role":role,"exp":datetime.utcnow()+timedelta(hours=1)}
    return jwt.encode(payload, os.getenv("SECRET_KEY"), algorithm="HS256")

def test_list_employees_for_admin(client):
    token = login_token("admin")
    r = client.get("/employees/", headers={"Authorization":f"Bearer {token}"})
    assert r.status_code in (200,404)

def test_get_my_profile_user(client):
    token = login_token("user")
    r = client.get("/employees/me", headers={"Authorization":f"Bearer {token}"})
    assert r.status_code in (200,404)
