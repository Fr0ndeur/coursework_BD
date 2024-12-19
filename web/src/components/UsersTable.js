import React from 'react';

const UsersTable = ({ users, employees }) => {
  return (
    <div>
      <table className='table-auto w-full border border-gray-300 rounded-lg'>
        <thead>
          <tr className='bg-gray-100'>
            <th className='border px-4 py-2'>User ID</th>
            <th className='border px-4 py-2'>Username</th>
            <th className='border px-4 py-2'>Role</th>
            <th className='border px-4 py-2'>Assigned Employee</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => {
            const assignedEmployee = employees.find(
              (emp) => emp.employee_id === user.employee_id
            );

            return (
              <tr key={user.user_id}>
                <td className='border px-4 py-2'>{user.user_id}</td>
                <td className='border px-4 py-2'>{user.username}</td>
                <td className='border px-4 py-2'>{user.role}</td>
                <td className='border px-4 py-2'>
                  {assignedEmployee
                    ? `${assignedEmployee.full_name} (${assignedEmployee.position})`
                    : 'Not Assigned'}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default UsersTable;
