import React, { useState, useEffect } from 'react';
import NavigationPanel from '../components/Nav-panel.js';
import EmployeeViewModal from '../components/EmployeeViewModal.js';
import BillListHorizontal from '../components/BillListHorizontal.js';

const AccountantPage = () => {
  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [billingSummary, setBillingSummary] = useState(null);
  const [unpaidBillsDetails, setUnpaidBillsDetails] = useState([]);
  const [subscribers, setSubscribers] = useState([]);
  const [selectedSubscriber, setSelectedSubscriber] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('');
  const [selectedMonthYear, setSelectedMonthYear] = useState('');
  const [loading, setLoading] = useState(true);
  const [individualReport, setIndividualReport] = useState(null);
  const [error, setError] = useState('');
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [viewEmployee, setViewEmployee] = useState(null);

  // Fetch employees and departments on page load
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [employeeResponse, departmentResponse] = await Promise.all([
          fetch('http://localhost:5000/employees/', {
            method: 'GET',
            credentials: 'include',
          }),
          fetch('http://localhost:5000/departments', {
            method: 'GET',
            credentials: 'include',
          }),
        ]);

        const employeeData = employeeResponse.ok
          ? await employeeResponse.json()
          : [];
        const departmentData = departmentResponse.ok
          ? await departmentResponse.json()
          : [];

        const sanitizedEmployees = employeeData.map((emp) => ({
          id: emp.employee_id,
          employee_id: emp.employee_id,
          full_name: emp.full_name || 'Unknown',
          position: emp.position || 'Unknown',
          internal_phone_number: emp.internal_phone_number || 'N/A',
          department_id: emp.department_id,
          hire_date: emp.hire_date || 'N/A',
          card_number: emp.card_number || 'N/A',
        }));

        setEmployees(sanitizedEmployees);
        setSubscribers(
          employeeData.map((sub) => ({
            id: sub.employee_id,
            name: sub.full_name || 'Unknown',
            balance: sub.total_cost || 0,
          }))
        );
        setDepartments(departmentData);
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleViewEmployee = (employee) => {
    setViewEmployee(employee);
    setIsViewModalOpen(true);
  };

  const deleteBill = async (billId) => {
    try {
      const response = await fetch(`http://localhost:5000/billing/${billId}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to delete bill.');
      }

      alert('Bill deleted successfully!');
      // Удаляем удаленный счет из списка
      setUnpaidBillsDetails((prev) =>
        prev.filter((bill) => bill.bill_id !== billId)
      );
    } catch (err) {
      console.error(err);
      alert('Error deleting bill: ' + err.message);
    }
  };

  const generateIndividualReport = async () => {
    if (!selectedSubscriber || !selectedMonth) {
      alert('Please select a subscriber and month.');
      return;
    }

    try {
      console.log('Starting report generation...');
      const response = await fetch(
        'http://localhost:5000/billing/monthly-report',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({
            employee_id: parseInt(selectedSubscriber),
            month_year: selectedMonth,
          }),
        }
      );

      if (!response.ok) {
        console.error(
          'Failed to fetch report. Response status:',
          response.status
        );
        throw new Error('Failed to generate report.');
      }

      const data = await response.json();
      console.log('Response from server:', data);

      // Проверяем, есть ли поле `bill` в ответе
      if (!data.bill) {
        console.warn(data.message || 'No bill data available.');
        setIndividualReport(null); // Сбрасываем существующий отчет
        alert(
          data.message ||
            'No report available for the selected employee and month.'
        );
        return;
      }

      const { bill } = data;

      console.log('Valid bill data received:', bill);

      const subscriber = subscribers.find((sub) => sub.id === bill.employee_id);
      if (!subscriber) {
        console.error(
          `Subscriber with ID ${bill.employee_id} not found in the list.`,
          subscribers
        );
        alert('Subscriber data is not available.');
        return;
      }

      console.log('Subscriber found:', subscriber);

      setIndividualReport({
        ...bill,
        name: subscriber.name || 'Unknown',
        balance: subscriber.balance || 0,
      });

      console.log('Report successfully generated and set:', {
        ...bill,
        name: subscriber.name,
        balance: subscriber.balance,
      });
    } catch (err) {
      console.error('Error during report generation:', err);
      setError(err.message);
    }
  };

  const fetchBillingSummary = async () => {
    if (!selectedMonthYear) {
      alert('Please select a month and year.');
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:5000/billing/summary/${selectedMonthYear}`,
        {
          method: 'GET',
          credentials: 'include',
        }
      );

      if (!response.ok) {
        if (response.status === 404) {
          setBillingSummary({
            total_amount: 0,
            paid_amount: 0,
            unpaid_bills: [],
          });
          setUnpaidBillsDetails([]);
        } else {
          throw new Error('Failed to fetch billing summary.');
        }
        return;
      }

      const summary = await response.json();
      setBillingSummary(summary);

      // Fetch details for unpaid bills only if they exist
      if (summary.unpaid_bills && summary.unpaid_bills.length > 0) {
        const billDetailsPromises = summary.unpaid_bills.map((billId) =>
          fetch(`http://localhost:5000/billing/${billId}`, {
            method: 'GET',
            credentials: 'include',
          }).then((res) => res.json())
        );

        const detailedBills = await Promise.all(billDetailsPromises);

        // Attach employee information to each bill
        const detailedBillsWithEmployees = detailedBills.map((bill) => {
          const employee = employees.find(
            (emp) => emp.employee_id === bill.employee_id
          );
          return {
            ...bill,
            employee_name: employee?.full_name || 'Unknown',
            employee_position: employee?.position || 'Unknown',
          };
        });

        setUnpaidBillsDetails(detailedBillsWithEmployees);
      } else {
        setUnpaidBillsDetails([]);
      }
    } catch (err) {
      console.error(err);
      setError(err.message);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p className='text-red-500'>Error: {error}</p>;

  return (
    <div className='flex'>
      {isViewModalOpen && (
        <EmployeeViewModal
          employee={viewEmployee}
          onClose={() => setIsViewModalOpen(false)}
        />
      )}

      <NavigationPanel />
      <div className='flex-1 ml-48 p-8'>
        <h1 className='text-2xl font-bold mb-6'>Accountant Dashboard</h1>

        {/* Employee Table */}
        <div className='mb-8'>
          <h2 className='text-xl font-bold mb-4'>Employees</h2>
          <table className='table-auto w-full border border-gray-300 rounded-lg'>
            <thead>
              <tr className='bg-gray-100'>
                <th className='border px-4 py-2'>Employee ID</th>
                <th className='border px-4 py-2'>Full Name</th>
                <th className='border px-4 py-2'>Position</th>
                <th className='border px-4 py-2'>Phone</th>
                <th className='border px-4 py-2'>Department</th>
                <th className='border px-4 py-2'>Hire Date</th>
                <th className='border px-4 py-2'>Card Number</th>
                <th className='border px-4 py-2'>Actions</th>
              </tr>
            </thead>
            <tbody>
              {employees.map((emp) => (
                <tr key={emp.employee_id}>
                  <td className='border px-4 py-2'>{emp.employee_id}</td>
                  <td className='border px-4 py-2'>{emp.full_name}</td>
                  <td className='border px-4 py-2'>{emp.position}</td>
                  <td className='border px-4 py-2'>
                    {emp.internal_phone_number}
                  </td>
                  <td className='border px-4 py-2'>
                    {departments.find(
                      (dept) => dept.department_id === emp.department_id
                    )?.name || 'N/A'}
                  </td>
                  <td className='border px-4 py-2'>{emp.hire_date}</td>
                  <td className='border px-4 py-2'>{emp.card_number}</td>
                  <td className='border px-4 py-2'>
                    <button
                      className='text-green-500'
                      onClick={() => handleViewEmployee(emp)}
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Individual Report Section */}
        <div className='mb-6'>
          <h2 className='text-xl font-bold mb-4'>Generate Individual Report</h2>
          <div className='flex items-center gap-4 mb-4'>
            <select
              className='border border-gray-300 rounded-lg p-2 flex-1'
              value={selectedSubscriber}
              onChange={(e) => setSelectedSubscriber(e.target.value)}
            >
              <option value=''>Select Subscriber</option>
              {subscribers.map((sub) => (
                <option key={sub.id} value={sub.id}>
                  {sub.name}
                </option>
              ))}
            </select>
            <input
              type='month'
              className='border border-gray-300 rounded-lg p-2 flex-1'
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
            />
            <button
              className='bg-blue-500 text-white px-4 py-2 rounded-lg'
              onClick={generateIndividualReport}
            >
              Generate Report
            </button>
          </div>
          {individualReport && (
            <div className='border border-gray-300 rounded-lg p-4'>
              <h3 className='text-lg font-bold mb-2'>Individual Report</h3>
              <p>
                Name:{' '}
                <span className='font-bold'>
                  {individualReport.name || 'Unknown'}
                </span>
              </p>
              <p>
                Month:{' '}
                <span className='font-bold'>
                  {individualReport.month_year || 'N/A'}
                </span>
              </p>
              <p>
                Total Payments:{' '}
                <span className='font-bold'>
                  {individualReport.final_amount !== undefined
                    ? `$${individualReport.final_amount.toFixed(2)}`
                    : 'N/A'}
                </span>
              </p>
            </div>
          )}
        </div>

        {/* Billing Summary Section */}
        <div className='mb-8'>
          <h2 className='text-xl font-bold mb-4'>Billing Summary</h2>
          <div className='flex gap-4 items-center mb-4'>
            <input
              type='month'
              className='border border-gray-300 rounded-lg p-2'
              value={selectedMonthYear}
              onChange={(e) => setSelectedMonthYear(e.target.value)}
            />
            <button
              className='bg-blue-500 text-white px-4 py-2 rounded-lg'
              onClick={fetchBillingSummary}
            >
              Get Summary
            </button>
          </div>
          {billingSummary && (
            <div className='border border-gray-300 rounded-lg p-4'>
              <p>
                <strong>Total Amount:</strong> ${billingSummary.total_amount}
              </p>
              <p>
                <strong>Paid Amount:</strong> ${billingSummary.paid_amount}
              </p>
              <h3 className='text-lg font-bold mt-4'>Unpaid Bills</h3>
              {unpaidBillsDetails.length > 0 ? (
                unpaidBillsDetails.map((bill) => (
                  <div
                    key={bill.bill_id}
                    className='border p-4 rounded-lg bg-red-100 mb-4'
                  >
                    <p>
                      <strong>Bill ID:</strong> {bill.bill_id}
                    </p>
                    <p>
                      <strong>Month/Year:</strong> {bill.month_year}
                    </p>
                    <p>
                      <strong>Total Cost:</strong> ${bill.total_cost}
                    </p>
                    <p>
                      <strong>Discount Applied:</strong> $
                      {bill.discount_applied}
                    </p>
                    <p>
                      <strong>Final Amount:</strong> ${bill.final_amount}
                    </p>
                    <p>
                      <strong>Duration:</strong> {bill.total_duration} minutes
                    </p>
                    <p>
                      <strong>Employee:</strong> {bill.employee_name} (
                      {bill.employee_position})
                    </p>
                  </div>
                ))
              ) : (
                <p>No unpaid bills found.</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AccountantPage;
