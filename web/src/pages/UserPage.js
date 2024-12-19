import React, { useState, useEffect } from "react";
import NavigationPanel from "../components/Nav-panel.js";
import BillList from "../components/BillList";
import CallHistory from "../components/CallHistory";

const UserPage = () => {
    const [balance, setBalance] = useState(1200); // User's current balance
    const [discounts, setDiscounts] = useState([]); // Discounts data
    const [newPlan, setNewPlan] = useState(""); // Selected new plan
    const [topUpAmount, setTopUpAmount] = useState(""); // Amount to top up
    const [bills, setBills] = useState([]); // User bills
    const [calls, setCalls] = useState([]); // User calls
    const [loading, setLoading] = useState(true); // Loading state
    const [error, setError] = useState(""); // Error state

    const handlePlanChange = () => {
        if (newPlan) {
            alert(`Your plan has been changed to: ${newPlan}`);
            setNewPlan(""); // Очищаємо поле вводу після зміни плану
        } else {
            alert("Please select a new plan before submitting.");
        }
    };
    const handleTopUp = () => {
        const amount = parseFloat(topUpAmount);
        if (amount && amount > 0) {
            setBalance(balance + amount); // Оновлюємо баланс користувача
            alert(`Your account has been topped up with $${amount}.`);
            setTopUpAmount(""); // Очищаємо поле для введення суми
        } else {
            alert("Please enter a valid amount to top up.");
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const userResponse = await fetch(
                    "http://localhost:5000/users/me",
                    {
                        method: "GET",
                        credentials: "include", // Включаємо cookies
                    }
                );

                if (!userResponse.ok) {
                    throw new Error("Не вдалося отримати дані користувача.");
                }

                const userData = await userResponse.json();
                const employeeId = userData.employee_id;

                // Запит для отримання рахунків
                const billsResponse = await fetch(
                    `http://localhost:5000/billing/employee/${employeeId}`,
                    {
                        method: "GET",
                        credentials: "include", // Включаємо cookies
                    }
                );

                if (!billsResponse.ok) {
                    throw new Error("Не вдалося отримати дані по рахунках.");
                }

                const billsData = await billsResponse.json();
                if (Array.isArray(billsData)) {
                    setBills(billsData); // Якщо це масив, оновлюємо стан
                } else if (billsData.bills && Array.isArray(billsData.bills)) {
                    setBills(billsData.bills); // Якщо дані містять поле "bills"
                } else {
                    throw new Error("Невірний формат даних по рахунках.");
                }

                // Запит на отримання історії дзвінків
                const callsResponse = await fetch(
                    `http://localhost:5000/calls/employee/${employeeId}`,
                    {
                        method: "GET",
                        credentials: "include", // Включаємо cookies
                    }
                );

                if (!callsResponse.ok) {
                    throw new Error("Не вдалося отримати історію дзвінків.");
                }

                const callsData = await callsResponse.json();
                if (Array.isArray(callsData)) {
                    setCalls(callsData); // Якщо це масив, оновлюємо стан
                } else if (callsData.calls && Array.isArray(callsData.calls)) {
                    setCalls(callsData.calls); // Якщо дані містять поле "calls"
                } else {
                    throw new Error("Невірний формат даних по дзвінках.");
                }

                setLoading(false); // Вимикаємо стан завантаження
            } catch (err) {
                console.error("Помилка при отриманні даних:", err);
                setError(err.message); // Зберігаємо повідомлення про помилку в стан
                setLoading(false); // Вимикаємо стан завантаження
            }
        };

        fetchData();
    }, []); // Виконується лише один раз при монтуванні компонента

    const handlePayBill = async (billId) => {
        try {
            const response = await fetch(
                `http://localhost:5000/billing/pay/${billId}`,
                {
                    method: "POST",
                    credentials: "include", // Для включення cookies, якщо потрібно
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );

            if (!response.ok) {
                throw new Error("Failed to pay the bill.");
            }

            const updatedBill = await response.json();

            // Оновити список рахунків після оплати (припускаємо, що оновлені рахунки приходять в відповіді)
            setBills((prevBills) =>
                prevBills.map((bill) =>
                    bill.bill_id === billId
                        ? { ...bill, payment_status: "PAID" }
                        : bill
                )
            );
        } catch (error) {
            console.error("Payment error:", error);
            alert("Failed to process payment.");
        }
    };

    if (loading) {
        return <p>Loading...</p>;
    }

    if (error) {
        return <p className="text-red-500">Error: {error}</p>;
    }

    return (
        <div>
            <div className="flex">
                <NavigationPanel />
                <div className="p-8 w-full">
                    <h1 className="text-2xl font-bold mb-4">Admin Page</h1>
                </div>
            </div>

            <div className="p-8 max-w-3xl mx-auto">
                <h1 className="text-2xl font-bold mb-6">User Dashboard</h1>

                <div className="mb-6">
                    <h2 className="text-xl font-bold mb-2">Your Account</h2>
                    <div className="border border-gray-300 rounded-lg p-4">
                        <p className="mb-2 text-lg">
                            Current Balance:{" "}
                            <span className="font-bold">
                                ${balance.toFixed(2)}
                            </span>
                        </p>
                    </div>
                </div>

                <div className="mb-6">
                    <h2 className="text-xl font-bold mb-2">Your Discounts</h2>
                    <div className="border border-gray-300 rounded-lg p-4">
                        {discounts.length > 0 ? (
                            <div className="space-y-2">
                                {discounts.map((discount) => (
                                    <div
                                        key={discount.call_type}
                                        className="flex justify-between text-lg"
                                    >
                                        <span className="font-semibold capitalize">
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

                <div className="mb-6">
                    <h2 className="text-xl font-bold mb-2">Change Your Plan</h2>
                    <div className="flex items-center gap-4">
                        <input
                            type="text"
                            placeholder="Enter new plan"
                            className="border border-gray-300 rounded-lg p-2 flex-1"
                            value={newPlan}
                            onChange={(e) => setNewPlan(e.target.value)}
                        />
                        <button
                            className="bg-blue-500 text-white px-4 py-2 rounded-lg"
                            onClick={handlePlanChange}
                        >
                            Change Plan
                        </button>
                    </div>
                </div>

                <div className="mb-6">
                    <h2 className="text-xl font-bold mb-2">
                        Top Up Your Balance
                    </h2>
                    <div className="flex items-center gap-4">
                        <input
                            type="number"
                            placeholder="Enter amount"
                            className="border border-gray-300 rounded-lg p-2 flex-1"
                            value={topUpAmount}
                            onChange={(e) => setTopUpAmount(e.target.value)}
                        />
                        <button
                            className="bg-green-500 text-white px-4 py-2 rounded-lg"
                            onClick={handleTopUp}
                        >
                            Top Up
                        </button>
                    </div>
                </div>

                {/* Список счетов */}
                <BillList bills={bills} onPayBill={handlePayBill} />

                {/* История звонков */}
                <CallHistory calls={calls} />
            </div>
        </div>
    );
};

export default UserPage;
