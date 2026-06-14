import { type RefObject, useEffect, useRef } from "react";
import Webcam from "react-webcam";
import * as cocoSsd from "@tensorflow-models/coco-ssd";
import { drawBoundingBoxes } from "../utils/drawBoundingBoxes";
import { smoothValue } from "../utils/smooth";
import { speakDetection } from "../utils/voice";

interface Props {
  webcamRef: RefObject<Webcam | null>;
  canvasRef: RefObject<HTMLCanvasElement | null>;
  model: cocoSsd.ObjectDetection | null;

  onFpsUpdate?: (fps: number) => void;
  onObjectCountUpdate?: (count: number) => void;
  onDetectionUpdate?: (label: string) => void;
}

export function useObjectDetection({
  webcamRef,
  canvasRef,
  model,
  onFpsUpdate,
  onObjectCountUpdate,
  onDetectionUpdate,
}: Props) {
  useEffect(() => {
    if (!model) return;

    let animationId: number;
    let lastTime = performance.now();

    const memory = new Map<number, {
      x: number;
      y: number;
      w: number;
      h: number;
    }>();

    const tracked = new Map<string, number>();
    let nextId = 0;

    const scanModeRef = { current: "live" as "live" | "scan" };

    (window as any).triggerScan = () => {
      scanModeRef.current = "scan";
    };

    const detect = async () => {
      const webcam = webcamRef.current;
      const now = performance.now();

      const fps = Math.round(1000 / (now - lastTime));
      lastTime = now;
      onFpsUpdate?.(fps);

      if (
        webcam &&
        webcam.video &&
        webcam.video.readyState === 4
      ) {
        const video = webcam.video;

        const predictions = await model.detect(video);

        const topPrediction = predictions.reduce(
        (best: any, curr: any) =>
            curr.score > best.score ? curr : best,
        predictions[0]
        );

        if (topPrediction && topPrediction.score > 0.5) {
        onDetectionUpdate?.(topPrediction.class);
        }

        const spokenThisLoop = new Set<number>();

        const enhanced = predictions.map((p: any) => {
          const [x, y, w, h] = p.bbox;


          const key = `${p.class}-${Math.round(x / 50)}-${Math.round(y / 50)}`;

          if (!tracked.has(key)) {
            tracked.set(key, nextId++);
          }

          const id = tracked.get(key)!;
          p.id = id;

          if (scanModeRef.current === "scan") {
            if (p.score > 0.6 && !spokenThisLoop.has(id)) {
              speakDetection(p.class);
              spokenThisLoop.add(id);
            }
          }

          const prev = memory.get(id);

          const smoothed = prev
            ? {
                x: smoothValue(prev.x, x),
                y: smoothValue(prev.y, y),
                w: smoothValue(prev.w, w),
                h: smoothValue(prev.h, h),
              }
            : { x, y, w, h };

          memory.set(id, smoothed);

          return {
            ...p,
            bbox: [
              smoothed.x,
              smoothed.y,
              smoothed.w,
              smoothed.h,
            ],
          };
        });

        if (scanModeRef.current === "scan") {
          scanModeRef.current = "live";
        }

        onObjectCountUpdate?.(predictions.length);

        const canvas = canvasRef.current;

        if (canvas) {
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;

          const ctx = canvas.getContext("2d");

          if (ctx) {
            drawBoundingBoxes(enhanced, ctx);
          }
        }
      }

      animationId = requestAnimationFrame(detect);
    };

    detect();

    return () => cancelAnimationFrame(animationId);
  }, [model]);
}