import React, { useState } from 'react';

const EmployeeEditModal = ({ employee, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    full_name: employee?.full_name || '',
    position: employee?.position || '',
    internal_phone_number: employee?.internal_phone_number || '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = () => {
    // Construct the updated employee data
    const updatedData = {
      ...employee,
      ...formData,
    };
    onSave(updatedData); // Send the updated data to the parent component
  };

  return (
    <div className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-50'>
      <div className='bg-white rounded-lg p-6 w-full max-w-lg shadow-lg'>
        <h2 className='text-xl font-bold mb-4'>Edit Employee</h2>

        <div className='mb-4'>
          <label className='block text-sm font-medium mb-1'>Employee ID</label>
          <input
            type='text'
            value={employee.employee_id}
            readOnly
            className='w-full border border-gray-300 rounded-lg p-2 bg-gray-100'
          />
        </div>

        <div className='mb-4'>
          <label className='block text-sm font-medium mb-1'>Full Name</label>
          <input
            type='text'
            name='full_name'
            placeholder='Enter full name'
            value={formData.full_name}
            onChange={handleChange}
            className='w-full border border-gray-300 rounded-lg p-2'
          />
        </div>

        <div className='mb-4'>
          <label className='block text-sm font-medium mb-1'>Position</label>
          <input
            type='text'
            name='position'
            placeholder='Enter position'
            value={formData.position}
            onChange={handleChange}
            className='w-full border border-gray-300 rounded-lg p-2'
          />
        </div>

        <div className='mb-4'>
          <label className='block text-sm font-medium mb-1'>Phone Number</label>
          <input
            type='text'
            name='internal_phone_number'
            placeholder='Enter phone number'
            value={formData.internal_phone_number}
            onChange={handleChange}
            className='w-full border border-gray-300 rounded-lg p-2'
          />
        </div>

        <div className='flex justify-end gap-4'>
          <button
            onClick={onClose}
            className='bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400'
          >
            Close
          </button>
          <button
            onClick={handleSubmit}
            className='bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600'
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default EmployeeEditModal;
