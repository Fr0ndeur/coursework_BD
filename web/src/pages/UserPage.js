import React, { useState, useEffect } from 'react';
import NavigationPanel from '../components/Nav-panel.js';
import BillList from '../components/BillList';
import CallHistory from '../components/CallHistory';

const UserPage = () => {
  const [balance, setBalance] = useState(1200); // User's current balance (пока оставляем как есть)
  const [discounts, setDiscounts] = useState([]); // Discounts data
  const [newPlan, setNewPlan] = useState(''); // Selected new plan
  const [topUpAmount, setTopUpAmount] = useState(''); // Amount to top up
  const [bills, setBills] = useState([]); // User bills
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(''); // Error state

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Запрос к API для получения текущего пользователя
        const userResponse = await fetch('http://localhost:5000/users/me', {
          method: 'GET',
          credentials: 'include', // Включаем cookies
        });

        if (!userResponse.ok) {
          throw new Error('Failed to fetch user data.');
        }

        const userData = await userResponse.json();
        const employeeId = userData.employee_id;

        // Запрос к API для получения счетов
        const billsResponse = await fetch(
          `http://localhost:5000/billing/employee/${employeeId}`,
          {
            method: 'GET',
            credentials: 'include', // Включаем cookies
          }
        );

        if (!billsResponse.ok) {
          throw new Error('Failed to fetch billing data.');
        }

        const billsData = await billsResponse.json(); // Объявляем переменную здесь

        // Проверяем, является ли billsData массивом
        if (Array.isArray(billsData)) {
          setBills(billsData); // Устанавливаем счета напрямую
        } else if (billsData.bills && Array.isArray(billsData.bills)) {
          setBills(billsData.bills); // Если данные в поле "bills"
        } else {
          throw new Error('Unexpected billing data format.');
        }

        setLoading(false); // Снимаем состояние загрузки
      } catch (err) {
        console.error('Error fetching data:', err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handlePlanChange = () => {
    if (newPlan) {
      alert(`Your plan has been changed to: ${newPlan}`);
      setNewPlan('');
    } else {
      alert('Please select a new plan before submitting.');
    }
  };

  const handleTopUp = () => {
    const amount = parseFloat(topUpAmount);
    if (amount && amount > 0) {
      setBalance(balance + amount);
      alert(`Your account has been topped up with $${amount}.`);
      setTopUpAmount('');
    } else {
      alert('Please enter a valid amount to top up.');
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p className='text-red-500'>Error: {error}</p>;
  }

  return (
    <div>
      <div className='flex'>
        <NavigationPanel /> {/* Панель навигации */}
        <div className='p-8 w-full'>
          <h1 className='text-2xl font-bold mb-4'>Admin Page</h1>
        </div>
      </div>

      <div className='p-8 max-w-3xl mx-auto'>
        <h1 className='text-2xl font-bold mb-6'>User Dashboard</h1>

        <div className='mb-6'>
          <h2 className='text-xl font-bold mb-2'>Your Account</h2>
          <div className='border border-gray-300 rounded-lg p-4'>
            <p className='mb-2 text-lg'>
              Current Balance:{' '}
              <span className='font-bold'>${balance.toFixed(2)}</span>
            </p>
          </div>
        </div>

        <div className='mb-6'>
          <h2 className='text-xl font-bold mb-2'>Your Discounts</h2>
          <div className='border border-gray-300 rounded-lg p-4'>
            {discounts.length > 0 ? (
              <div className='space-y-2'>
                {discounts.map((discount) => (
                  <div
                    key={discount.call_type}
                    className='flex justify-between text-lg'
                  >
                    <span className='font-semibold capitalize'>
                      {discount.call_type}:
                    </span>
                    <span>{discount.discount}%</span>
                  </div>
                ))}
              </div>
            ) : (
              <p>No discounts available.</p>
            )}
          </div>
        </div>

        <div className='mb-6'>
          <h2 className='text-xl font-bold mb-2'>Change Your Plan</h2>
          <div className='flex items-center gap-4'>
            <input
              type='text'
              placeholder='Enter new plan'
              className='border border-gray-300 rounded-lg p-2 flex-1'
              value={newPlan}
              onChange={(e) => setNewPlan(e.target.value)}
            />
            <button
              className='bg-blue-500 text-white px-4 py-2 rounded-lg'
              onClick={handlePlanChange}
            >
              Change Plan
            </button>
          </div>
        </div>

        <div className='mb-6'>
          <h2 className='text-xl font-bold mb-2'>Top Up Your Balance</h2>
          <div className='flex items-center gap-4'>
            <input
              type='number'
              placeholder='Enter amount'
              className='border border-gray-300 rounded-lg p-2 flex-1'
              value={topUpAmount}
              onChange={(e) => setTopUpAmount(e.target.value)}
            />
            <button
              className='bg-green-500 text-white px-4 py-2 rounded-lg'
              onClick={handleTopUp}
            >
              Top Up
            </button>
          </div>
        </div>

        {/* Список счетов */}
        <BillList bills={bills} />
      </div>

      <div className='mb-6'>
        {/* История звонков */}
        <CallHistory />
      </div>
    </div>
  );
};

export default UserPage;
