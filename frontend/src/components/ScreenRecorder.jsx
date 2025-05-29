// components/ScreenRecorder.jsx
import { useRef, useState } from "react";

export default function ScreenRecorder({ onSave }) {
  const mediaRecorderRef = useRef(null);
  const [recording, setRecording] = useState(false);
  const [stream, setStream] = useState(null);

  const startRecording = async () => {
    const captureStream = await navigator.mediaDevices.getDisplayMedia({
      video: true,
    });
    setStream(captureStream);

    const chunks = [];
    const recorder = new MediaRecorder(captureStream);
    mediaRecorderRef.current = recorder;

    recorder.ondataavailable = (e) => {
      if (e.data.size > 0) chunks.push(e.data);
    };

    recorder.onstop = async () => {
      const blob = new Blob(chunks, { type: "video/webm" });

      // ✅ Convert blob to base64
      const reader = new FileReader();
      reader.onloadend = () => {
        onSave(reader.result); // base64
      };
      reader.readAsDataURL(blob);
    };

    recorder.start();
    setRecording(true);
  };

  const stopRecording = () => {
    mediaRecorderRef.current.stop();
    stream.getTracks().forEach((track) => track.stop());
    setRecording(false);
  };

  return (
    <div className="my-4 space-x-4">
      {recording ? (
        <button
          onClick={stopRecording}
          className="bg-red-500 cursor-pointer text-white px-4 py-2 rounded"
        >
          Stop Recording
        </button>
      ) : (
        <button
          onClick={startRecording}
          className="bg-blue-600 cursor-pointer text-white px-4 py-2 rounded"
        >
          Start Screen Recording
        </button>
      )}
    </div>
  );
}
