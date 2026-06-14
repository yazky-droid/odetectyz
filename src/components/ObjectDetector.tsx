import { useEffect, useRef, useState } from "react";
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
  const [latestLabel, setLatestLabel] = useState<string>("");

    useEffect(() => {
    const enableAudio = () => {
        speechSynthesis.resume();
    };

    window.addEventListener(
        "click",
        enableAudio
    );

    return () =>
        window.removeEventListener(
        "click",
        enableAudio
        );
    }, []);

    useObjectDetection({
        webcamRef,
        canvasRef,
        model,
        onFpsUpdate: setFps,
        onObjectCountUpdate: setObjectCount,
        onDetectionUpdate: setLatestLabel,
    });

  return (
    <div
        style={{
            position: "relative",
            width: 640,
            height: 480,
            borderRadius: 16,
            overflow: "hidden",
            background: "#000",
            boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
        }}
    >
      {loading && <p>Loading model...</p>}
      <HUD
        fps={fps}
        objectCount={objectCount}
      />
      <div
      style={{
        position: "absolute",
        top: 12,
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 20,
        padding: "8px 16px",
        borderRadius: 999,
        background: "rgba(0,0,0,0.6)",
        border: "1px solid rgba(0,255,255,0.4)",
        color: "#00ffff",
        fontFamily: "monospace",
        fontSize: 14,
        backdropFilter: "blur(10px)",
        transition: "all 0.2s ease",
      }}
      >
      DETECTING: {latestLabel || "—"}
      </div>
      <Webcam
        ref={webcamRef}
        audio={false}
        mirrored={false}
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