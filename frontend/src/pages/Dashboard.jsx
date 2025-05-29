import { useEffect, useState, useContext } from "react";
import AuthContext from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";

export default function Dashboard() {
  const { user, setUser } = useContext(AuthContext);
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTours = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/tours", {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Failed to load tours.");
        setTours(data);
      } catch (error) {
        alert("Unable to load your tours. Please try again later.");
        console.error("Error fetching tours:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTours();
  }, [user.token]);

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("user");
    navigate("/login");
  };

  const handleShare = (id) => {
    const url = `${window.location.origin}/preview/${id}`;
    navigator.clipboard.writeText(url);
    alert("Public link copied to clipboard.");
  };

  // Reusable button with blur background effect
  const BlurButton = ({
    children,
    className = "",
    disabled = false,
    onClick,
    type = "button",
  }) => (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`relative overflow-hidden rounded transition duration-200 font-medium focus:outline-none focus:ring-4 focus:ring-opacity-50 disabled:opacity-60 disabled:cursor-not-allowed ${className}`}
    >
      {/* Blur background */}
      <span
        aria-hidden="true"
        className={`absolute inset-0 rounded transition duration-200 ${
          disabled ? "" : "backdrop-blur-sm"
        }`}
      />
      {/* Text */}
      <span className="relative z-10">{children}</span>
    </button>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-white to-gray-200 dark:from-gray-800 dark:via-gray-900 dark:to-gray-800 p-6">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:justify-between items-center mb-8 gap-4">
          <h1 className="text-4xl font-bold text-gray-800 dark:text-gray-100 text-center sm:text-left">
            Your Product Tours
          </h1>
          <div className="flex gap-4">
            <BlurButton
              className="bg-indigo-600  hover:bg-indigo-700 focus:ring-indigo-400 cursor-pointer px-4 py-2 text-white"
              onClick={() => navigate("/analytics")}
            >
              Analytics
            </BlurButton>
            <BlurButton
              className="bg-red-500 cursor-pointer hover:bg-red-600 focus:ring-red-400 px-4 py-2 text-white"
              onClick={handleLogout}
            >
              Logout
            </BlurButton>
          </div>
        </div>

        <div className="mb-6 text-center">
          <Link
            to="/create-tour"
            className="inline-block relative overflow-hidden rounded-lg bg-green-600 px-6 py-3 font-medium text-white transition duration-200 hover:bg-green-700 focus:outline-none focus:ring-4 focus:ring-green-400 focus:ring-opacity-50"
          >
            <span
              aria-hidden="true"
              className="absolute inset-0 rounded-lg backdrop-blur-sm"
            />
            <span className="relative z-10">+ Create New Tour</span>
          </Link>
        </div>

        {loading ? (
          <p className="text-center text-gray-600 dark:text-gray-300">
            Loading your tours...
          </p>
        ) : tours.length === 0 ? (
          <p className="text-center text-gray-600 dark:text-gray-300">
            You haven’t created any tours yet.
          </p>
        ) : (
          <ul className="grid gap-6 md:grid-cols-2">
            {tours.map((tour) => (
              <li
                key={tour._id}
                className="bg-white dark:bg-gray-900 shadow-md rounded-lg p-6"
              >
                <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-1">
                  {tour.title}
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                  {tour.steps.length} steps •{" "}
                  {tour.isPublic ? "Public" : "Private"}
                </p>

                <div className="flex flex-wrap gap-3 mb-3">
                  <Link
                    to={`/edit-tour/${tour._id}`}
                    className="text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    Edit
                  </Link>
                  <Link
                    to={`/preview/${tour._id}`}
                    className="text-purple-600 dark:text-purple-400 hover:underline"
                  >
                    Preview
                  </Link>
                </div>

                <BlurButton
                  disabled={!tour.isPublic}
                  onClick={() => handleShare(tour._id)}
                  className={`w-full cursor-pointer py-2 rounded text-white ${
                    tour.isPublic
                      ? "bg-blue-500 hover:bg-blue-600 focus:ring-blue-400"
                      : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  }`}
                >
                  {tour.isPublic ? "Copy Public Link" : "Private Tour"}
                </BlurButton>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
