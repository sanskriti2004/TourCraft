import { useEffect, useState, useContext, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { io } from "socket.io-client";
import ScreenRecorder from "../components/ScreenRecorder";

export default function EditTour() {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [steps, setSteps] = useState([]);
  const [recordingBase64, setRecordingBase64] = useState(null);

  const socketRef = useRef(null);
  const selfUpdateRef = useRef(false);

  useEffect(() => {
    const fetchTour = async () => {
      try {
        const res = await fetch(
          `https://tour-craft-backend.vercel.app/api/tours/${id}`,
          {
            headers: {
              Authorization: `Bearer ${user?.token}`,
            },
          }
        );

        const data = await res.json();
        setTitle(data.title);
        setSteps(data.steps);
      } catch (err) {
        console.error(err);
      }
    };

    fetchTour();
  }, [id, user]);

  const emitUpdate = (updatedData) => {
    selfUpdateRef.current = true;
    socketRef.current.emit("tour-update", { tourId: id, data: updatedData });
  };

  const handleTitleChange = (e) => {
    const newTitle = e.target.value;
    setTitle(newTitle);
    emitUpdate({ title: newTitle });
  };

  const handleStepChange = (index, field, value) => {
    const updatedSteps = [...steps];
    updatedSteps[index][field] = value;
    setSteps(updatedSteps);
    emitUpdate({ steps: updatedSteps });
  };

  const addStep = () => {
    const newSteps = [...steps, { imageUrl: "", description: "" }];
    setSteps(newSteps);
    emitUpdate({ steps: newSteps });
  };

  const removeStep = (index) => {
    const newSteps = steps.filter((_, i) => i !== index);
    setSteps(newSteps);
    emitUpdate({ steps: newSteps });
  };

  const reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    return result;
  };

  const onDragEnd = (result) => {
    if (!result.destination) return;
    const reorderedSteps = reorder(
      steps,
      result.source.index,
      result.destination.index
    );
    setSteps(reorderedSteps);
    emitUpdate({ steps: reorderedSteps });
  };

  const handleRecordingSave = (base64) => {
    const videoStep = {
      imageUrl: base64,
      description: "Screen recording of workflow",
    };

    if (
      steps.length > 0 &&
      steps[0].imageUrl &&
      steps[0].imageUrl.startsWith("data:video")
    ) {
      const updatedSteps = [...steps];
      updatedSteps[0] = videoStep;
      setSteps(updatedSteps);
      emitUpdate({ steps: updatedSteps });
    } else {
      const updatedSteps = [videoStep, ...steps];
      setSteps(updatedSteps);
      emitUpdate({ steps: updatedSteps });
    }

    setRecordingBase64(base64);
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(
        `https://tour-craft-backend.vercel.app/api/tours/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user?.token}`,
          },
          body: JSON.stringify({ title, steps }),
        }
      );

      if (!res.ok) throw new Error("Failed to update tour");

      navigate("/dashboard");
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-white to-gray-200 dark:from-gray-800 dark:via-gray-900 dark:to-gray-800 py-10 px-4">
      <div className="max-w-3xl mx-auto mt-10 p-6 border rounded-lg shadow-lg bg-white dark:bg-gray-900 dark:text-white border-gray-200 dark:border-gray-700">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-6">
          Edit Tour
        </h1>
        <form onSubmit={submitHandler} className="space-y-6">
          <div>
            <input
              type="text"
              placeholder="Tour Title"
              className="w-full p-4 border rounded-lg text-lg shadow-md bg-white dark:bg-gray-800 dark:border-gray-600 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500 transition"
              value={title}
              onChange={handleTitleChange}
            />
          </div>

          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="stepsDroppable">
              {(provided) => (
                <div {...provided.droppableProps} ref={provided.innerRef}>
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
                          className={`border p-4 rounded-lg relative mb-4 shadow-md transition duration-300 transform ${
                            snapshot.isDragging
                              ? "bg-sky-100 dark:bg-sky-900 shadow-xl"
                              : "bg-white dark:bg-gray-800"
                          } border-gray-200 dark:border-gray-700`}
                        >
                          {step.imageUrl &&
                            (step.imageUrl.startsWith("data:video") ? (
                              <video
                                src={step.imageUrl}
                                controls
                                className="w-full h-auto rounded border mb-4"
                              />
                            ) : (
                              <img
                                src={step.imageUrl}
                                alt={`Step ${index + 1}`}
                                className="w-full h-auto rounded border mb-4"
                              />
                            ))}

                          <input
                            type="file"
                            accept="image/*,video/*"
                            className="hidden"
                            id={`file-input-${index}`}
                            onChange={(e) => {
                              const file = e.target.files[0];
                              if (file) {
                                const reader = new FileReader();
                                reader.onloadend = () => {
                                  handleStepChange(
                                    index,
                                    "imageUrl",
                                    reader.result
                                  );
                                };
                                reader.readAsDataURL(file);
                              }
                            }}
                          />
                          <label
                            htmlFor={`file-input-${index}`}
                            className="block w-full p-4 text-center cursor-pointer border-2 border-dashed rounded-md border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 hover:text-gray-800 transition-all duration-200 ease-in-out mb-4"
                          >
                            <span className="block text-lg font-medium">
                              Choose Image or Video
                            </span>
                            <span className="text-sm text-gray-500">
                              Click to upload or drag and drop
                            </span>
                          </label>

                          <textarea
                            placeholder="Step Description"
                            className="w-full p-3 border rounded-lg mb-4 text-lg bg-white dark:bg-gray-800 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-sky-500 transition"
                            value={step.description}
                            onChange={(e) =>
                              handleStepChange(
                                index,
                                "description",
                                e.target.value
                              )
                            }
                          />

                          <button
                            type="button"
                            onClick={() => removeStep(index)}
                            className="absolute mb-5 ml-5 top-2 right-2 text-red-500 hover:text-red-700 dark:hover:text-red-400 text-xl focus:outline-none"
                          >
                            ✕
                          </button>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>

          <div className="flex justify-start">
            <button
              type="button"
              onClick={addStep}
              className="bg-blue-600 text-white px-5 py-2 rounded-md hover:bg-blue-700 cursor-pointer transition"
            >
              + Add Step
            </button>
          </div>

          <div className="flex justify-center">
            <button
              type="submit"
              className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 cursor-pointer transition"
            >
              Save Changes
            </button>
          </div>
        </form>

        <div className="mt-10">
          <h2 className="text-2xl font-semibold mb-4">
            Optional: Record Screen
          </h2>

          {steps.length > 0 &&
            steps[0].imageUrl &&
            steps[0].imageUrl.startsWith("data:video") && (
              <div className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 p-4 rounded-md mb-4">
                <p className="font-semibold">
                  Video recording is part of this tour.
                </p>
              </div>
            )}

          <ScreenRecorder onSave={handleRecordingSave} />
        </div>
      </div>
    </div>
  );
}
