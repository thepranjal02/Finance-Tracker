import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

function Transactions() {
    const token = localStorage.getItem("token");
    const navigate = useNavigate();

    const [transactions, setTransactions] = useState([]);
    const [form, setForm] = useState({
        amount: "",
        type: "expense",
        category: "",
        date: "",
    });
    const [msg, setMsg] = useState("");

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/login");
    };

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]:
                e.target.name === "amount" ? Number(e.target.value) : e.target.value,
        });
    };

    const fetchTransactions = async () => {
        try {
            const res = await axios.get("http://localhost:5000/api/transactions", {
                headers: { Authorization: `Bearer ${token}` },
            });
            setTransactions(res.data);
            // eslint-disable-next-line no-unused-vars
        } catch (err) {
            setMsg("❌ Failed to fetch transactions");
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post("http://localhost:5000/api/transactions", form, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setMsg("✅ Transaction added!");
            setForm({ amount: "", type: "expense", category: "", date: "" });
            fetchTransactions();
            // eslint-disable-next-line no-unused-vars
        } catch (err) {
            setMsg("❌ Error adding transaction");
        }
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:5000/api/transactions/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setMsg("✅ Transaction deleted!");
            fetchTransactions();
            // eslint-disable-next-line no-unused-vars
        } catch (err) {
            setMsg("❌ Error deleting transaction");
        }
    };

    useEffect(() => {
        if (token) {
            fetchTransactions();
        } else {
            navigate("/login");
        }
    }, [fetchTransactions, navigate, token]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-400 via-blue-500 to-purple-500 p-6">
            {/* Navbar */}
            <div className="flex flex-col md:flex-row justify-between items-center bg-white p-4 rounded-xl shadow mb-6 space-y-2 md:space-y-0">
                <h1 className="text-2xl font-bold text-green-600">Transactions</h1>
                <div className="flex flex-wrap gap-2">
                    <Link
                        to="/dashboard"
                        className="px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition"
                    >
                        Dashboard
                    </Link>
                    <button
                        onClick={handleLogout}
                        className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                    >
                        Logout
                    </button>
                </div>
            </div>

            {/* Add Transaction Form */}
            <form
                onSubmit={handleSubmit}
                className="bg-white p-6 rounded-xl shadow mb-6 max-w-lg mx-auto"
            >
                <h2 className="text-xl font-bold text-gray-700 mb-4">Add Transaction</h2>
                <div className="grid grid-cols-2 gap-4">
                    <input
                        type="number"
                        name="amount"
                        value={form.amount}
                        onChange={handleChange}
                        placeholder="Amount"
                        className="w-full p-2 rounded border"
                        required
                    />
                    <select
                        name="type"
                        value={form.type}
                        onChange={handleChange}
                        className="w-full p-2 rounded border"
                    >
                        <option value="expense">Expense</option>
                        <option value="income">Income</option>
                    </select>
                    <input
                        type="text"
                        name="category"
                        value={form.category}
                        onChange={handleChange}
                        placeholder="Category"
                        className="w-full p-2 rounded border"
                        required
                    />
                    <input
                        type="date"
                        name="date"
                        value={form.date}
                        onChange={handleChange}
                        className="w-full p-2 rounded border"
                        required
                    />
                </div>
                <button
                    type="submit"
                    className="mt-4 w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition"
                >
                    Add Transaction
                </button>
            </form>

            {/* Message */}
            {msg && (
                <p className="text-center mb-4 text-sm font-medium text-gray-700">{msg}</p>
            )}

            {/* Transaction List */}
            <div className="bg-white p-6 rounded-xl shadow max-w-3xl mx-auto overflow-x-auto">
                <h3 className="text-xl font-semibold mb-4">Transactions</h3>
                <ul className="space-y-2 min-w-[600px]">
                    {transactions.length > 0 ? (
                        transactions.map((tx) => (
                            <li
                                key={tx._id}
                                className="grid grid-cols-4 gap-2 items-center bg-gray-50 p-3 rounded shadow"
                            >
                                <span className="font-medium">{tx.category}</span>
                                <span className="text-sm text-gray-500">{tx.type}</span>
                                <span className={tx.type === "income" ? "text-green-600" : "text-red-600"}>
                                    ₹{tx.amount}
                                </span>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-gray-500">
                                        {new Date(tx.date).toLocaleDateString()}
                                    </span>
                                    <button
                                        onClick={() => handleDelete(tx._id)}
                                        className="ml-2 bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </li>
                        ))
                    ) : (
                        <p className="text-gray-500">No transactions found.</p>
                    )}
                </ul>
            </div>
        </div>
    );
}

export default Transactions;
