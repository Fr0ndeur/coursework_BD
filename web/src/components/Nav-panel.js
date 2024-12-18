import React, { useState } from "react";
import { NavLink } from "react-router"; // Убедись, что используешь правильный пакет
import { FaChevronRight, FaChevronLeft } from "react-icons/fa";

const NavigationPanel = () => {
    const [isOpen, setIsOpen] = useState(true);

    const togglePanel = () => {
        setIsOpen((prevState) => !prevState);
    };

    const navLinks = [
        { to: "/admin", label: "Admin Page" },
        { to: "/accountant", label: "Accountant Page" },
        { to: "/user", label: "User Page" },
    ];

    return (
        <div
            className={`h-screen bg-gray-800 text-white fixed transition-all duration-300 ${
                isOpen ? "w-48" : "w-16"
            }`}
        >
            {/* Верхняя часть панели */}
            <div className="flex items-center justify-between p-4 relative">
                {isOpen && (
                    <h1 className="text-lg font-bold transition-opacity duration-300">
                        Navigation
                    </h1>
                )}
                <button
                    onClick={togglePanel}
                    className={`absolute top-4 right-4 text-white p-2 rounded-full hover:bg-gray-700 focus:outline-none ${
                        isOpen ? "ml-auto" : "mr-0"
                    }`}
                >
                    {isOpen ? <FaChevronLeft /> : <FaChevronRight />}
                </button>
            </div>

            {/* Навигационные ссылки */}
            <nav
                className={`flex flex-col gap-4 transition-opacity duration-300 ${
                    isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
                }`}
            >
                {navLinks.map(({ to, label }) => (
                    <NavLink
                        key={to}
                        to={to}
                        className={({ isActive }) =>
                            `block px-4 py-2 rounded-lg text-center ${
                                isActive ? "bg-blue-500" : "hover:bg-gray-700"
                            }`
                        }
                    >
                        {label}
                    </NavLink>
                ))}
            </nav>
        </div>
    );
};

export default NavigationPanel;
