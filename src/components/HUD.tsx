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
        background: "rgba(0,0,0,.75)",
        padding: 12,
        border: "1px solid #00FFFF",
        fontFamily: "monospace",
        zIndex: 20,
        borderRadius: "4px",
        boxShadow: "0 0 10px rgba(0, 255, 255, 0.2)",
      }}
    >
      <div style={{ fontWeight: "bold", borderBottom: "1px solid rgba(0, 255, 255, 0.3)", paddingBottom: 4, marginBottom: 8 }}>
        Odetectyz
      </div>
      <div>Backend: {tf.getBackend()}</div>
      <div>FPS: {fps}</div>
      <div>Objects: {objectCount}</div>
      <div>
        <button
            onClick={() => (window as any).triggerScan()}
            style={{
                padding: 12,
                background: "rgba(0,0,0,0.5)",
                border: "none",
                cursor: "pointer",
                fontWeight: "bold",
                marginTop: 12,
                color: "#00FFFF",
                borderRadius: "40px",
                boxShadow: "0 0 5px rgba(0, 255, 255, 0.2)",   
            }}
            >
            LISTEN
        </button>
      </div>
    </div>
  );
}