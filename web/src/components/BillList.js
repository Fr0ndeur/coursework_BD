// BillList.js
import React from "react";

const BillList = ({ bills }) => {
    return (
        <div>
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
                    </div>
                ))}
            </div>
        </div>
    );
};

export default BillList;
