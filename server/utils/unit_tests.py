# server/utils/unit_tests.py
import requests

BASE_URL = "http://localhost:5000"
USERNAME = "mykyta"  # Укажите существующего пользователя
PASSWORD = "mykyta"  # Пароль пользователя

def login():
    url = f"{BASE_URL}/users/login"
    response = requests.post(url, json={"username": USERNAME, "password": PASSWORD})
    if response.status_code == 200:
        print("Login successful")
        token = response.json()["token"]
        return token
    else:
        print(f"Login failed: {response.json()}\n")
        return None

def get_all_users(headers):
    url = f"{BASE_URL}/users/"
    response = requests.get(url, headers=headers)
    if response.status_code == 200:
        print("Users:", response.json())
    else:
        print(f"Failed to get users: {response.status_code}, {response.json()}\n")

def get_all_departments(headers):
    url = f"{BASE_URL}/departments/"
    response = requests.get(url, headers=headers)
    if response.status_code == 200:
        print("Departments:", response.json())
    else:
        print(f"Failed to get departments: {response.status_code}, {response.json()}\n")

def get_billing_summary(headers):
    month_year = "2024-12"  # Укажите месяц и год
    url = f"{BASE_URL}/billing/summary/{month_year}"
    response = requests.get(url, headers=headers)
    if response.status_code == 200:
        print("Billing Summary:", response.json())
    else:
        print(f"Failed to get billing summary: {response.status_code}, {response.json()}\n")

def list_bills(headers):
    url = f"{BASE_URL}/billing/"
    response = requests.get(url, headers=headers)
    if response.status_code == 200:
        print("Bills:", response.json())
    else:
        print(f"Failed to get bills: {response.status_code}, {response.json()}\n")

def get_all_rates(headers):
    url = f"{BASE_URL}/rates/"
    response = requests.get(url, headers=headers)
    if response.status_code == 200:
        print("Rates:", response.json())
    else:
        print(f"Failed to get rates: {response.status_code}, {response.json()}\n")

def main():
    token = login()
    if not token:
        return

    headers = {"Authorization": f"Bearer {token}"}

    print("\n--- Testing API Endpoints ---\n")

    print("1. Get all users:")
    get_all_users(headers)

    print("2. Get all departments:")
    get_all_departments(headers)

    print("3. Get billing summary:")
    get_billing_summary(headers)

    print("4. List all bills:")
    list_bills(headers)

    print("5. Get all rates:")
    get_all_rates(headers)

    print("6. Test completed successfully.")

if __name__ == "__main__":
    main()
