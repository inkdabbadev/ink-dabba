import { useCare } from "./store";
let ctx: AudioContext | undefined,
  interacted = false;
if (typeof window !== "undefined") {
  window.addEventListener("pointerdown", () => (interacted = true), {
    once: true,
  });
  window.addEventListener("keydown", () => (interacted = true), { once: true });
}
export function play(kind = "pick") {
  if (!interacted || !useCare.getState().data.sound) return;
  try {
    ctx ??= new AudioContext();
    void ctx.resume();
    const t = ctx.currentTime;
    const noisy = ["paper", "tape", "ribbon", "pipe"].includes(kind);
    if (noisy) {
      const b = ctx.createBuffer(1, ctx.sampleRate * 0.22, ctx.sampleRate),
        arr = b.getChannelData(0);
      for (let i = 0; i < arr.length; i++)
        arr[i] = (Math.random() * 2 - 1) * 0.07;
      const s = ctx.createBufferSource(),
        f = ctx.createBiquadFilter(),
        g = ctx.createGain();
      f.type = "lowpass";
      f.frequency.value = kind === "tape" ? 1800 : 700;
      g.gain.setValueAtTime(0.35, t);
      g.gain.exponentialRampToValueAtTime(0.001, t + 0.2);
      s.buffer = b;
      s.connect(f).connect(g).connect(ctx.destination);
      s.start();
      return;
    }
    const notes =
      kind === "win"
        ? [523, 659, 784]
        : kind === "magic"
          ? [392, 587, 784]
          : kind === "miss"
            ? [330, 294]
            : kind === "drop"
              ? [290, 240]
              : [440];
    notes.forEach((n, i) => {
      const o = ctx!.createOscillator(),
        g = ctx!.createGain(),
        at = t + i * 0.1;
      o.type = "sine";
      o.frequency.value = n;
      g.gain.setValueAtTime(0.025, at);
      g.gain.exponentialRampToValueAtTime(0.001, at + 0.22);
      o.connect(g).connect(ctx!.destination);
      o.start(at);
      o.stop(at + 0.24);
    });
  } catch {}
}
