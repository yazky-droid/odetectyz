import { type RefObject, useEffect } from "react";
import Webcam from "react-webcam";
import * as cocoSsd from "@tensorflow-models/coco-ssd";
import { drawBoundingBoxes } from "../utils/drawBoundingBoxes";

interface Props {
  webcamRef: RefObject<Webcam | null>;
  canvasRef: RefObject<HTMLCanvasElement | null>;
  model: cocoSsd.ObjectDetection | null;

  onFpsUpdate?: (fps: number) => void;
  onObjectCountUpdate?: (count: number) => void;
  
}

export function useObjectDetection({
  webcamRef,
  canvasRef,
  model,
  onFpsUpdate,
  onObjectCountUpdate,
}: Props) {
  useEffect(() => {
    if (!model) return;

    let animationId: number;
    let lastTime = performance.now();
    let objectIdCounter = 0;
    const trackedObjects = new Map();

    const detect = async () => {
      const webcam = webcamRef.current;
      const now = performance.now();

      const fps = Math.round(
        1000 / (now - lastTime)
      );

      lastTime = now;
      onFpsUpdate?.(fps);

      if (
        webcam &&
        webcam.video &&
        webcam.video.readyState === 4
      ) {
        const video = webcam.video;

        const predictions = await model.detect(video);
        const enhanced = predictions.map((p) => {
            const key =
                `${p.class}_${Math.round(p.bbox[0] / 50)}_${Math.round(p.bbox[1] / 50)}`;

            if (!trackedObjects.has(key)) {
                trackedObjects.set(key, {
                id: objectIdCounter++,
                lastSeen: Date.now(),
                });
            }

            const obj = trackedObjects.get(key);

            obj.lastSeen = Date.now();

            return {
                ...p,
                id: obj.id,
            };
            });

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