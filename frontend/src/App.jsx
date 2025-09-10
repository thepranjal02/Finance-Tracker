import { Link } from "react-router-dom";
import React from "react";

function App() {
  return (
    <div className="flex flex-col justify-center items-center h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 text-white">
      <h1 className="text-5xl font-extrabold mb-4 drop-shadow-lg">Finance Tracker</h1>
      <p className="text-lg mb-8 opacity-90">Track your expenses and savings with ease 🚀</p>

      <nav className="flex gap-6">
        <Link
          to="/signup"
          className="px-6 py-3 bg-green-500 hover:bg-green-600 rounded-2xl shadow-md text-lg font-semibold transition transform hover:scale-105"
        >
          Signup
        </Link>
        <Link
          to="/login"
          className="px-6 py-3 bg-blue-500 hover:bg-blue-600 rounded-2xl shadow-md text-lg font-semibold transition transform hover:scale-105"
        >
          Login
        </Link>
        <Link
          to="/dashboard"
          className="px-6 py-3 bg-yellow-500 hover:bg-yellow-600 rounded-2xl shadow-md text-lg font-semibold transition transform hover:scale-105"
        >
          Dashboard
        </Link>
      </nav>
    </div>
  );
}

export default App;
