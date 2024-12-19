import React, { useState } from 'react';

const AddDepartmentModal = ({ onClose, onAdd }) => {
  const [name, setName] = useState('');
  const [manager, setManager] = useState('');

  const handleSubmit = () => {
    if (!name || !manager) {
      alert('Both fields are required.');
      return;
    }

    onAdd({ name, manager });
    onClose();
  };

  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
      <div className='bg-white p-6 rounded-lg shadow-lg w-96'>
        <h2 className='text-xl font-bold mb-4'>Create Department</h2>
        <div className='mb-4'>
          <label className='block text-sm font-medium mb-1'>
            Department Name
          </label>
          <input
            type='text'
            value={name}
            onChange={(e) => setName(e.target.value)}
            className='border border-gray-300 rounded-lg p-2 w-full'
            placeholder='Enter department name'
          />
        </div>
        <div className='mb-4'>
          <label className='block text-sm font-medium mb-1'>Manager</label>
          <input
            type='text'
            value={manager}
            onChange={(e) => setManager(e.target.value)}
            className='border border-gray-300 rounded-lg p-2 w-full'
            placeholder='Enter manager name'
          />
        </div>
        <div className='flex justify-end'>
          <button
            onClick={onClose}
            className='bg-gray-300 px-4 py-2 rounded-lg mr-2'
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className='bg-blue-500 text-white px-4 py-2 rounded-lg'
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddDepartmentModal;
