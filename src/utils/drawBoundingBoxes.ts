import * as cocoSsd from "@tensorflow-models/coco-ssd";
import { OBJECT_COLORS } from "./objectColors";

export function drawRoundedRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius = 10
) {
  ctx.beginPath();

  ctx.moveTo(x + radius, y);

  ctx.lineTo(x + width - radius, y);

  ctx.quadraticCurveTo(
    x + width,
    y,
    x + width,
    y + radius
  );

  ctx.lineTo(
    x + width,
    y + height - radius
  );

  ctx.quadraticCurveTo(
    x + width,
    y + height,
    x + width - radius,
    y + height
  );

  ctx.lineTo(x + radius, y + height);

  ctx.quadraticCurveTo(
    x,
    y + height,
    x,
    y + height - radius
  );

  ctx.lineTo(x, y + radius);

  ctx.quadraticCurveTo(
    x,
    y,
    x + radius,
    y
  );

  ctx.closePath();

  ctx.stroke();
}

export function drawBoundingBoxes(
  predictions: (cocoSsd.DetectedObject & {id: number})[],
  ctx: CanvasRenderingContext2D
) {
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

  const target =
    predictions.length > 0
      ? predictions.reduce((best, current) =>
          current.score > best.score ? current : best
        )
      : null;

  predictions.forEach((prediction) => {
    if (target === null) return;

    const isTarget = prediction === target;

    const [x, y, width, height] = prediction.bbox;
    const color = isTarget
      ? "#FF0000"
      : OBJECT_COLORS[prediction.class] || "#00FFFF";

    ctx.strokeStyle = color;
    ctx.lineWidth = 3;
    ctx.shadowBlur = 20;
    ctx.shadowColor = color;

    drawRoundedRect(ctx, x, y, width, height, 15);

    ctx.fillStyle = color;
    ctx.font = "16px Arial";

    ctx.fillText(
      `ID: ${prediction.id} | ${prediction.class} ${Math.round(prediction.score * 100)}%`,
      x,
      y > 10 ? y - 5 : 10
    );

    if(isTarget && prediction.score > 0.7) {
        ctx.fillStyle = "#FF0000";
        ctx.font = "bold 20px Arial";
        ctx.fillText(
          "TARGET LOCKED",
          x,
          y - 30
        );      
    }

    ctx.shadowBlur = 0;
  });
}