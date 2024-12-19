import React, { useState, useEffect } from 'react';
import NavigationPanel from '../components/Nav-panel.js';
import EmployeeEditModal from '../components/EmployeeEditModal.js';
import AddEmployeeModal from '../components/AddEmployeeModal';
import UsersTable from '../components/UsersTable.js';
import AddDepartmentModal from '../components/AddDepartmentModal.js';
import AddUserModal from '../components/AddUserModal.js';
import EmployeeViewModal from '../components/EmployeeViewModal.js';

const AdminPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [userRole, setUserRole] = useState('');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isAddDepartmentModalOpen, setIsAddDepartmentModalOpen] =
    useState(false);
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [viewEmployee, setViewEmployee] = useState(null);

  // Fetch employees and departments on page load
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [
          employeeResponse,
          usersResponse,
          departmentResponse,
          roleResponse,
        ] = await Promise.all([
          fetch('http://localhost:5000/employees/', {
            method: 'GET',
            credentials: 'include',
          }),
          fetch('http://localhost:5000/users/', {
            method: 'GET',
            credentials: 'include',
          }),
          fetch('http://localhost:5000/departments', {
            method: 'GET',
            credentials: 'include',
          }),
          fetch('http://localhost:5000/users/me', {
            method: 'GET',
            credentials: 'include',
          }),
        ]);

        if (
          !employeeResponse.ok ||
          !usersResponse.ok ||
          !departmentResponse.ok ||
          !roleResponse.ok
        ) {
          throw new Error('Failed to fetch data.');
        }

        const employeeData = await employeeResponse.json();
        const userData = await usersResponse.json();
        const departmentData = await departmentResponse.json();
        const roleData = await roleResponse.json();

        setUserRole(roleData.role);
        const sanitizedEmployees = employeeData.map((emp) => ({
          id: emp.employee_id, // Используем для отображения
          employee_id: emp.employee_id, // Оставляем для запросов
          full_name: emp.full_name || 'Unknown',
          position: emp.position || 'Unknown',
          internal_phone_number: emp.internal_phone_number || 'N/A',
          department_id: emp.department_id,
          hire_date: emp.hire_date || 'N/A', // Новое поле
          card_number: emp.card_number || 'N/A', // Новое поле
        }));

        setEmployees(sanitizedEmployees);
        setDepartments(departmentData);
        setUsers(userData);
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
  const handleAddEmployee = async (newEmployee) => {
    try {
      const response = await fetch('http://localhost:5000/employees/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(newEmployee),
      });

      if (!response.ok) throw new Error('Failed to add employee.');
      const addedEmployee = await response.json();

      setEmployees((prev) => [...prev, addedEmployee]);
    } catch (err) {
      console.error(err);
      setError(err.message);
    }
  };

  const handleViewEmployee = (employee) => {
    setViewEmployee(employee);
    setIsViewModalOpen(true);
  };

  const handleAddUser = async (newUser) => {
    try {
      const response = await fetch('http://localhost:5000/users/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(newUser),
      });

      if (!response.ok) throw new Error('Failed to add user.');
      const addedUser = await response.json();

      setUsers((prev) => [...prev, addedUser]);
    } catch (err) {
      console.error(err);
      setError(err.message);
    }
  };

  const handleAddDepartment = async (newDepartment) => {
    try {
      const response = await fetch('http://localhost:5000/departments/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(newDepartment),
      });

      if (!response.ok) throw new Error('Failed to add department.');
      const addedDepartment = await response.json();

      setDepartments((prev) => [...prev, addedDepartment]);
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
    if (!id || (typeof id !== 'string' && typeof id !== 'number')) {
      console.error('Invalid ID:', id);
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/employees/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (!response.ok) throw new Error('Failed to delete employee.');
      setEmployees((prev) => prev.filter((emp) => emp.employee_id !== id));
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
          onSave={handleSaveEmployee} // Передаем правильный метод
        />
      )}

      {isAddModalOpen && (
        <AddEmployeeModal
          onClose={() => setIsAddModalOpen(false)}
          onAdd={handleAddEmployee}
          departments={departments}
        />
      )}
      {isAddDepartmentModalOpen && (
        <AddDepartmentModal
          onClose={() => setIsAddDepartmentModalOpen(false)}
          onAdd={handleAddDepartment}
        />
      )}

      {isAddUserModalOpen && (
        <AddUserModal
          onClose={() => setIsAddUserModalOpen(false)}
          onAdd={handleAddUser}
          employees={employees}
        />
      )}

      {isViewModalOpen && (
        <EmployeeViewModal
          employee={viewEmployee}
          onClose={() => setIsViewModalOpen(false)}
          userRole={userRole} // Передаём роль пользователя
        />
      )}

      <NavigationPanel />
      <div className='flex-1 ml-48 p-8'>
        <h1 className='text-2xl font-bold mb-6'>Admin Page</h1>

        {/* Employee Table */}
        <div className='mb-8'>
          <div className='flex justify-between'>
            <input
              type='text'
              placeholder='Search employees...'
              className='border border-gray-300 rounded-lg p-2 w-full mb-4'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button
              className='bg-green-500 text-white px-4 py-2 rounded-lg mb-4'
              onClick={() => setIsAddModalOpen(true)}
            >
              Add Employee
            </button>
          </div>
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
              {employees
                .filter((emp) =>
                  [emp.full_name, emp.position, emp.internal_phone_number]
                    .join(' ')
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase())
                )
                .map((emp) => (
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
                        className='text-blue-500 mr-2'
                        onClick={() => handleEditEmployee(emp)}
                      >
                        Edit
                      </button>
                      <button
                        className='text-red-500 mr-2'
                        onClick={() => handleDeleteEmployee(emp.employee_id)}
                      >
                        Delete
                      </button>
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

        {/* Departments Table */}
        <div className='mb-8'>
          <h2 className='text-xl font-bold mb-4'>Departments</h2>
          <button
            className='bg-blue-500 text-white px-4 py-2 rounded-lg mb-4'
            onClick={() => setIsAddDepartmentModalOpen(true)}
          >
            Add Department
          </button>
          <table className='table-auto w-full border border-gray-300 rounded-lg'>
            <thead>
              <tr className='bg-gray-100'>
                <th className='border px-4 py-2'>Department ID</th>
                <th className='border px-4 py-2'>Name</th>
              </tr>
            </thead>
            <tbody>
              {departments.map((dept) => (
                <tr key={dept.department_id}>
                  <td className='border px-4 py-2'>{dept.department_id}</td>
                  <td className='border px-4 py-2'>{dept.name}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Users Table */}
        <div className='mb-8'>
          <h2 className='text-xl font-bold mb-4'>Users</h2>
          <button
            className='bg-blue-500 text-white px-4 py-2 rounded-lg mb-4'
            onClick={() => setIsAddUserModalOpen(true)}
          >
            Add User
          </button>
          <UsersTable users={users} employees={employees} />
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
