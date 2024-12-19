import React, { useState, useEffect } from 'react';
import BillListHorizontal from './BillListHorizontal';
import CallList from './CallList';

const EmployeeViewModal = ({ employee, onClose, userRole }) => {
  const [calls, setCalls] = useState([]);
  const [bills, setBills] = useState([]);
  const [discounts, setDiscounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const [callsResponse, billsResponse, discountsResponse] =
          await Promise.all([
            fetch(
              `http://localhost:5000/calls/employee/${employee.employee_id}`,
              {
                method: 'GET',
                credentials: 'include',
              }
            ),
            fetch(
              `http://localhost:5000/billing/employee/${employee.employee_id}`,
              {
                method: 'GET',
                credentials: 'include',
              }
            ),
            fetch(
              `http://localhost:5000/rates/employee/${employee.employee_id}/discounts`,
              {
                method: 'GET',
                credentials: 'include',
              }
            ),
          ]);

        const callsData = callsResponse.ok
          ? await callsResponse.json()
          : { calls: [] };
        const billsData = billsResponse.ok
          ? await billsResponse.json()
          : { bills: [] };
        const discountsData = discountsResponse.ok
          ? await discountsResponse.json()
          : { discounts: [] };

        setCalls(callsData.calls || []);
        setBills(billsData.bills || []);
        setDiscounts(discountsData.discounts || []);
      } catch (err) {
        console.error('Error fetching details:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [employee.employee_id]);

  const handleDeleteBill = async (billId) => {
    try {
      const response = await fetch(`http://localhost:5000/billing/${billId}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (!response.ok) throw new Error('Failed to delete bill.');

      setBills((prev) => prev.filter((bill) => bill.bill_id !== billId));
      alert('Bill deleted successfully.');
    } catch (err) {
      console.error(err);
      alert('Error deleting bill: ' + err.message);
    }
  };
  const handlePayBill = async (billId) => {
    try {
      const response = await fetch(
        `http://localhost:5000/billing/pay/${billId}`,
        {
          method: 'POST',
          credentials: 'include', // Для включення cookies, якщо потрібно
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to pay the bill.');
      }

      const updatedBill = await response.json();

      // Оновити список рахунків після оплати (припускаємо, що оновлені рахунки приходять в відповіді)
      setBills((prevBills) =>
        prevBills.map((bill) =>
          bill.bill_id === billId ? { ...bill, payment_status: 'PAID' } : bill
        )
      );
    } catch (error) {
      console.error('Payment error:', error);
      alert('Failed to process payment.');
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p className='text-red-500'>Error: {error}</p>;

  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center'>
      <div className='bg-white rounded-lg shadow-lg p-6 w-3/4 max-h-[90vh] overflow-y-auto'>
        <h2 className='text-xl font-bold mb-4'>
          Details for {employee.full_name}
        </h2>

        {/* Discounts Section */}
        <div className='mb-4'>
          <h3 className='text-lg font-bold mb-2'>Discounts</h3>
          {discounts.length > 0 ? (
            <ul className='list-disc list-inside'>
              {discounts.map((discount, index) => (
                <li key={index}>
                  Type:{' '}
                  {discount.call_type.charAt(0).toUpperCase() +
                    discount.call_type.slice(1)}{' '}
                  - Discount:{' '}
                  <span className='font-bold'>{discount.discount}%</span>
                </li>
              ))}
            </ul>
          ) : (
            <p>No discounts available.</p>
          )}
        </div>

        {/* Calls and Bills Section */}
        <div className='space-y-8'>
          <CallList calls={calls} />
          <BillListHorizontal
            bills={bills}
            onPayBill={() => {
              handlePayBill;
            }}
            onDeleteBill={handleDeleteBill}
            userRole={userRole}
          />
        </div>

        <button
          className='bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 mt-4'
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default EmployeeViewModal;
