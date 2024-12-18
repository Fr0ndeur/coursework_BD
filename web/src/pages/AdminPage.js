// AdminPage.jsx
import React, { useState } from "react";
import NavigationPanel from "../components/Nav-panel.js"; // Шлях до вашого NavigationPanel

const AdminPage = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [employees, setEmployees] = useState([
        {
            id: 1,
            name: "John Doe",
            position: "Manager",
            email: "john@example.com",
        },
        {
            id: 2,
            name: "Jane Smith",
            position: "Developer",
            email: "jane@example.com",
        },
    ]);

    const [departments, setDepartments] = useState([
        { id: 1, name: "Human Resources", manager: "Alice Johnson" },
        { id: 2, name: "Engineering", manager: "Bob Brown" },
    ]);

    const [rates, setRates] = useState([
        { id: 1, name: "Hourly Rate", value: "$20/hour" },
        { id: 2, name: "Overtime Rate", value: "$30/hour" },
    ]);

    const [editingEmployee, setEditingEmployee] = useState(null);
    const [newEmployee, setNewEmployee] = useState({
        name: "",
        position: "",
        email: "",
    });

    const [editingDepartment, setEditingDepartment] = useState(null);
    const [newDepartment, setNewDepartment] = useState({
        name: "",
        manager: "",
    });

    const [editingRate, setEditingRate] = useState(null);
    const [newRate, setNewRate] = useState({ name: "", value: "" });

    const handleSearch = (e) => setSearchTerm(e.target.value);

    const handleAddEmployee = () => {
        setEmployees([...employees, { id: Date.now(), ...newEmployee }]);
        setNewEmployee({ name: "", position: "", email: "" });
    };

    const handleEditEmployee = (id) => {
        const employee = employees.find((emp) => emp.id === id);
        setEditingEmployee(employee);
    };

    const handleUpdateEmployee = () => {
        setEmployees(
            employees.map((emp) =>
                emp.id === editingEmployee.id ? editingEmployee : emp
            )
        );
        setEditingEmployee(null);
    };

    const handleDeleteEmployee = (id) => {
        setEmployees(employees.filter((emp) => emp.id !== id));
    };

    const handleAddDepartment = () => {
        setDepartments([...departments, { id: Date.now(), ...newDepartment }]);
        setNewDepartment({ name: "", manager: "" });
    };

    const handleEditDepartment = (id) => {
        const department = departments.find((dep) => dep.id === id);
        setEditingDepartment(department);
    };

    const handleUpdateDepartment = () => {
        setDepartments(
            departments.map((dep) =>
                dep.id === editingDepartment.id ? editingDepartment : dep
            )
        );
        setEditingDepartment(null);
    };

    const handleDeleteDepartment = (id) => {
        setDepartments(departments.filter((dep) => dep.id !== id));
    };

    const handleAddRate = () => {
        setRates([...rates, { id: Date.now(), ...newRate }]);
        setNewRate({ name: "", value: "" });
    };

    const handleEditRate = (id) => {
        const rate = rates.find((r) => r.id === id);
        setEditingRate(rate);
    };

    const handleUpdateRate = () => {
        setRates(rates.map((r) => (r.id === editingRate.id ? editingRate : r)));
        setEditingRate(null);
    };

    const handleDeleteRate = (id) => {
        setRates(rates.filter((r) => r.id !== id));
    };

    const filteredEmployees = employees.filter(
        (emp) =>
            emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            emp.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
            emp.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const filteredDepartments = departments.filter(
        (dep) =>
            dep.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            dep.manager.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const filteredRates = rates.filter(
        (rate) =>
            rate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            rate.value.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div>
            <div className="flex">
                <NavigationPanel /> {/* Виклик компонента навігації */}
                <div className="p-8 w-full">
                    <h1 className="text-2xl font-bold mb-4">Admin Page</h1>

                    {/* Інший вміст сторінки адміна */}
                </div>
            </div>

            <div className="p-8">
                <h1 className="text-2xl font-bold mb-4">Admin Page</h1>

                <div className="mb-4">
                    <input
                        type="text"
                        placeholder="Search..."
                        className="border border-gray-300 rounded-lg p-2 w-full"
                        value={searchTerm}
                        onChange={handleSearch}
                    />
                </div>

                <div className="mb-8">
                    <h2 className="text-xl font-bold mb-2">Employees</h2>
                    <table className="table-auto w-full border border-gray-300 rounded-lg mb-4">
                        <thead>
                            <tr className="bg-gray-100">
                                <th className="border px-4 py-2">Name</th>
                                <th className="border px-4 py-2">Position</th>
                                <th className="border px-4 py-2">Email</th>
                                <th className="border px-4 py-2">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredEmployees.map((emp) => (
                                <tr key={emp.id}>
                                    <td className="border px-4 py-2">
                                        {emp.name}
                                    </td>
                                    <td className="border px-4 py-2">
                                        {emp.position}
                                    </td>
                                    <td className="border px-4 py-2">
                                        {emp.email}
                                    </td>
                                    <td className="border px-4 py-2">
                                        <button
                                            className="text-blue-500 mr-2"
                                            onClick={() =>
                                                handleEditEmployee(emp.id)
                                            }
                                        >
                                            Edit
                                        </button>
                                        <button
                                            className="text-red-500"
                                            onClick={() =>
                                                handleDeleteEmployee(emp.id)
                                            }
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <div>
                        {editingEmployee ? (
                            <div>
                                <h2 className="text-lg font-bold mb-2">
                                    Edit Employee
                                </h2>
                                <div className="flex flex-col gap-2">
                                    <input
                                        type="text"
                                        placeholder="Name"
                                        className="border border-gray-300 rounded-lg p-2"
                                        value={editingEmployee.name}
                                        onChange={(e) =>
                                            setEditingEmployee({
                                                ...editingEmployee,
                                                name: e.target.value,
                                            })
                                        }
                                    />
                                    <input
                                        type="text"
                                        placeholder="Position"
                                        className="border border-gray-300 rounded-lg p-2"
                                        value={editingEmployee.position}
                                        onChange={(e) =>
                                            setEditingEmployee({
                                                ...editingEmployee,
                                                position: e.target.value,
                                            })
                                        }
                                    />
                                    <input
                                        type="email"
                                        placeholder="Email"
                                        className="border border-gray-300 rounded-lg p-2"
                                        value={editingEmployee.email}
                                        onChange={(e) =>
                                            setEditingEmployee({
                                                ...editingEmployee,
                                                email: e.target.value,
                                            })
                                        }
                                    />
                                    <button
                                        className="bg-blue-500 text-white px-4 py-2 rounded-lg"
                                        onClick={handleUpdateEmployee}
                                    >
                                        Update Employee
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div>
                                <h2 className="text-lg font-bold mb-2">
                                    Add New Employee
                                </h2>
                                <div className="flex flex-col gap-2">
                                    <input
                                        type="text"
                                        placeholder="Name"
                                        className="border border-gray-300 rounded-lg p-2"
                                        value={newEmployee.name}
                                        onChange={(e) =>
                                            setNewEmployee({
                                                ...newEmployee,
                                                name: e.target.value,
                                            })
                                        }
                                    />
                                    <input
                                        type="text"
                                        placeholder="Position"
                                        className="border border-gray-300 rounded-lg p-2"
                                        value={newEmployee.position}
                                        onChange={(e) =>
                                            setNewEmployee({
                                                ...newEmployee,
                                                position: e.target.value,
                                            })
                                        }
                                    />
                                    <input
                                        type="email"
                                        placeholder="Email"
                                        className="border border-gray-300 rounded-lg p-2"
                                        value={newEmployee.email}
                                        onChange={(e) =>
                                            setNewEmployee({
                                                ...newEmployee,
                                                email: e.target.value,
                                            })
                                        }
                                    />
                                    <button
                                        className="bg-green-500 text-white px-4 py-2 rounded-lg"
                                        onClick={handleAddEmployee}
                                    >
                                        Add Employee
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <div className="mb-8">
                    <h2 className="text-xl font-bold mb-2">Departments</h2>
                    <table className="table-auto w-full border border-gray-300 rounded-lg mb-4">
                        <thead>
                            <tr className="bg-gray-100">
                                <th className="border px-4 py-2">Name</th>
                                <th className="border px-4 py-2">Manager</th>
                                <th className="border px-4 py-2">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredDepartments.map((dep) => (
                                <tr key={dep.id}>
                                    <td className="border px-4 py-2">
                                        {dep.name}
                                    </td>
                                    <td className="border px-4 py-2">
                                        {dep.manager}
                                    </td>
                                    <td className="border px-4 py-2">
                                        <button
                                            className="text-blue-500 mr-2"
                                            onClick={() =>
                                                handleEditDepartment(dep.id)
                                            }
                                        >
                                            Edit
                                        </button>
                                        <button
                                            className="text-red-500"
                                            onClick={() =>
                                                handleDeleteDepartment(dep.id)
                                            }
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <div>
                        {editingDepartment ? (
                            <div>
                                <h2 className="text-lg font-bold mb-2">
                                    Edit Department
                                </h2>
                                <div className="flex flex-col gap-2">
                                    <input
                                        type="text"
                                        placeholder="Name"
                                        className="border border-gray-300 rounded-lg p-2"
                                        value={editingDepartment.name}
                                        onChange={(e) =>
                                            setEditingDepartment({
                                                ...editingDepartment,
                                                name: e.target.value,
                                            })
                                        }
                                    />
                                    <input
                                        type="text"
                                        placeholder="Manager"
                                        className="border border-gray-300 rounded-lg p-2"
                                        value={editingDepartment.manager}
                                        onChange={(e) =>
                                            setEditingDepartment({
                                                ...editingDepartment,
                                                manager: e.target.value,
                                            })
                                        }
                                    />
                                    <button
                                        className="bg-blue-500 text-white px-4 py-2 rounded-lg"
                                        onClick={handleUpdateDepartment}
                                    >
                                        Update Department
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div>
                                <h2 className="text-lg font-bold mb-2">
                                    Add New Department
                                </h2>
                                <div className="flex flex-col gap-2">
                                    <input
                                        type="text"
                                        placeholder="Name"
                                        className="border border-gray-300 rounded-lg p-2"
                                        value={newDepartment.name}
                                        onChange={(e) =>
                                            setNewDepartment({
                                                ...newDepartment,
                                                name: e.target.value,
                                            })
                                        }
                                    />
                                    <input
                                        type="text"
                                        placeholder="Manager"
                                        className="border border-gray-300 rounded-lg p-2"
                                        value={newDepartment.manager}
                                        onChange={(e) =>
                                            setNewDepartment({
                                                ...newDepartment,
                                                manager: e.target.value,
                                            })
                                        }
                                    />
                                    <button
                                        className="bg-green-500 text-white px-4 py-2 rounded-lg"
                                        onClick={handleAddDepartment}
                                    >
                                        Add Department
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <div className="mb-8">
                    <h2 className="text-xl font-bold mb-2">Rates</h2>
                    <table className="table-auto w-full border border-gray-300 rounded-lg mb-4">
                        <thead>
                            <tr className="bg-gray-100">
                                <th className="border px-4 py-2">Name</th>
                                <th className="border px-4 py-2">Value</th>
                                <th className="border px-4 py-2">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredRates.map((rate) => (
                                <tr key={rate.id}>
                                    <td className="border px-4 py-2">
                                        {rate.name}
                                    </td>
                                    <td className="border px-4 py-2">
                                        {rate.value}
                                    </td>
                                    <td className="border px-4 py-2">
                                        <button
                                            className="text-blue-500 mr-2"
                                            onClick={() =>
                                                handleEditRate(rate.id)
                                            }
                                        >
                                            Edit
                                        </button>
                                        <button
                                            className="text-red-500"
                                            onClick={() =>
                                                handleDeleteRate(rate.id)
                                            }
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <div>
                        {editingRate ? (
                            <div>
                                <h2 className="text-lg font-bold mb-2">
                                    Edit Rate
                                </h2>
                                <div className="flex flex-col gap-2">
                                    <input
                                        type="text"
                                        placeholder="Name"
                                        className="border border-gray-300 rounded-lg p-2"
                                        value={editingRate.name}
                                        onChange={(e) =>
                                            setEditingRate({
                                                ...editingRate,
                                                name: e.target.value,
                                            })
                                        }
                                    />
                                    <input
                                        type="text"
                                        placeholder="Value"
                                        className="border border-gray-300 rounded-lg p-2"
                                        value={editingRate.value}
                                        onChange={(e) =>
                                            setEditingRate({
                                                ...editingRate,
                                                value: e.target.value,
                                            })
                                        }
                                    />
                                    <button
                                        className="bg-blue-500 text-white px-4 py-2 rounded-lg"
                                        onClick={handleUpdateRate}
                                    >
                                        Update Rate
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div>
                                <h2 className="text-lg font-bold mb-2">
                                    Add New Rate
                                </h2>
                                <div className="flex flex-col gap-2">
                                    <input
                                        type="text"
                                        placeholder="Name"
                                        className="border border-gray-300 rounded-lg p-2"
                                        value={newRate.name}
                                        onChange={(e) =>
                                            setNewRate({
                                                ...newRate,
                                                name: e.target.value,
                                            })
                                        }
                                    />
                                    <input
                                        type="text"
                                        placeholder="Value"
                                        className="border border-gray-300 rounded-lg p-2"
                                        value={newRate.value}
                                        onChange={(e) =>
                                            setNewRate({
                                                ...newRate,
                                                value: e.target.value,
                                            })
                                        }
                                    />
                                    <button
                                        className="bg-green-500 text-white px-4 py-2 rounded-lg"
                                        onClick={handleAddRate}
                                    >
                                        Add Rate
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminPage;
