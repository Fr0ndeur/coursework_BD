import React, { useState, useEffect } from "react";
import { NavLink } from "react-router";
import { FaChevronRight, FaChevronLeft } from "react-icons/fa";

const NavigationPanel = ({ onToggle }) => {
    const [isOpen, setIsOpen] = useState(true); // Состояние панели
    const [role, setRole] = useState(""); // Роль пользователя
    const [loading, setLoading] = useState(true); // Состояние загрузки
    const [error, setError] = useState(""); // Состояние ошибки

    const togglePanel = () => {
        setIsOpen((prevState) => {
            const newState = !prevState;
            if (onToggle) onToggle(newState); // Передаем состояние панели в родительский компонент
            return newState;
        });
    };

    // Получение роли пользователя при загрузке
    useEffect(() => {
        const fetchRole = async () => {
            try {
                const response = await fetch("http://localhost:5000/users/me", {
                    method: "GET",
                    credentials: "include", // Использование HTTP-only cookies
                });

                if (!response.ok) {
                    throw new Error("Failed to fetch user role.");
                }

                const userData = await response.json();
                setRole(userData.role); // Устанавливаем роль пользователя
                setLoading(false); // Снимаем статус загрузки
            } catch (err) {
                console.error("Error fetching role:", err);
                setError(err.message);
                setLoading(false);
            }
        };

        fetchRole();
    }, []);

    // Навигационные ссылки
    const navLinks = [
        { to: "/admin", label: "Admin Page", roles: ["admin"] },
        {
            to: "/accountant",
            label: "Accountant Page",
            roles: ["admin", "accountant"],
        },
        {
            to: "/user",
            label: "User Page",
            roles: ["admin", "accountant", "user"],
        },
    ];

    if (loading) {
        return <div className="text-white p-4">Loading...</div>;
    }

    if (error) {
        return <div className="text-red-500 p-4">Error: {error}</div>;
    }

    return (
        <div
            className={`h-screen bg-gray-800 text-gray-400 fixed transition-all duration-300 flex flex-col items-center ${
                isOpen ? "w-48" : "w-16"
            }`}
        >
            {/* Верхняя часть панели */}
            <div className="flex items-center justify-center w-full mt-3">
                <button
                    onClick={togglePanel}
                    className="text-white p-2 rounded-full hover:bg-gray-700 focus:outline-none"
                >
                    {isOpen ? <FaChevronLeft /> : <FaChevronRight />}
                </button>
            </div>

            {/* Навигационные ссылки */}
            <div className="flex flex-col items-center mt-3 w-full">
                {navLinks
                    .filter((link) => link.roles.includes(role)) // Фильтруем ссылки по роли
                    .map(({ to, label }) => (
                        <NavLink
                            key={to}
                            to={to}
                            className={({ isActive }) =>
                                `flex items-center justify-center w-full h-12 px-3 mt-2 rounded ${
                                    isActive
                                        ? "bg-blue-500 text-white"
                                        : "hover:bg-gray-700 hover:text-gray-300"
                                }`
                            }
                        >
                            {isOpen && (
                                <span className="ml-2 text-sm font-medium">
                                    {label}
                                </span>
                            )}
                        </NavLink>
                    ))}
            </div>

            {/* Нижняя часть панели */}
            <div className="mt-auto mb-3">
                <NavLink
                    to="/profile"
                    className="flex items-center justify-center w-12 h-12 rounded-full hover:bg-gray-700 hover:text-gray-300"
                >
                    <svg
                        className="w-6 h-6"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                    </svg>
                </NavLink>
            </div>
        </div>
    );
};

export default NavigationPanel;
