# tests/contracts/test_login_contract.py
from pact import Consumer, Provider, Like
import requests

consumer = Consumer('FrontendApp')\
    .has_pact_with(Provider('AuthService'), pact_dir='./pacts')

def test_login_contract():
    expected = {
        'message': Like('Login successful'),
        'role':    Like('admin'),
        'token':   Like('eyJhbGciOiJI...')  # любая JWT-строка
    }

    (consumer
     .given('user admin exists with password admin')
     .upon_receiving('a login request')
     .with_request('post', '/users/login', body={'username':'admin','password':'admin'})
     .will_respond_with(200, body=expected))

    with consumer:
        # направляем запрос на mock-сервер Pact (обычно localhost:1234)
        url = f'http://{consumer.host_name}:{consumer.port}/users/login'
        r = requests.post(url, json={'username':'admin','password':'admin'})
        assert r.status_code == 200
        assert 'token' in r.json()
