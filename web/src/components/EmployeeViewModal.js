import React, { useState, useEffect } from 'react';
import BillList from './BillList';
import CallList from './CallList';

const EmployeeViewModal = ({ employee, onClose }) => {
  const [calls, setCalls] = useState([]);
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const [callsResponse, billsResponse] = await Promise.all([
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
        ]);

        if (!callsResponse.ok || !billsResponse.ok) {
          throw new Error('Failed to fetch employee details.');
        }

        const callsData = await callsResponse.json();
        const billsData = await billsResponse.json();

        setCalls(callsData.calls || []);
        setBills(billsData.bills || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [employee.employee_id]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p className='text-red-500'>Error: {error}</p>;

  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center'>
      <div className='bg-white rounded-lg shadow-lg p-6 w-3/4 max-h-[90vh] overflow-y-auto'>
        <h2 className='text-xl font-bold mb-4'>
          Details for {employee.full_name}
        </h2>
        <div className='space-y-8'>
          <CallList calls={calls} />
          <BillList bills={bills} />
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
