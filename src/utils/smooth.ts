export function smoothValue(
  prev: number,
  next: number,
  alpha = 0.3
) {
  return prev + (next - prev) * alpha;
}