import React, { useState, useEffect, useMemo } from 'react';
import NavigationPanel from '../components/Nav-panel.js';
import EmployeeEditModal from '../components/EmployeeEditModal.js';

const AdminPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [rates, setRates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  const [editingEmployee, setEditingEmployee] = useState(null);
  const [newEmployee, setNewEmployee] = useState({
    name: '',
    position: '',
    email: '',
  });

  // Fetch employees on page load
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:5000/employees/', {
          method: 'GET',
          credentials: 'include',
        });

        if (!response.ok) throw new Error('Failed to fetch employees.');

        const employeeData = await response.json();

        const sanitizedEmployees = employeeData.map((emp) => ({
          id: emp.employee_id, // Используем для отображения
          employee_id: emp.employee_id, // Оставляем для запросов
          full_name: emp.full_name || 'Unknown',
          position: emp.position || 'Unknown',
          internal_phone_number: emp.internal_phone_number || 'N/A',
          department_id: emp.department_id,
          hire_date: emp.hire_date,
          card_number: emp.card_number,
        }));

        setEmployees(sanitizedEmployees);
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // CRUD operations
  const handleAddEmployee = async () => {
    try {
      const response = await fetch('http://localhost:5000/employees/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(newEmployee),
      });

      if (!response.ok) throw new Error('Failed to add employee.');
      const addedEmployee = await response.json();
      setEmployees([...employees, addedEmployee]);
      setNewEmployee({ name: '', position: '', email: '' });
    } catch (err) {
      console.error(err);
      setError(err.message);
    }
  };

  const handleEditEmployee = (employee) => {
    if (!employee || !employee.employee_id) {
      console.error('Invalid employee data:', employee);
      return;
    }
    setSelectedEmployee(employee);
    setIsModalOpen(true);
  };

  const handleSaveEmployee = async (updatedEmployee) => {
    if (!updatedEmployee || !updatedEmployee.employee_id) {
      console.error('Invalid employee data:', updatedEmployee);
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:5000/employees/${updatedEmployee.employee_id}`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify(updatedEmployee),
        }
      );

      if (!response.ok) throw new Error('Failed to update employee.');

      setEmployees((prev) =>
        prev.map((emp) =>
          emp.employee_id === updatedEmployee.employee_id
            ? updatedEmployee
            : emp
        )
      );
      setIsModalOpen(false);
    } catch (err) {
      console.error('Error saving employee:', err);
      setError(err.message);
    }
  };

  const handleDeleteEmployee = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/employees/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (!response.ok) throw new Error('Failed to delete employee.');
      setEmployees(employees.filter((emp) => emp.id !== id));
    } catch (err) {
      console.error(err);
      setError(err.message);
    }
  };

  const filteredEmployees = employees.filter((emp) =>
    [emp.full_name, emp.position, emp.internal_phone_number]
      .join(' ')
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  if (loading) return <p>Loading...</p>;
  if (error) return <p className='text-red-500'>Error: {error}</p>;

  return (
    <div className='flex'>
      {isModalOpen && (
        <EmployeeEditModal
          employee={selectedEmployee}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSaveEmployee}
        />
      )}

      <NavigationPanel />
      <div className='flex-1 ml-48 p-8'>
        {' '}
        {/* Учёт ширины навигационной панели */}
        <h1 className='text-2xl font-bold mb-6'>Admin Page</h1>
        <input
          type='text'
          placeholder='Search...'
          className='border border-gray-300 rounded-lg p-2 w-full mb-4'
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <div>
          <h2 className='text-xl font-bold mb-4'>Employees</h2>
          <table className='table-auto w-full border border-gray-300 rounded-lg'>
            <thead>
              <tr className='bg-gray-100'>
                <th className='border px-4 py-2'>Full Name</th>
                <th className='border px-4 py-2'>Position</th>
                <th className='border px-4 py-2'>Phone</th>
                <th className='border px-4 py-2'>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredEmployees.map((emp) => (
                <tr key={emp.id}>
                  <td className='border px-4 py-2'>{emp.full_name}</td>
                  <td className='border px-4 py-2'>{emp.position}</td>
                  <td className='border px-4 py-2'>
                    {emp.internal_phone_number}
                  </td>
                  <td className='border px-4 py-2'>
                    <button
                      className='text-blue-500 mr-2'
                      onClick={() => handleEditEmployee(emp)}
                    >
                      Edit
                    </button>
                    <button
                      className='text-red-500'
                      onClick={() => handleDeleteEmployee(emp.employee_id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
