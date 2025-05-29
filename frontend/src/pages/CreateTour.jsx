import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import ScreenRecorder from "../components/ScreenRecorder";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

export default function CreateTour() {
  const [title, setTitle] = useState("");
  const [steps, setSteps] = useState([]);
  const [recordingBase64, setRecordingBase64] = useState(null);
  const [isPublic, setIsPublic] = useState(true);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleAddStep = () => {
    setSteps([...steps, { imageFile: null, imageUrl: "", description: "" }]);
  };

  const handleStepChange = (index, field, value) => {
    const updated = [...steps];
    updated[index][field] = value;
    setSteps(updated);
  };

  const handleImageUpload = (index, file) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      handleStepChange(index, "imageFile", file);
      handleStepChange(index, "imageUrl", reader.result);
    };
    reader.readAsDataURL(file);
  };

  const onDragEnd = (result) => {
    if (!result.destination) return;
    const reorderedSteps = Array.from(steps);
    const [removed] = reorderedSteps.splice(result.source.index, 1);
    reorderedSteps.splice(result.destination.index, 0, removed);
    setSteps(reorderedSteps);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formattedSteps = steps.map((step) => ({
      imageUrl: step.imageUrl,
      description: step.description,
    }));

    if (recordingBase64) {
      formattedSteps.unshift({
        imageUrl: recordingBase64,
        description: "Screen recording of workflow",
      });
    }

    const body = JSON.stringify({
      title,
      steps: formattedSteps,
      isPublic,
    });

    const res = await fetch("http://localhost:5000/api/tours", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.token}`,
      },
      body,
    });

    if (res.ok) {
      const newTour = await res.json();
      navigate(`/edit-tour/${newTour._id}`);
    } else {
      alert("Failed to create tour.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-white to-gray-200 dark:from-gray-800 dark:via-gray-900 dark:to-gray-800 py-10 px-4">
      <div className="max-w-3xl mx-auto bg-white dark:bg-gray-900 shadow-lg rounded-lg p-8">
        <h1 className="text-3xl font-bold text-center text-gray-800 dark:text-gray-100 mb-6">
          Create a New Product Tour
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <input
            type="text"
            placeholder="Tour Title"
            className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-800 dark:text-white"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="steps">
              {(provided) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="space-y-6"
                >
                  {steps.map((step, index) => (
                    <Draggable
                      key={index}
                      draggableId={`step-${index}`}
                      index={index}
                    >
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className={`p-4 border rounded-md shadow-sm ${
                            snapshot.isDragging
                              ? "bg-blue-50 dark:bg-blue-900"
                              : "bg-gray-50 dark:bg-gray-800"
                          }`}
                        >
                          <label className="block font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Step {index + 1}
                          </label>

                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) =>
                              handleImageUpload(index, e.target.files[0])
                            }
                            className="hidden"
                            id={`file-input-${index}`}
                          />
                          <label
                            htmlFor={`file-input-${index}`}
                            className="block w-full mt-2 p-4 text-center cursor-pointer border-2 border-dashed rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 transition"
                          >
                            <span className="block text-lg font-medium">
                              Choose Image
                            </span>
                            <span className="text-sm text-gray-500 dark:text-gray-400">
                              or drag and drop
                            </span>
                          </label>

                          {step.imageUrl && (
                            <img
                              src={step.imageUrl}
                              alt={`Step ${index + 1}`}
                              className="w-full h-auto rounded-md mt-2"
                            />
                          )}

                          <textarea
                            placeholder="Step description..."
                            className="w-full mt-3 p-3 border rounded dark:bg-gray-800 dark:text-white dark:border-gray-700 focus:ring-2 focus:ring-blue-400"
                            value={step.description}
                            onChange={(e) =>
                              handleStepChange(
                                index,
                                "description",
                                e.target.value
                              )
                            }
                          />
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>

          <button
            type="button"
            onClick={handleAddStep}
            className="bg-blue-600 text-white px-5 py-2 rounded-md hover:bg-blue-700 cursor-pointer transition"
          >
            + Add Step
          </button>

          <label className="flex items-center space-x-2 mt-4 text-gray-700 dark:text-gray-300">
            <input
              type="checkbox"
              checked={isPublic}
              onChange={() => setIsPublic((prev) => !prev)}
              className="form-checkbox text-blue-600 dark:bg-gray-800"
            />
            <span>Make this tour public</span>
          </label>

          <div className="pt-4">
            <button
              type="submit"
              className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 cursor-pointer transition"
            >
              Save Tour
            </button>
          </div>
        </form>

        <div className="mt-10">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
            Optional: Record Screen
          </h2>

          {recordingBase64 && (
            <div className="bg-green-100 text-green-800 p-4 rounded-md mb-4 dark:bg-green-900 dark:text-green-200">
              <p className="font-semibold">
                Video recording added successfully!
              </p>
            </div>
          )}

          <ScreenRecorder onSave={(base64) => setRecordingBase64(base64)} />
        </div>
      </div>
    </div>
  );
}
