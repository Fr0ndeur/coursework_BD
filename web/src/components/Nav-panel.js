import React, { useState, useEffect } from "react";
import { NavLink } from "react-router";
import {
    FaChevronRight,
    FaChevronLeft,
    FaUser,
    FaUserTie,
    FaHome,
} from "react-icons/fa";

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
        {
            to: "/admin",
            label: "Admin Page",
            icon: <FaUserTie />,
            roles: ["admin"],
        },
        {
            to: "/accountant",
            label: "Accountant Page",
            icon: <FaHome />,
            roles: ["admin", "accountant"],
        },
        {
            to: "/user",
            label: "User Page",
            icon: <FaUser />,
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
                    .map(({ to, label, icon }) => (
                        <NavLink
                            key={to}
                            to={to}
                            className={({ isActive }) =>
                                `flex items-center w-full h-12 px-3 mt-2 rounded ${
                                    isActive
                                        ? "bg-blue-500 text-white"
                                        : "hover:bg-gray-700 hover:text-gray-300"
                                }`
                            }
                        >
                            {icon}
                            {isOpen && (
                                <span className="ml-2 text-sm font-medium">
                                    {label}
                                </span>
                            )}
                        </NavLink>
                    ))}
            </div>
        </div>
    );
};

export default NavigationPanel;
