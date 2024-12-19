import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router';
import { FaChevronRight, FaChevronLeft } from 'react-icons/fa';

const NavigationPanel = ({ onToggle }) => {
  const [isOpen, setIsOpen] = useState(true); // Состояние панели
  const [role, setRole] = useState(''); // Роль пользователя
  const [loading, setLoading] = useState(true); // Состояние загрузки
  const [error, setError] = useState(''); // Состояние ошибки

  const togglePanel = () => {
    setIsOpen((prevState) => {
      const newState = !prevState;
      if (onToggle) onToggle(newState); // Передаем состояние панели в родительский компонент
      return newState;
    });
  };

  // Получение роли пользователя при загрузке
  useEffect(() => {
    const fetchRole = async () => {
      try {
        const response = await fetch('http://localhost:5000/users/me', {
          method: 'GET',
          credentials: 'include', // Использование HTTP-only cookies
        });

        if (!response.ok) {
          throw new Error('Failed to fetch user role.');
        }

        const userData = await response.json();
        setRole(userData.role); // Устанавливаем роль пользователя
        setLoading(false); // Снимаем статус загрузки
      } catch (err) {
        console.error('Error fetching role:', err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchRole();
  }, []);

  // Навигационные ссылки
  const navLinks = [
    { to: '/admin', label: 'Admin Page', roles: ['admin'] },
    {
      to: '/accountant',
      label: 'Accountant Page',
      roles: ['admin', 'accountant'],
    },
    { to: '/user', label: 'User Page', roles: ['admin', 'accountant', 'user'] },
  ];

  if (loading) {
    return <div className='text-white p-4'>Loading...</div>;
  }

  if (error) {
    return <div className='text-red-500 p-4'>Error: {error}</div>;
  }

  return (
    <div
      className={`h-screen bg-gray-800 text-white fixed transition-all duration-300 ${
        isOpen ? 'w-48' : 'w-16'
      }`}
    >
      {/* Верхняя часть панели */}
      <div className='flex items-center justify-between p-4 relative'>
        {isOpen && (
          <h1 className='text-lg font-bold transition-opacity duration-300'>
            Navigation
          </h1>
        )}
        <button
          onClick={togglePanel}
          className={`absolute top-4 right-4 text-white p-2 rounded-full hover:bg-gray-700 focus:outline-none ${
            isOpen ? 'ml-auto' : 'mr-0'
          }`}
        >
          {isOpen ? <FaChevronLeft /> : <FaChevronRight />}
        </button>
      </div>

      {/* Навигационные ссылки */}
      <nav
        className={`flex flex-col gap-4 transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        {navLinks
          .filter((link) => link.roles.includes(role)) // Фильтруем ссылки по роли
          .map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `block px-4 py-2 rounded-lg text-center ${
                  isActive ? 'bg-blue-500' : 'hover:bg-gray-700'
                }`
              }
            >
              {label}
            </NavLink>
          ))}
      </nav>
    </div>
  );
};

export default NavigationPanel;
