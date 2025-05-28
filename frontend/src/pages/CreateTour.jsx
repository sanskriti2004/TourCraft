import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import ScreenRecorder from "../components/ScreenRecorder";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

export default function CreateTour() {
  const [title, setTitle] = useState("");
  const [steps, setSteps] = useState([]);
  const [recordingBase64, setRecordingBase64] = useState(null); // 💡 Store recording as base64
  const [isPublic, setIsPublic] = useState(true); // default true or false as you prefer
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

  // Handle drag-and-drop to reorder steps
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

    // Prepend screen recording if available
    if (recordingBase64) {
      formattedSteps.unshift({
        imageUrl: recordingBase64,
        description: "Screen recording of workflow",
      });
    }

    const body = JSON.stringify({
      title,
      steps: formattedSteps,
      isPublic, // include here
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
    <div className="max-w-3xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-lg">
      <h1 className="text-3xl font-semibold text-center mb-6">
        Create a New Product Tour
      </h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <input
          type="text"
          placeholder="Tour Title"
          className="w-full  p-3 border rounded-md shadow-sm"
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
                        className={`p-4 border rounded-md shadow-sm bg-gray-50 ${
                          snapshot.isDragging ? "bg-blue-100" : ""
                        }`}
                      >
                        <label className="block font-medium">
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
                          className="block w-full mt-2 p-4 text-center cursor-pointer border-2 border-dashed rounded-md border-gray-300 bg-gray-50 hover:bg-gray-100 text-gray-700 hover:text-gray-800 transition-all duration-200 ease-in-out"
                        >
                          <span className="block text-lg font-medium">
                            Choose Image
                          </span>
                          <span className="text-sm text-gray-500">
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
                          className="w-full mt-2 p-2 border rounded-md"
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
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
        >
          + Add Step
        </button>

        {/* Make Tour Public Toggle */}
        <label className="flex items-center space-x-2 mt-4">
          <input
            type="checkbox"
            checked={isPublic}
            onChange={() => setIsPublic((prev) => !prev)}
            className="form-checkbox"
          />
          <span>Make this tour public</span>
        </label>

        <div className="mt-6">
          <button
            type="submit"
            className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700"
          >
            Save Tour
          </button>
        </div>
      </form>

      {/* 🟦 Screen Recorder Section */}
      <div className="mt-10">
        <h2 className="text-2xl font-semibold mb-4">Optional: Record Screen</h2>

        {/* Display recording added message */}
        {recordingBase64 && (
          <div className="bg-green-100 text-green-800 p-4 rounded-md mb-4">
            <p className="font-semibold">Video recording added successfully!</p>
          </div>
        )}

        {/* ScreenRecorder component */}
        <ScreenRecorder onSave={(base64) => setRecordingBase64(base64)} />
      </div>
    </div>
  );
}
