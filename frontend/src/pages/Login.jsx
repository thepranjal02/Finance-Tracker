import { useState } from "react";
// import axios from "axios";
import { useNavigate } from "react-router-dom";
import API from "../api"; 

function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [msg, setMsg] = useState({ text: "", type: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg({ text: "", type: "" });

    try {
      const res = await API.post(`${import.meta.env.VITE_API_URL}/api/users/login`, form);
      localStorage.setItem("token", res.data.token);
      setMsg({ text: "✅ Login successful!", type: "success" });
      setTimeout(() => navigate("/dashboard"), 1000);
    } catch (err) {
      setMsg({
        text: "❌ Error: " + (err.response?.data?.msg || "Invalid credentials"),
        type: "error"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 px-4 sm:px-6">
      <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-lg w-full max-w-sm sm:max-w-md md:max-w-lg">
        <h2 className="text-2xl sm:text-3xl font-bold text-center text-gray-800 mb-6">Login</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="email"
            type="email"
            placeholder="Email"
            onChange={handleChange}
            value={form.email}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-400 focus:outline-none text-sm sm:text-base"
            required
          />
          <input
            name="password"
            type="password"
            placeholder="Password"
            onChange={handleChange}
            value={form.password}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-400 focus:outline-none text-sm sm:text-base"
            required
          />
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 text-white font-semibold rounded-lg transition duration-300 ${loading ? "bg-gray-400 cursor-not-allowed text-sm sm:text-base"
                : "bg-indigo-500 hover:bg-indigo-600 text-sm sm:text-base"
              }`}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        {/* Message */}
        {msg.text && (
          <p
            className={`mt-4 text-center text-sm sm:text-base font-medium ${msg.type === "success" ? "text-green-600" : "text-red-600"
              }`}
          >
            {msg.text}
          </p>
        )}

        {/* Signup Redirect */}
        <p className="mt-6 text-center text-sm sm:text-base text-gray-600">
          Don’t have an account?{" "}
          <button
            onClick={() => navigate("/signup")}
            className="text-indigo-500 font-semibold hover:underline"
          >
            Signup
          </button>
        </p>
      </div>
    </div>
  );
}

export default Login;
