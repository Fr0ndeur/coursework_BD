import React, { useState } from "react";
import "../css/tailwind.css"; // Підключення Tailwind CSS

function LoginPage() {
    // Стани для логіна та пароля
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [userType, setUserType] = useState(""); // Тип користувача (адмін, бухгалтер, звичайний користувач)

    // Функція для обробки відправки запиту
    const handleLogin = async () => {
        try {
            // Відправка запиту на сервер (замініть URL на реальний сервер)
            const response = await fetch("http://0.0.0.0:5000", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    username: username,
                    password: password,
                }),
            });

            const data = await response.json();

            // Перевірка відповіді і оновлення типу користувача
            if (data.success) {
                setUserType(data.userType); // Встановлення типу користувача (адмін, бухгалтер, звичайний користувач)
                // Можна додати редірект або іншу логіку, залежно від типу користувача
            } else {
                alert("Невірний логін або пароль");
            }
        } catch (error) {
            console.error("Error during login:", error);
        }
    };

    // Функція для оновлення значення логіна
    const handleUsernameChange = (e) => {
        setUsername(e.target.value);
    };

    // Функція для оновлення значення пароля
    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
    };

    return (
        <div className="flex h-screen">
            {/* Ліва частина */}
            <div className="w-1/2 bg-black text-white flex flex-col justify-between p-8">
                <div>
                    <h1 className="text-4xl font-bold">mts</h1>
                    <p className="text-md mt-2">mega tele sila</p>
                </div>

                <div>
                    <h2 className="text-lg font-semibold">
                        Корисна інформація
                    </h2>
                    <p className="mt-2 text-2xl font-bold">0 800 50 70 44</p>
                    <p className="text-sm mt-1">
                        З мобільного по Україні безкоштовно
                    </p>
                </div>
            </div>

            {/* Права частина */}
            <div className="w-1/2 bg-gray-100 flex items-center justify-center">
                <div className="w-full max-w-md p-6">
                    <h2 className="text-xl font-bold text-center mb-6">
                        Введіть ваші дані для входу
                    </h2>

                    {/* Поле Логін */}
                    <div className="mb-4">
                        <label
                            htmlFor="username"
                            className="block text-sm mb-1"
                        >
                            Логін
                        </label>
                        <input
                            type="text"
                            id="username"
                            className="w-full border border-blue-500 rounded p-2"
                            value={username}
                            onChange={handleUsernameChange}
                        />
                    </div>

                    {/* Поле Пароль */}
                    <div className="mb-4">
                        <label
                            htmlFor="password"
                            className="block text-sm mb-1"
                        >
                            Пароль
                        </label>
                        <input
                            type="password"
                            id="password"
                            className="w-full border border-blue-500 rounded p-2"
                            value={password}
                            onChange={handlePasswordChange}
                        />
                    </div>

                    {/* Кнопка Продовжити */}
                    <button
                        className="w-full bg-gray-300 text-gray-600 py-2 rounded mb-4"
                        onClick={handleLogin}
                        disabled={!username || !password} // Кнопка активна тільки коли є логін і пароль
                    >
                        Продовжити
                    </button>
                </div>
            </div>
        </div>
    );
}

export default LoginPage;
