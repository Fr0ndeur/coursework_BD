import React, { useState, useEffect } from "react";

const CallHistory = () => {
    const [isOpen, setIsOpen] = useState(false); // Стан для відображення чи приховування
    const [calls, setCalls] = useState([]); // Стан для збереження дзвінків
    const [loading, setLoading] = useState(true); // Стан завантаження

    // Імітація отримання даних дзвінків
    useEffect(() => {
        const fetchCalls = async () => {
            try {
                // Імітація отримання даних
                const callsData = {
                    calls: [
                        {
                            call_id: "2e874fd0-9cfa-4045-9611-c15e39c15acb",
                            call_type: "intercity",
                            cost_calculated: true,
                            date: "2024-11-27T13:02:54",
                            dialed_number: "+3805792120",
                            duration: 59,
                            employee_id: 4,
                        },
                        {
                            call_id: "4e23a055-d5f9-420e-aab5-ed96b9708fa2",
                            call_type: "local",
                            cost_calculated: false,
                            date: "2024-07-28T12:56:01",
                            dialed_number: "+380448174483",
                            duration: 17,
                            employee_id: 4,
                        },
                    ],
                };

                setCalls(callsData.calls); // Зберігаємо отримані дзвінки
                setLoading(false); // Завершуємо завантаження
            } catch (error) {
                console.error("Error fetching call data:", error);
                setLoading(false);
            }
        };

        fetchCalls();
    }, []);

    // Функція для відкриття або закриття секції
    const toggleOpen = () => {
        setIsOpen(!isOpen);
    };

    return (
        <div
            className={`fixed bottom-0 left-0 w-full bg-white shadow-md border-t border-gray-300 transition-transform duration-300 ${
                isOpen ? "translate-y-0" : "translate-y-full"
            }`}
        >
            <div className="flex items-center justify-between p-4 bg-gray-800 text-white">
                <h2 className="text-lg font-bold">Call History</h2>
                <button
                    onClick={toggleOpen}
                    className="text-white bg-gray-600 p-2 rounded-full hover:bg-gray-700"
                >
                    {isOpen ? "Hide ▲" : "Show ▼"}
                </button>
            </div>

            {isOpen && (
                <div className="p-4 max-h-80 overflow-y-auto">
                    {loading ? (
                        <p>Loading call history...</p>
                    ) : (
                        <table className="w-full text-sm">
                            <thead>
                                <tr>
                                    <th className="text-left p-2">Call Type</th>
                                    <th className="text-left p-2">Date</th>
                                    <th className="text-left p-2">
                                        Dialed Number
                                    </th>
                                    <th className="text-left p-2">
                                        Duration (s)
                                    </th>
                                    <th className="text-left p-2">
                                        Cost Calculated
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {calls.map((call) => (
                                    <tr key={call.call_id} className="border-t">
                                        <td className="p-2">
                                            {call.call_type}
                                        </td>
                                        <td className="p-2">
                                            {new Date(
                                                call.date
                                            ).toLocaleString()}
                                        </td>
                                        <td className="p-2">
                                            {call.dialed_number}
                                        </td>
                                        <td className="p-2">{call.duration}</td>
                                        <td className="p-2">
                                            {call.cost_calculated
                                                ? "Yes"
                                                : "No"}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            )}
        </div>
    );
};

export default CallHistory;
