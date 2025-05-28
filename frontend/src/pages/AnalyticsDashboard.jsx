import { useEffect, useState, useContext } from "react";
import AuthContext from "../context/AuthContext";

export default function AnalyticsDashboard() {
  const { user } = useContext(AuthContext);
  const [analytics, setAnalytics] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/tours", {
          headers: { Authorization: `Bearer ${user.token}` },
        });

        if (!res.ok) throw new Error("Failed to fetch tours.");
        const tours = await res.json();

        const analyticsData = tours.map((tour) => ({
          id: tour._id,
          title: tour.title,
          views: Math.floor(Math.random() * 1000),
          clicks: Math.floor(Math.random() * 500),
        }));

        setAnalytics(analyticsData);
      } catch (error) {
        alert("We couldn't load your analytics data. Please try again.");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [user.token]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-sky-50 to-sky-100 py-10 px-4">
      <div className="max-w-5xl mx-auto bg-white shadow-md rounded-lg p-8">
        <h1 className="text-4xl font-bold text-sky-800 mb-6 text-center">
          Analytics Dashboard
        </h1>

        {loading ? (
          <p className="text-center text-gray-600">Loading analytics data...</p>
        ) : analytics.length === 0 ? (
          <p className="text-center text-gray-600">
            No data available. Start creating tours to track performance.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full table-auto border-collapse">
              <thead>
                <tr className="bg-sky-100 text-sky-800 text-left">
                  <th className="p-3 font-semibold border-b border-gray-200">
                    Tour Title
                  </th>
                  <th className="p-3 font-semibold border-b border-gray-200 text-right">
                    Views
                  </th>
                  <th className="p-3 font-semibold border-b border-gray-200 text-right">
                    Clicks
                  </th>
                </tr>
              </thead>
              <tbody>
                {analytics.map(({ id, title, views, clicks }) => (
                  <tr
                    key={id}
                    className="hover:bg-sky-50 transition border-b border-gray-100"
                  >
                    <td className="p-3 text-gray-700">{title}</td>
                    <td className="p-3 text-right text-gray-700">{views}</td>
                    <td className="p-3 text-right text-gray-700">{clicks}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
