import { useRef, useState } from "react";
import Webcam from "react-webcam";
import { useCocoSsd } from "../hooks/useCocoSsd";
import { useObjectDetection } from "../hooks/useObjectDetection";
import HUD from "./HUD";

export default function ObjectDetector() {
  const webcamRef = useRef<Webcam>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [fps, setFps] = useState(0);
  const [objectCount, setObjectCount] = useState(0);

  const { model, loading } = useCocoSsd();

  useObjectDetection({
    webcamRef,
    canvasRef,
    model,
    onFpsUpdate: setFps,
    onObjectCountUpdate: setObjectCount,

  });

  return (
    <div
      style={{
        position: "relative",
        width: 640,
        height: 480,
      }}
    >
      {loading && <p>Loading model...</p>}
      <HUD
        fps={fps}
        objectCount={objectCount}
      />
      <Webcam
        ref={webcamRef}
        audio={false}
        mirrored
        style={{
          position: "absolute",
          width: 640,
          height: 480,
        }}
      />

      <canvas
        ref={canvasRef}
        style={{
          position: "absolute",
          width: 640,
          height: 480,
          zIndex: 10,
        }}
      />
    </div>
  );
}