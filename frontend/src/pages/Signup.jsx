import { useState, useContext, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import AuthContext from "../context/AuthContext";

export default function Signup() {
  const { user, setUser } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [user]);

  const submitHandler = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("http://localhost:5000/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();
      if (!res.ok)
        throw new Error(
          data.message || "Something went wrong. Please try again."
        );

      setUser({ token: data.token, user: data.user });
      navigate("/dashboard");
    } catch (err) {
      setError(
        err.message.includes("email")
          ? "This email is already in use."
          : err.message.includes("password")
          ? "Password must be at least 6 characters."
          : "Signup failed. Please check your inputs and try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 via-white to-gray-200 dark:from-gray-800 dark:via-gray-900 dark:to-gray-800 px-4">
      <div className="w-full max-w-md p-8 bg-white dark:bg-gray-900 shadow-lg rounded-lg">
        <h1 className="text-3xl font-bold text-center text-gray-800 dark:text-gray-100 mb-6">
          Create an Account
        </h1>

        {error && (
          <div className="bg-red-100 border border-red-300 text-red-700 p-3 rounded mb-4 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={submitHandler} className="space-y-5">
          <input
            type="text"
            placeholder="Full Name"
            className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-gray-100 dark:border-gray-700"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <input
            type="email"
            placeholder="Email"
            className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-gray-100 dark:border-gray-700"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-gray-100 dark:border-gray-700"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-blue-600 cursor-pointer  hover:bg-blue-700 transform hover:scale-105 transition-all duration-200 text-white py-3 rounded shadow-md hover:shadow-lg font-medium focus:outline-none focus:ring-4 focus:ring-blue-400 disabled:opacity-60 disabled:cursor-not-allowed`}
          >
            {loading ? "Signing up..." : "Sign Up"}
          </button>
        </form>

        <p className="text-center text-sm mt-6 text-gray-600 dark:text-gray-300">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-blue-600 hover:underline dark:text-blue-400 font-medium"
          >
            Log in here
          </Link>
        </p>
      </div>
    </div>
  );
}
