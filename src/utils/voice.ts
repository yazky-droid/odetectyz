let lastSpoken: Record<string, number> = {};

export function speakDetection(
  label: string,
  cooldown = 3000
) {
  const now = Date.now();

  if (
    lastSpoken[label] &&
    now - lastSpoken[label] < cooldown
  ) {
    return;
  }

  lastSpoken[label] = now;

  const utterance =
    new SpeechSynthesisUtterance(
      `${label} detected`
    );

  utterance.rate = 1;
  utterance.pitch = 1;

  speechSynthesis.speak(utterance);
}