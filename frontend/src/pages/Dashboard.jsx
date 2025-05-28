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

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-100 via-white to-sky-200 p-6">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:justify-between items-center mb-8 gap-4">
          <h1 className="text-4xl font-bold text-sky-800 text-center sm:text-left">
            Your Product Tours
          </h1>
          <div className="flex gap-4">
            <Link
              to="/analytics"
              className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition"
            >
              Analytics
            </Link>
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
            >
              Logout
            </button>
          </div>
        </div>

        <div className="mb-6 text-center">
          <Link
            to="/create-tour"
            className="inline-block bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 transition"
          >
            + Create New Tour
          </Link>
        </div>

        {loading ? (
          <p className="text-center text-gray-600">Loading your tours...</p>
        ) : tours.length === 0 ? (
          <p className="text-center text-gray-600">
            You haven’t created any tours yet.
          </p>
        ) : (
          <ul className="grid gap-6 md:grid-cols-2">
            {tours.map((tour) => (
              <li key={tour._id} className="bg-white shadow-md rounded-lg p-6">
                <h2 className="text-xl font-semibold text-sky-800 mb-1">
                  {tour.title}
                </h2>
                <p className="text-sm text-gray-500 mb-4">
                  {tour.steps.length} steps •{" "}
                  {tour.isPublic ? "Public" : "Private"}
                </p>

                <div className="flex flex-wrap gap-3 mb-3">
                  <Link
                    to={`/edit-tour/${tour._id}`}
                    className="text-blue-600 hover:underline"
                  >
                    Edit
                  </Link>
                  <Link
                    to={`/preview/${tour._id}`}
                    className="text-purple-600 hover:underline"
                  >
                    Preview
                  </Link>
                </div>

                <button
                  onClick={() => handleShare(tour._id)}
                  disabled={!tour.isPublic}
                  className={`w-full text-center py-2 rounded transition font-medium ${
                    tour.isPublic
                      ? "bg-blue-500 text-white hover:bg-blue-600"
                      : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  }`}
                >
                  {tour.isPublic ? "Copy Public Link" : "Private Tour"}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
