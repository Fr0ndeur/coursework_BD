import React from "react";
import { BrowserRouter, Routes, Route } from "react-router";
import Login from "./pages/LoginPage.js";
import Accountant from "./pages/AccountantPage.js";
import Admin from "./pages/AdminPage.js";
import User from "./pages/UserPage.js";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/accountant" element={<Accountant />} />
                <Route path="/admin" element={<Admin />} />
                <Route path="/user" element={<User />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
