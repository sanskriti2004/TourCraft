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
        const res = await fetch(
          `https://tour-craft-backend.vercel.app/api/tours/${id}`,
          {
            headers: user?.token
              ? { Authorization: `Bearer ${user.token}` }
              : {},
          }
        );

        if (!res.ok) throw new Error("Unauthorized or not found");

        const data = await res.json();
        setTour(data);
      } catch (err) {
        console.error("Error fetching tour:", err.message);
      }
    };

    fetchTour();
  }, [id, user]);

  if (!tour) {
    return (
      <p className="text-center mt-10 text-gray-600 dark:text-gray-300">
        Loading...
      </p>
    );
  }

  if (tour.steps.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-100 via-white to-gray-200 dark:from-gray-800 dark:via-gray-900 dark:to-gray-800 py-10 px-4">
        <div className="max-w-2xl mx-auto mt-10 p-4 text-center bg-white dark:bg-gray-900 shadow-md rounded-md">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4">
            {tour.title}
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            No steps available for this tour.
          </p>
        </div>
      </div>
    );
  }

  const step = tour.steps[currentStep];
  const isVideo = step.imageUrl?.startsWith("data:video");

  const handleNext = () => {
    setCurrentStep((prev) => Math.min(prev + 1, tour.steps.length - 1));
  };

  const handlePrevious = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-white to-gray-200 dark:from-gray-800 dark:via-gray-900 dark:to-gray-800 py-10 px-4">
      <div className="max-w-2xl mx-auto bg-white dark:bg-gray-900 shadow-lg rounded-lg p-6 text-center">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6">
          {tour.title}
        </h1>

        <div className="transition-opacity duration-500 ease-in-out opacity-100 mb-6">
          <div className="mb-4">
            {isVideo ? (
              <video
                src={step.imageUrl}
                controls
                className="w-full h-auto rounded-md border dark:border-gray-700"
              />
            ) : (
              <img
                src={step.imageUrl}
                alt={`Step ${currentStep + 1}`}
                className="w-full h-auto rounded-md border dark:border-gray-700"
              />
            )}
          </div>
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            {step.description}
          </p>
        </div>

        <div className="flex justify-between gap-4">
          <button
            onClick={handlePrevious}
            disabled={currentStep === 0}
            className="px-5 py-2 cursor-pointer rounded-md font-medium bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600 transition disabled:opacity-50 backdrop-blur"
          >
            Previous
          </button>
          <button
            onClick={handleNext}
            disabled={currentStep === tour.steps.length - 1}
            className="bg-blue-600 text-white px-5 py-2 rounded-md hover:bg-blue-700 cursor-pointer transition"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
