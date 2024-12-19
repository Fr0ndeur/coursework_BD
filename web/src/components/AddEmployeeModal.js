import React, { useState, useEffect } from 'react';

const AddEmployeeModal = ({ onClose, onAdd }) => {
  const [newEmployee, setNewEmployee] = useState({
    full_name: '',
    position: '',
    internal_phone_number: '',
    department_id: '', // ID департамента
  });

  const [departments, setDepartments] = useState([]);

  // Получение всех департаментов
  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await fetch('http://localhost:5000/departments', {
          method: 'GET',
          credentials: 'include',
        });
        if (!response.ok) throw new Error('Failed to fetch departments.');
        const departmentData = await response.json();
        setDepartments(departmentData);
      } catch (err) {
        console.error(err);
      }
    };

    fetchDepartments();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewEmployee((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Проверяем, что все поля заполнены
    if (
      !newEmployee.full_name ||
      !newEmployee.position ||
      !newEmployee.internal_phone_number ||
      !newEmployee.department_id
    ) {
      alert('All fields are required.');
      return;
    }

    onAdd(newEmployee); // Передаем данные в родительский компонент
    onClose(); // Закрываем модалку
  };

  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
      <div className='bg-white rounded-lg p-6 w-96'>
        <h2 className='text-xl font-bold mb-4'>Add New Employee</h2>
        <form onSubmit={handleSubmit}>
          <div className='mb-4'>
            <label htmlFor='full_name' className='block font-semibold mb-1'>
              Full Name
            </label>
            <input
              type='text'
              id='full_name'
              name='full_name'
              value={newEmployee.full_name}
              onChange={handleChange}
              className='w-full border rounded-lg p-2'
              placeholder='Enter full name'
            />
          </div>
          <div className='mb-4'>
            <label htmlFor='position' className='block font-semibold mb-1'>
              Position
            </label>
            <input
              type='text'
              id='position'
              name='position'
              value={newEmployee.position}
              onChange={handleChange}
              className='w-full border rounded-lg p-2'
              placeholder='Enter position'
            />
          </div>
          <div className='mb-4'>
            <label
              htmlFor='internal_phone_number'
              className='block font-semibold mb-1'
            >
              Phone Number
            </label>
            <input
              type='text'
              id='internal_phone_number'
              name='internal_phone_number'
              value={newEmployee.internal_phone_number}
              onChange={handleChange}
              className='w-full border rounded-lg p-2'
              placeholder='Enter phone number'
            />
          </div>
          <div className='mb-4'>
            <label htmlFor='department_id' className='block font-semibold mb-1'>
              Department
            </label>
            <select
              id='department_id'
              name='department_id'
              value={newEmployee.department_id}
              onChange={handleChange}
              className='w-full border rounded-lg p-2'
            >
              <option value=''>Select Department</option>
              {departments.map((dept) => (
                <option key={dept.department_id} value={dept.department_id}>
                  {dept.name}
                </option>
              ))}
            </select>
          </div>
          <div className='flex justify-end gap-4'>
            <button
              type='button'
              onClick={onClose}
              className='bg-gray-300 text-black px-4 py-2 rounded-lg'
            >
              Cancel
            </button>
            <button
              type='submit'
              className='bg-blue-500 text-white px-4 py-2 rounded-lg'
            >
              Add Employee
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddEmployeeModal;
