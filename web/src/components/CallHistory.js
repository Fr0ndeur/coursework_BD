import React from "react";

const CallHistory = ({ calls }) => {
    if (calls.length === 0) {
        return <p>No call history available.</p>;
    }

    return (
        <div>
            <h2 className="text-xl font-bold mb-2">Your Call History</h2>
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
    );
};

export default CallHistory;
