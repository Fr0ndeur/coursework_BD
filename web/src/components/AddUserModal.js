import React, { useState } from 'react';

const AddUserModal = ({ onClose, onAdd, employees }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');
  const [employeeId, setEmployeeId] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!username || !password || !role) {
      alert('Please fill in all required fields.');
      return;
    }

    onAdd({ username, password, role, employee_id: employeeId });
    onClose();
  };

  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center'>
      <div className='bg-white rounded-lg shadow-lg p-6 w-1/2'>
        <h2 className='text-xl font-bold mb-4'>Add New User</h2>
        <form onSubmit={handleSubmit} className='space-y-4'>
          <div>
            <label className='block text-sm font-medium mb-1'>Username</label>
            <input
              type='text'
              className='border border-gray-300 rounded-lg p-2 w-full'
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div>
            <label className='block text-sm font-medium mb-1'>Password</label>
            <input
              type='password'
              className='border border-gray-300 rounded-lg p-2 w-full'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div>
            <label className='block text-sm font-medium mb-1'>Role</label>
            <select
              className='border border-gray-300 rounded-lg p-2 w-full'
              value={role}
              onChange={(e) => setRole(e.target.value)}
              required
            >
              <option value=''>Select a role</option>
              <option value='admin'>Admin</option>
              <option value='accountant'>Accountant</option>
              <option value='user'>User</option>
            </select>
          </div>
          <div>
            <label className='block text-sm font-medium mb-1'>Employee</label>
            <select
              className='border border-gray-300 rounded-lg p-2 w-full'
              value={employeeId}
              onChange={(e) => setEmployeeId(e.target.value)}
            >
              <option value=''>No employee</option>
              {employees.map((emp) => (
                <option key={emp.employee_id} value={emp.employee_id}>
                  {`${emp.employee_id} - ${emp.full_name} (${emp.position})`}
                </option>
              ))}
            </select>
          </div>
          <div className='flex justify-end space-x-4'>
            <button
              type='button'
              className='bg-gray-300 px-4 py-2 rounded-lg'
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type='submit'
              className='bg-blue-500 text-white px-4 py-2 rounded-lg'
            >
              Create User
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddUserModal;
