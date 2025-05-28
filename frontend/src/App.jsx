import { Routes, Route } from "react-router-dom";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import CreateTour from "./pages/CreateTour";
import PreviewTour from "./pages/PreviewTour";
import EditTour from "./pages/EditTour";
import LandingPage from "./pages/LandingPage"; // ✅ NEW
import AnalyticsDashboard from "./pages/AnalyticsDashboard"; // ✅ NEW

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} /> {/* ✅ Landing Page */}
      <Route path="/signup" element={<Signup />} />
      <Route path="/login" element={<Login />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/create-tour"
        element={
          <ProtectedRoute>
            <CreateTour />
          </ProtectedRoute>
        }
      />
      <Route path="/preview/:id" element={<PreviewTour />} />
      <Route
        path="/edit-tour/:id"
        element={
          <ProtectedRoute>
            <EditTour />
          </ProtectedRoute>
        }
      />
      <Route
        path="/analytics"
        element={
          <ProtectedRoute>
            <AnalyticsDashboard />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}
