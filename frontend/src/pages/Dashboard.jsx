import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
} from "recharts";

function Dashboard() {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const [transactions, setTransactions] = useState([]);
  const [summary, setSummary] = useState({ income: 0, expense: 0, balance: 0 });
  const [budgetTips, setBudgetTips] = useState([]);
  const [msg, setMsg] = useState("");

  // Logout handler
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  // 🔥 Fetch AI-powered budget tips (send all transactions to backend)
  const fetchBudgetTips = async (allTransactions) => {
    try {
      const res = await axios.post("http://localhost:5000/api/tips", {
        transactions: allTransactions,
      });

      setBudgetTips([res.data.tips]); // tips is string, so wrap in array
    } catch (err) {
      console.error("❌ Error fetching AI tips:", err.response?.data || err.message);
      setBudgetTips(["⚠️ Could not fetch AI tips, please try again later."]);
    }
  };

  // Fetch transactions
  const fetchTransactions = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/transactions", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTransactions(res.data);

      // Calculate summary
      const income = res.data
        .filter((tx) => tx.type === "income")
        .reduce((sum, tx) => sum + tx.amount, 0);
      const expense = res.data
        .filter((tx) => tx.type === "expense")
        .reduce((sum, tx) => sum + tx.amount, 0);
      const balance = income - expense;
      setSummary({ income, expense, balance });

      // 🔥 Call AI tips API with all transactions
      await fetchBudgetTips(res.data);
    } catch (err) {
      console.error("❌ Error fetching transactions:", err.response?.data || err.message);
      setMsg("Failed to load transactions.");
    }
  };

  useEffect(() => {
    if (token) {
      fetchTransactions();
    } else {
      navigate("/login");
    }
  }, []);

  // Chart Data
  const pieData = [
    { name: "Income", value: summary.income },
    { name: "Expense", value: summary.expense },
  ];
  const COLORS = ["#4ade80", "#f87171"]; // green for income, red for expense

  // Prepare Bar Chart Data
  const expenseByCategory = Object.entries(
    transactions
      .filter((tx) => tx.type === "expense")
      .reduce((acc, tx) => {
        acc[tx.category] = (acc[tx.category] || 0) + tx.amount;
        return acc;
      }, {})
  ).map(([category, amount]) => ({ category, amount }));

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-6">
      {/* Navbar */}
      <div className="flex flex-col md:flex-row justify-between items-center bg-white p-4 rounded-xl shadow mb-6 space-y-2 md:space-y-0">
        <h1 className="text-2xl font-bold text-indigo-600">Finance Tracker</h1>
        <div className="flex flex-wrap gap-2">
          <Link
            to="/dashboard"
            className="px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition"
          >
            Dashboard
          </Link>
          <Link
            to="/transactions"
            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
          >
            Transactions
          </Link>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
          >
            Logout
          </button>
        </div>
      </div>

      {msg && <p className="text-red-200 text-center mb-4">{msg}</p>}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white p-6 rounded-xl shadow text-center">
          <h3 className="text-lg font-semibold text-gray-600">Income</h3>
          <p className="text-2xl font-bold text-green-600">₹{summary.income}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow text-center">
          <h3 className="text-lg font-semibold text-gray-600">Expense</h3>
          <p className="text-2xl font-bold text-red-600">₹{summary.expense}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow text-center">
          <h3 className="text-lg font-semibold text-gray-600">Balance</h3>
          <p className="text-2xl font-bold text-indigo-600">₹{summary.balance}</p>
        </div>
      </div>

      {/* Budget Tips */}
      <div className="bg-yellow-100 p-4 rounded-lg shadow mb-10">
        <h3 className="font-semibold text-lg mb-2">💡 Budget Tips</h3>
        {budgetTips.length ? (
          <ul className="list-disc pl-5 space-y-1 text-yellow-800">
            {budgetTips.map((tip, index) => (
              <li key={index}>{tip}</li>
            ))}
          </ul>
        ) : (
          <p className="text-yellow-800">
            You’re doing great! No overspending detected.
          </p>
        )}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Pie Chart */}
        <div className="bg-white p-6 rounded-xl shadow">
          <h3 className="text-lg font-semibold mb-4 text-center">Income vs Expense</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={100}
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Bar Chart */}
        <div className="bg-white p-6 rounded-xl shadow overflow-x-auto">
          <h3 className="text-lg font-semibold mb-4 text-center">Spending by Category</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={expenseByCategory}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="category" interval={0} angle={-30} textAnchor="end" height={60} />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="amount" fill="#f87171" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
