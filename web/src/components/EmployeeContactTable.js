import React, { useEffect, useState } from 'react';

const EmployeeContactTable = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Запрос к API для получения данных
    const fetchEmployeeContactInfo = async () => {
      try {
        const response = await fetch(
          'http://localhost:5000/employees/contact-info',
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
            credentials: 'include',
          }
        );

        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }

        const data = await response.json();
        setEmployees(data);
      } catch (error) {
        console.error('Error fetching employee contact info:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEmployeeContactInfo();
  }, []);

  if (loading) {
    return (
      <div className='flex items-center justify-center h-screen'>
        <div className='text-lg font-semibold text-gray-700'>Loading...</div>
      </div>
    );
  }

  return (
    <div className='container mx-auto px-4 py-8'>
      <h2 className='text-2xl font-bold text-gray-800 mb-6'>
        Employee Contact Information
      </h2>
      <div className='overflow-x-auto'>
        <table className='min-w-full bg-white shadow-md rounded-lg overflow-hidden'>
          <thead>
            <tr className='bg-gray-200 text-gray-600 uppercase text-sm leading-normal'>
              <th className='py-3 px-6 text-left'>Full Name</th>
              <th className='py-3 px-6 text-left'>Position</th>
              <th className='py-3 px-6 text-left'>Department</th>
              <th className='py-3 px-6 text-left'>Internal Phone Number</th>
            </tr>
          </thead>
          <tbody className='text-gray-700 text-sm font-light'>
            {employees.map((employee, index) => (
              <tr
                key={index}
                className='border-b border-gray-200 hover:bg-gray-100'
              >
                <td className='py-3 px-6 text-left whitespace-nowrap'>
                  {employee.full_name}
                </td>
                <td className='py-3 px-6 text-left whitespace-nowrap'>
                  {employee.position}
                </td>
                <td className='py-3 px-6 text-left whitespace-nowrap'>
                  {employee.department_name}
                </td>
                <td className='py-3 px-6 text-left whitespace-nowrap'>
                  {employee.internal_phone_number}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EmployeeContactTable;
