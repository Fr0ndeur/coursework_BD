import React, { useState, useRef } from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa"; // Імпортуємо стрілочки

const CallHistory = ({ calls }) => {
    const [isExpanded, setIsExpanded] = useState(false); // За замовчуванням список згорнутий
    const historyRef = useRef(null); // Реф для компонента

    if (calls.length === 0) {
        return <p>No call history available.</p>;
    }

    const toggleHistory = () => {
        setIsExpanded(!isExpanded); // Перемикаємо стан згортання/розгортання

        // Якщо розгортаємо список, прокручуємо до компонента
        if (!isExpanded && historyRef.current) {
            setTimeout(() => {
                historyRef.current.scrollIntoView({
                    behavior: "smooth",
                    block: "start",
                });
            }, 300); // Чекаємо завершення анімації
        }
    };

    return (
        <div ref={historyRef}>
            <h2 className="text-xl font-bold mb-2">Your Call History</h2>

            {/* Кнопка для згортання/розгортання з іконками */}
            <button
                onClick={toggleHistory}
                className="flex items-center text-blue-500 hover:text-blue-700 focus:outline-none mb-4"
            >
                {isExpanded ? (
                    <FaChevronUp className="mr-2" />
                ) : (
                    <FaChevronDown className="mr-2" />
                )}
                {isExpanded ? "Collapse History" : "Expand History"}
            </button>

            {/* Умовне відображення списку дзвінків з анімацією */}
            <div
                className={`overflow-hidden transition-all duration-300 ease-in-out ${
                    isExpanded ? "max-h-screen" : "max-h-0"
                }`}
            >
                <div className="border border-gray-300 rounded-lg p-4">
                    <ul className="space-y-4">
                        {calls.map((call) => (
                            <li
                                key={call.call_id}
                                className="flex justify-between text-lg"
                            >
                                <span className="font-semibold">
                                    {call.date} - {call.duration} min
                                </span>
                                <span className="text-gray-500">
                                    {call.call_type}
                                </span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default CallHistory;
