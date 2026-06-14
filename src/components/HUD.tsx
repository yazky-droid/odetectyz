import * as tf from "@tensorflow/tfjs";

type Props = {
  fps: number;
  objectCount: number;
};

export default function HUD({
  fps,
  objectCount,
}: Props) {
  return (
    <div
      style={{
        position: "absolute",
        top: 20,
        left: 20,
        color: "#00FFFF",
        background: "rgba(0,0,0,.6)",
        padding: 12,
        border: "1px solid #00FFFF",
        fontFamily: "monospace",
      }}
    >
      <div>AI VISION SYSTEM</div>
      <div>Backend: {tf.getBackend()}</div>
      <div>FPS: {fps}</div>
      <div>Objects: {objectCount}</div>
    </div>
  );
}