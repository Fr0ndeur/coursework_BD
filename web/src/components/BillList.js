import React from "react";

const BillList = ({ bills = [], onPayBill }) => {
    // Перевіряємо, чи є рахунки. Якщо ні, виводимо повідомлення.
    if (bills.length === 0) {
        return (
            <div className="text-center text-gray-500 mt-6">
                <p>No bills available.</p>
            </div>
        );
    }

    return (
        <div className="fixed top-0 right-0 h-screen w-80 bg-white shadow-lg border-l border-gray-200 p-6 overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">Your Bills</h2>
            <div className="space-y-4">
                {bills.map((bill) => (
                    <div
                        key={bill.bill_id}
                        className={`border p-4 rounded-lg ${
                            bill.payment_status === "PAID"
                                ? "bg-green-100"
                                : "bg-red-100"
                        }`}
                    >
                        <p>
                            <strong>Bill ID:</strong> {bill.bill_id}
                        </p>
                        <p>
                            <strong>Month/Year:</strong> {bill.month_year}
                        </p>
                        <p>
                            <strong>Total Cost:</strong> ${bill.total_cost}
                        </p>
                        <p>
                            <strong>Discount Applied:</strong> $
                            {bill.discount_applied}
                        </p>
                        <p>
                            <strong>Final Amount:</strong> ${bill.final_amount}
                        </p>
                        <p>
                            <strong>Duration:</strong> {bill.total_duration}{" "}
                            minutes
                        </p>
                        <p
                            className={`font-bold ${
                                bill.payment_status === "PAID"
                                    ? "text-green-500"
                                    : "text-red-500"
                            }`}
                        >
                            <strong>Status:</strong> {bill.payment_status}
                        </p>

                        {bill.payment_status !== "PAID" && (
                            <button
                                className="bg-blue-500 text-white px-4 py-2 rounded-lg"
                                onClick={() => onPayBill(bill.bill_id)} // Викликаємо onPayBill
                            >
                                Pay Bill
                            </button>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default BillList;
