import React, { useState, useRef } from "react";
import {
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ReferenceLine,
} from "recharts";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";

const BillGraf = ({ bills }) => {
    const [isExpanded, setIsExpanded] = useState(false); // Стан згортання/розгортання
    const grafRef = useRef(null); // Реф для компонента

    // Групуємо рахунки за місяцями і додаємо порожні місяці
    const groupBillsByMonth = (bills) => {
        const grouped = {};
        const today = new Date();

        // Додаємо порожні місяці на 2 вперед і 2 назад
        for (let i = -2; i <= 2; i++) {
            const date = new Date(today.getFullYear(), today.getMonth() + i, 1);
            const monthYear = `${date.getFullYear()}-${String(
                date.getMonth() + 1
            ).padStart(2, "0")}`;
            grouped[monthYear] = { paid: 0, unpaid: 0 };
        }

        // Заповнюємо дані рахунків
        bills.forEach((bill) => {
            const monthYear = bill.month_year; // Поле місяць-рік
            if (!grouped[monthYear]) {
                grouped[monthYear] = { paid: 0, unpaid: 0 };
            }
            if (bill.payment_status === "PAID") {
                grouped[monthYear].paid += bill.final_amount;
            } else {
                grouped[monthYear].unpaid += bill.final_amount;
            }
        });

        // Повертаємо дані як масив
        return Object.keys(grouped)
            .sort((a, b) => new Date(a) - new Date(b)) // Сортуємо за датою
            .map((monthYear) => ({
                monthYear,
                ...grouped[monthYear],
            }));
    };

    const billData = groupBillsByMonth(bills);

    const toggleGraf = () => {
        setIsExpanded(!isExpanded); // Перемикаємо стан згортання/розгортання

        // Якщо розгортаємо компонент, прокручуємо до нього
        if (!isExpanded && grafRef.current) {
            setTimeout(() => {
                grafRef.current.scrollIntoView({
                    behavior: "smooth",
                    block: "start",
                });
            }, 300); // Чекаємо завершення анімації
        }
    };

    return (
        <div className="mt-8 bg-white shadow rounded-lg" ref={grafRef}>
            <h2 className="text-xl font-bold mb-4">Monthly Bills Overview</h2>

            {/* Кнопка для згортання/розгортання */}
            <button
                onClick={toggleGraf}
                className="flex items-center text-blue-500 hover:text-blue-700 focus:outline-none mb-4"
            >
                {isExpanded ? (
                    <FaChevronUp className="mr-2" />
                ) : (
                    <FaChevronDown className="mr-2" />
                )}
                {isExpanded ? "Collapse Graph" : "Expand Graph"}
            </button>

            {/* Умовне відображення графіка */}
            <div
                className={`overflow-hidden transition-all duration-300 ease-in-out ${
                    isExpanded ? "max-h-screen" : "max-h-0"
                }`}
            >
                <div className="h-[500px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                            data={billData}
                            margin={{
                                top: 20,
                                right: 30,
                                left: 0,
                                bottom: 40,
                            }}
                        >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis
                                dataKey="monthYear"
                                tick={{ fontSize: 12 }}
                                interval={0}
                                angle={-45}
                                textAnchor="end"
                            />
                            <YAxis domain={[0, 500]} tick={{ fontSize: 12 }} />
                            <Tooltip />
                            <Legend
                                wrapperStyle={{
                                    paddingTop: 15,
                                }}
                            />
                            <ReferenceLine y={0} stroke="#000" />
                            <Bar
                                dataKey="paid"
                                fill="#4caf50"
                                name="Paid Bills"
                            />
                            <Bar
                                dataKey="unpaid"
                                fill="#f44336"
                                name="Unpaid Bills"
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export default BillGraf;
