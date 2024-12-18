import React, { useState } from 'react';
import { Router, Route, useNavigate } from 'react-router'; // Импорт Router и useNavigate
import '../css/tailwind.css'; // Подключение Tailwind CSS

function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState(''); // Для отображения ошибок

  const navigate = useNavigate(); // Хук для навигации

  const handleLogin = async () => {
    try {
      const response = await fetch('http://localhost:5000/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Для работы с HTTP-only cookies
        body: JSON.stringify({
          username: username,
          password: password,
        }),
      });

      if (response.ok) {
        const data = await response.json();

        // Успешная авторизация: редирект на /user
        navigate('/user');
        setErrorMessage(''); // Сброс ошибок
      } else {
        const errorData = await response.json();
        setErrorMessage(errorData.message || 'Ошибка авторизации');
      }
    } catch (error) {
      console.error('Ошибка при входе:', error);
      setErrorMessage('Произошла ошибка при подключении к серверу.');
    }
  };

  return (
    <div className='flex h-screen'>
      {/* Левая часть */}
      <div className='w-1/2 bg-black text-white flex flex-col justify-between p-8'>
        <div>
          <h1 className='text-4xl font-bold'>mts</h1>
          <p className='text-md mt-2'>mega tele sila</p>
        </div>
        <div>
          <h2 className='text-lg font-semibold'>Полезная информация</h2>
          <p className='mt-2 text-2xl font-bold'>0 800 50 70 44</p>
          <p className='text-sm mt-1'>З мобильного по Украине бесплатно</p>
        </div>
      </div>

      {/* Правая часть */}
      <div className='w-1/2 bg-gray-100 flex items-center justify-center'>
        <div className='w-full max-w-md p-6'>
          <h2 className='text-xl font-bold text-center mb-6'>
            Введите ваши данные для входа
          </h2>

          {/* Поле логина */}
          <div className='mb-4'>
            <label htmlFor='username' className='block text-sm mb-1'>
              Логин
            </label>
            <input
              type='text'
              id='username'
              className='w-full border border-blue-500 rounded p-2'
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          {/* Поле пароля */}
          <div className='mb-4'>
            <label htmlFor='password' className='block text-sm mb-1'>
              Пароль
            </label>
            <input
              type='password'
              id='password'
              className='w-full border border-blue-500 rounded p-2'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {/* Сообщение об ошибке */}
          {errorMessage && (
            <div className='mb-4 text-red-500 text-sm'>{errorMessage}</div>
          )}

          {/* Кнопка продолжить */}
          <button
            className='w-full bg-blue-500 text-white py-2 rounded mb-4'
            onClick={handleLogin}
            disabled={!username || !password}
          >
            Войти
          </button>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
