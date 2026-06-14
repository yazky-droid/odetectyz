import { useEffect, useState } from "react";
import * as cocoSsd from "@tensorflow-models/coco-ssd";
import "@tensorflow/tfjs-backend-webgl";
import * as tf from "@tensorflow/tfjs";

export function useCocoSsd() {
  const [model, setModel] = useState<cocoSsd.ObjectDetection | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      await tf.setBackend("webgl");
      await tf.ready();

      const loadedModel = await cocoSsd.load();

      setModel(loadedModel);
      setLoading(false);
    };

    load();
  }, []);

  return { model, loading };
}