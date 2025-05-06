# tests/contracts/test_billing_report_contract.py
from pact import Consumer, Provider, Like
import requests

consumer = Consumer('ReportingApp')\
    .has_pact_with(Provider('BillingService'), pact_dir='./pacts')

def test_monthly_report_contract():
    req = {'employee_id':5,'month_year':'2024-05'}
    expected = {
      'message': Like('Billing report generated successfully.'),
      'bill': {
         'employee_id':    Like(5),
         'month_year':     Like('2024-05'),
         'total_duration': Like(10),
         'total_cost':     Like(20.0),
         'discount_applied':Like(0.0),
         'final_amount':   Like(20.0),
         'payment_status': Like('UNPAID')
      }
    }

    (consumer
     .given('employee 5 has unbilled calls for 2024-05')
     .upon_receiving('a request for monthly report')
     .with_request('post','/billing/monthly-report', body=req)
     .will_respond_with(200, body=expected))

    with consumer:
        url = f'http://{consumer.host_name}:{consumer.port}/billing/monthly-report'
        r = requests.post(url, json=req)
        assert r.status_code == 200
