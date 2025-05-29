import { useContext, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import AuthContext from "../context/AuthContext";

export default function LandingPage() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [user]);

  return (
    <div className="min-h-screen bg-gradient-to-tr from-gray-100 via-white to-gray-200 dark:from-gray-800 dark:via-gray-900 dark:to-gray-800 flex items-center justify-center px-6">
      <div className="max-w-2xl text-center p-10 bg-white dark:bg-gray-900 bg-opacity-80 backdrop-blur-md rounded-lg shadow-xl transition-all duration-300">
        <h1 className="text-5xl font-extrabold text-gray-800 dark:text-gray-100 mb-4">
          Welcome to{" "}
          <span className="text-gray-900 dark:text-white">TourCraft</span>
        </h1>
        <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed mb-8">
          TourCraft makes it easy to create, preview and share interactive
          product tours with visuals, screen recordings and more. No code
          required. Built for collaboration and speed.
        </p>
        <div className="flex justify-center space-x-6">
          <Link
            to="/login"
            className="bg-blue-600 hover:bg-blue-700 hover:scale-105 transform transition-all duration-200 text-white font-medium px-6 py-3 rounded-lg shadow-md hover:shadow-lg focus:outline-none"
          >
            Login
          </Link>
          <Link
            to="/signup"
            className="bg-blue-100 dark:bg-blue-900 border border-blue-600 dark:border-blue-700 text-blue-800 dark:text-blue-200 font-medium px-6 py-3 rounded-lg shadow-md hover:shadow-lg hover:bg-blue-200 dark:hover:bg-blue-800 hover:scale-105 transform transition-all duration-200 focus:outline-none"
          >
            Sign Up
          </Link>
        </div>
      </div>
    </div>
  );
}
