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
    <div className="min-h-screen bg-gradient-to-tr from-sky-100 via-white to-sky-200 flex items-center justify-center px-6">
      <div className="max-w-2xl text-center p-10 bg-white bg-opacity-80 backdrop-blur-md rounded-lg shadow-xl">
        <h1 className="text-5xl font-extrabold text-sky-700 mb-4">
          Welcome to <span className="text-sky-900">TourCraft </span>{" "}
        </h1>
        <p className="text-gray-600 text-lg leading-relaxed mb-8">
          TourCraft makes it easy to create, preview and share interactive
          product tours with visuals, screen recordings and more. No code
          required. Built for collaboration and speed.
        </p>
        <div className="flex justify-center space-x-6">
          <Link
            to="/login"
            className="bg-sky-600 hover:bg-sky-700 text-white font-medium px-6 py-3 rounded-lg shadow transition duration-200"
          >
            Login
          </Link>
          <Link
            to="/signup"
            className="bg-white border border-sky-600 hover:bg-sky-50 text-sky-700 font-medium px-6 py-3 rounded-lg shadow transition duration-200"
          >
            Sign Up
          </Link>
        </div>
      </div>
    </div>
  );
}
