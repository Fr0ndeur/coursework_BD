import React, { useState, useEffect } from "react";
import NavigationPanel from "../components/Nav-panel.js";
import BillList from "../components/BillList"; // Імпортуємо новий компонент
import CallHistory from "../components/CallHistory";

const UserPage = () => {
    const [balance, setBalance] = useState(1200); // User's current balance
    const [discounts, setDiscounts] = useState([]); // New state for discounts
    const [newPlan, setNewPlan] = useState(""); // Selected new plan
    const [topUpAmount, setTopUpAmount] = useState(""); // Amount to top up

    const [bills, setBills] = useState([
        {
            bill_id: 1,
            discount_applied: "10.00",
            employee_id: 4,
            final_amount: "270.00",
            month_year: "2024-12",
            payment_status: "PAID",
            total_cost: "300.00",
            total_duration: 120,
        },
        {
            bill_id: 7,
            discount_applied: "14.34",
            employee_id: 4,
            final_amount: "69.00",
            month_year: "2024-11",
            payment_status: "UNPAID",
            total_cost: "83.50",
            total_duration: 104,
        },
    ]); // Example bills data

    // Use effect to simulate fetching JSON data (you can replace this with an actual API call)
    useEffect(() => {
        const fetchDiscounts = async () => {
            const discountsData = {
                discounts: [
                    { call_type: "local", discount: "8.00" },
                    { call_type: "intercity", discount: "12.00" },
                    { call_type: "international", discount: "20.00" },
                ],
                employee_id: 4,
            };
            setDiscounts(discountsData.discounts); // Set discounts data
        };

        fetchDiscounts();
    }, []);

    const handlePlanChange = () => {
        if (newPlan) {
            alert(`Your plan has been changed to: ${newPlan}`);
            setNewPlan("");
        } else {
            alert("Please select a new plan before submitting.");
        }
    };

    const handleTopUp = () => {
        const amount = parseFloat(topUpAmount);
        if (amount && amount > 0) {
            setBalance(balance + amount);
            alert(`Your account has been topped up with $${amount}.`);
            setTopUpAmount("");
        } else {
            alert("Please enter a valid amount to top up.");
        }
    };

    return (
        <div>
            <div className="flex">
                <NavigationPanel /> {/* Виклик компонента навігації */}
                <div className="p-8 w-full">
                    <h1 className="text-2xl font-bold mb-4">Admin Page</h1>
                    {/* Інший вміст сторінки адміна */}
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
                            <p>Loading discounts...</p>
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

                {/* Додаємо компонент для відображення рахунків */}
                <BillList bills={bills} />
            </div>

            <div className="mb-6">
                {/* Використання компонента CallHistory */}
                <CallHistory />
            </div>
        </div>
    );
};

export default UserPage;
