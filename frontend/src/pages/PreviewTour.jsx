import { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import AuthContext from "../context/AuthContext";

export default function PreviewTour() {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const [tour, setTour] = useState(null);
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const fetchTour = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/tours/${id}`, {
          headers: user?.token ? { Authorization: `Bearer ${user.token}` } : {}, // no auth header for public tours
        });

        if (!res.ok) throw new Error("Unauthorized or not found");

        const data = await res.json();
        setTour(data);
      } catch (err) {
        console.error("Error fetching tour:", err.message);
      }
    };

    fetchTour();
  }, [id, user]);

  if (!tour) return <p className="text-center mt-10">Loading...</p>;

  // Edge case: If there are no steps in the tour
  if (tour.steps.length === 0) {
    return (
      <div className="max-w-2xl mx-auto mt-10 p-4 text-center">
        <h1 className="text-2xl font-bold mb-4">{tour.title}</h1>
        <p className="text-lg text-gray-600">
          No steps available for this tour.
        </p>
      </div>
    );
  }

  const step = tour.steps[currentStep];

  // Check if current step's media is video or image
  const isVideo = step.imageUrl?.startsWith("data:video");

  const handleNext = () => {
    setCurrentStep((prev) => Math.min(prev + 1, tour.steps.length - 1));
  };

  const handlePrevious = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 p-4 text-center">
      <h1 className="text-2xl font-bold mb-4">{tour.title}</h1>

      <div className="transition-opacity duration-500 ease-in-out opacity-100 mb-6">
        <div className="mb-4">
          {isVideo ? (
            <video
              src={step.imageUrl}
              controls
              className="w-full h-auto rounded border"
            />
          ) : (
            <img
              src={step.imageUrl}
              alt={`Step ${currentStep + 1}`}
              className="w-full h-auto rounded border"
            />
          )}
        </div>
        <p className="mb-4">{step.description}</p>
      </div>

      <div className="flex justify-between">
        <button
          onClick={handlePrevious}
          disabled={currentStep === 0}
          className="bg-gray-300 px-4 py-2 rounded disabled:opacity-50"
        >
          Previous
        </button>
        <button
          onClick={handleNext}
          disabled={currentStep === tour.steps.length - 1}
          className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}
