import React, { useState } from "react";
import NavigationPanel from "../components/Nav-panel.js";

const AccountantPage = () => {
    const [subscribers, setSubscribers] = useState([
        { id: 1, name: "John Doe", balance: 1200, lastPayment: "2024-12-01" },
        { id: 2, name: "Jane Smith", balance: 800, lastPayment: "2024-12-05" },
    ]);

    const [monthlyReport, setMonthlyReport] = useState(null);
    const [selectedSubscriber, setSelectedSubscriber] = useState(null);
    const [selectedMonth, setSelectedMonth] = useState("");
    const [individualReport, setIndividualReport] = useState(null);

    const generateMonthlyReport = () => {
        // Dummy data for monthly report
        const report = {
            totalSubscribers: subscribers.length,
            totalRevenue: subscribers.reduce(
                (sum, sub) => sum + sub.balance,
                0
            ),
            lastMonthRevenue: 4500, // Placeholder value
        };
        setMonthlyReport(report);
    };

    const generateIndividualReport = () => {
        if (selectedSubscriber && selectedMonth) {
            const subscriber = subscribers.find(
                (sub) => sub.id === parseInt(selectedSubscriber)
            );
            if (subscriber) {
                const report = {
                    name: subscriber.name,
                    month: selectedMonth,
                    balance: subscriber.balance, // Placeholder data
                    payments: [
                        { date: "2024-12-01", amount: 200 },
                        { date: "2024-12-15", amount: 300 },
                    ], // Placeholder data
                };
                setIndividualReport(report);
            } else {
                alert("Subscriber not found.");
            }
        } else {
            alert("Please select a subscriber and a month.");
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
            <div className="p-8 max-w-5xl mx-auto">
                <h1 className="text-2xl font-bold mb-6">
                    Accountant Dashboard
                </h1>

                <div className="mb-6">
                    <h2 className="text-xl font-bold mb-2">Subscribers</h2>
                    <table className="table-auto w-full border border-gray-300 rounded-lg mb-4">
                        <thead>
                            <tr className="bg-gray-100">
                                <th className="border px-4 py-2">Name</th>
                                <th className="border px-4 py-2">Balance</th>
                                <th className="border px-4 py-2">
                                    Last Payment
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {subscribers.map((sub) => (
                                <tr key={sub.id}>
                                    <td className="border px-4 py-2">
                                        {sub.name}
                                    </td>
                                    <td className="border px-4 py-2">
                                        ${sub.balance.toFixed(2)}
                                    </td>
                                    <td className="border px-4 py-2">
                                        {sub.lastPayment}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="mb-6">
                    <h2 className="text-xl font-bold mb-2">
                        Generate Monthly Report
                    </h2>
                    <button
                        className="bg-blue-500 text-white px-4 py-2 rounded-lg mb-4"
                        onClick={generateMonthlyReport}
                    >
                        Generate Report
                    </button>

                    {monthlyReport && (
                        <div className="border border-gray-300 rounded-lg p-4">
                            <h3 className="text-lg font-bold mb-2">
                                Monthly Report
                            </h3>
                            <p>
                                Total Subscribers:{" "}
                                <span className="font-bold">
                                    {monthlyReport.totalSubscribers}
                                </span>
                            </p>
                            <p>
                                Total Revenue:{" "}
                                <span className="font-bold">
                                    ${monthlyReport.totalRevenue.toFixed(2)}
                                </span>
                            </p>
                            <p>
                                Last Month Revenue:{" "}
                                <span className="font-bold">
                                    ${monthlyReport.lastMonthRevenue.toFixed(2)}
                                </span>
                            </p>
                        </div>
                    )}
                </div>

                <div className="mb-6">
                    <h2 className="text-xl font-bold mb-2">
                        Generate Individual Report
                    </h2>
                    <div className="flex items-center gap-4 mb-4">
                        <select
                            className="border border-gray-300 rounded-lg p-2 flex-1"
                            value={selectedSubscriber}
                            onChange={(e) =>
                                setSelectedSubscriber(e.target.value)
                            }
                        >
                            <option value="">Select Subscriber</option>
                            {subscribers.map((sub) => (
                                <option key={sub.id} value={sub.id}>
                                    {sub.name}
                                </option>
                            ))}
                        </select>
                        <input
                            type="month"
                            className="border border-gray-300 rounded-lg p-2 flex-1"
                            value={selectedMonth}
                            onChange={(e) => setSelectedMonth(e.target.value)}
                        />
                        <button
                            className="bg-blue-500 text-white px-4 py-2 rounded-lg"
                            onClick={generateIndividualReport}
                        >
                            Generate Report
                        </button>
                    </div>

                    {individualReport && (
                        <div className="border border-gray-300 rounded-lg p-4">
                            <h3 className="text-lg font-bold mb-2">
                                Individual Report
                            </h3>
                            <p>
                                Name:{" "}
                                <span className="font-bold">
                                    {individualReport.name}
                                </span>
                            </p>
                            <p>
                                Month:{" "}
                                <span className="font-bold">
                                    {individualReport.month}
                                </span>
                            </p>
                            <p>
                                Balance:{" "}
                                <span className="font-bold">
                                    ${individualReport.balance.toFixed(2)}
                                </span>
                            </p>
                            <h4 className="text-lg font-bold mt-4">Payments</h4>
                            <ul className="list-disc list-inside">
                                {individualReport.payments.map(
                                    (payment, index) => (
                                        <li key={index}>
                                            {payment.date}: $
                                            {payment.amount.toFixed(2)}
                                        </li>
                                    )
                                )}
                            </ul>
                        </div>
                    )}
                </div>

                <div className="mb-6">
                    <h2 className="text-xl font-bold mb-2">Statistics</h2>
                    <div className="border border-gray-300 rounded-lg p-4">
                        <p>
                            Total Revenue This Year:{" "}
                            <span className="font-bold">$54000</span>
                        </p>
                        <p>
                            Average Revenue Per Month:{" "}
                            <span className="font-bold">$4500</span>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AccountantPage;
