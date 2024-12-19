import React, { useState, useEffect } from "react";
import NavigationPanel from "../components/Nav-panel.js";
import BillList from "../components/BillList";
import CallHistory from "../components/CallHistory";
import BillGraf from "../components/BillGraf.js";

const UserPage = () => {
    const [discounts, setDiscounts] = useState([]); // Discounts data
    const [newPlan, setNewPlan] = useState(""); // Selected new plan
    const [topUpAmount, setTopUpAmount] = useState(""); // Amount to top up
    const [bills, setBills] = useState([]); // User bills
    const [calls, setCalls] = useState([]); // User calls
    const [loading, setLoading] = useState(true); // Loading state
    const [error, setError] = useState(""); // Error state

    const totalDebt = bills
        .filter((bill) => bill.payment_status !== "PAID") // Фільтруємо тільки неоплачені рахунки
        .reduce((total, bill) => total + bill.final_amount, 0); // Сума неоплачених рахунків

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
            </div>

            <div className="p-8 max-w-3xl mx-auto">
                <h1 className="text-2xl font-bold mb-6">User Dashboard</h1>

                <div className="mb-6">
                    <h2 className="text-xl font-bold mb-2">Your Account</h2>
                    <div className="border border-gray-300 rounded-lg p-4">
                        <p className="mb-2 text-lg">
                            Current Dept:{" "}
                            <span className="font-bold">
                                ${totalDebt.toFixed(2)}
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

                {/* Список счетов */}
                <BillList bills={bills} onPayBill={handlePayBill} />

                {/* История звонков */}
                <CallHistory calls={calls} />

                {/* Графік */}
                <BillGraf bills={bills} />
            </div>
        </div>
    );
};

export default UserPage;
