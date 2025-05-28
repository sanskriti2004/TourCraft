import { useEffect, useState, useContext, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { io } from "socket.io-client";

export default function EditTour() {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [steps, setSteps] = useState([]);
  const socketRef = useRef(null);
  const selfUpdateRef = useRef(false); // Flag to avoid loops

  useEffect(() => {
    // Connect socket once component mounts
    socketRef.current = io("http://localhost:4000");

    socketRef.current.emit("join-tour", id);

    // Listen for updates from others
    socketRef.current.on("tour-update", (data) => {
      if (!selfUpdateRef.current) {
        // Apply updates from others
        if (data.title !== undefined) setTitle(data.title);
        if (data.steps !== undefined) setSteps(data.steps);
      }
      selfUpdateRef.current = false;
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, [id]);

  useEffect(() => {
    // Fetch initial tour data
    const fetchTour = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/tours/${id}`, {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        });

        const data = await res.json();
        setTitle(data.title);
        setSteps(data.steps);
      } catch (err) {
        console.error(err);
      }
    };

    fetchTour();
  }, [id, user]);

  // Emit update to socket
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

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`http://localhost:5000/api/tours/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user?.token}`,
        },
        body: JSON.stringify({ title, steps }),
      });

      if (!res.ok) throw new Error("Failed to update tour");

      navigate("/dashboard");
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-10 p-6 border rounded-lg shadow-lg bg-white">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Edit Tour</h1>
      <form onSubmit={submitHandler} className="space-y-6">
        {/* Title Input */}
        <div>
          <input
            type="text"
            placeholder="Tour Title"
            className="w-full p-4 border rounded-lg text-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            value={title}
            onChange={handleTitleChange}
          />
        </div>

        {/* Drag & Drop Steps */}
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
                        className={`border p-4 rounded-lg bg-gray-50 relative mb-4 shadow-md transition duration-300 transform ${
                          snapshot.isDragging
                            ? "bg-blue-100 shadow-xl"
                            : "bg-white"
                        }`}
                      >
                        {/* Image URL Input */}
                        <input
                          type="text"
                          placeholder="Image URL"
                          className="w-full p-3 border rounded-lg mb-4 text-lg focus:ring-2 focus:ring-blue-500 transition"
                          value={step.imageUrl}
                          onChange={(e) =>
                            handleStepChange(index, "imageUrl", e.target.value)
                          }
                        />

                        {/* Description Input */}
                        <textarea
                          placeholder="Step Description"
                          className="w-full p-3 border rounded-lg mb-4 text-lg focus:ring-2 focus:ring-blue-500 transition"
                          value={step.description}
                          onChange={(e) =>
                            handleStepChange(
                              index,
                              "description",
                              e.target.value
                            )
                          }
                        />

                        {/* Remove Step Button */}
                        <button
                          type="button"
                          onClick={() => removeStep(index)}
                          className="absolute mb-5 ml-5 top-2 right-2 text-red-500 text-xl hover:text-red-700 focus:outline-none"
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

        {/* Add Step Button */}
        <div className="flex justify-start">
          <button
            type="button"
            onClick={addStep}
            className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg shadow-md hover:bg-gray-400 transition"
          >
            + Add Step
          </button>
        </div>

        {/* Save Button */}
        <div className="flex justify-center">
          <button
            type="submit"
            className="w-full bg-blue-600 text-white p-4 rounded-lg shadow-md hover:bg-blue-700 transition"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
}
