import { useCallback, useEffect, useRef, useState } from "react";

export type MicState =
  "idle" | "requesting" | "calibrating" | "listening" | "error";

/** Analyse microphone energy locally; no recording or upload. */
export function useBlowCandles(onBlow: () => void, enabled: boolean) {
  const [state, setState] = useState<MicState>("idle");
  const [message, setMessage] = useState("");
  const [level, setLevel] = useState(0);
  const [progress, setProgress] = useState(0);
  const callback = useRef(onBlow);
  callback.current = onBlow;
  const resources = useRef<{
    stream?: MediaStream;
    context?: AudioContext;
    frame?: number;
  }>({});
  const generation = useRef(0);
  const release = useCallback(() => {
    generation.current++;
    const r = resources.current;
    resources.current = {};
    if (r.frame !== undefined) cancelAnimationFrame(r.frame);
    r.stream?.getTracks().forEach((track) => track.stop());
    if (r.context && r.context.state !== "closed")
      void r.context.close().catch(() => {});
  }, []);
  const stop = useCallback(() => {
    release();
    setState("idle");
    setLevel(0);
    setProgress(0);
  }, [release]);
  useEffect(() => {
    if (!enabled) stop();
  }, [enabled, stop]);
  useEffect(() => {
    const hidden = () => {
      if (document.hidden) stop();
    };
    document.addEventListener("visibilitychange", hidden);
    return () => {
      document.removeEventListener("visibilitychange", hidden);
      release();
    };
  }, [release, stop]);

  const start = useCallback(async () => {
    if (!enabled) return;
    release();
    const request = generation.current;
    setMessage("");
    setState("requesting");
    setLevel(0);
    setProgress(0);
    try {
      if (!navigator.mediaDevices?.getUserMedia || !window.isSecureContext)
        throw new Error(
          "Use localhost or HTTPS for the microphone, or blow out with a tap.",
        );
      const context = new AudioContext();
      resources.current.context = context;
      // Resume during the original button gesture, including on mobile Safari.
      await context.resume();
      if (request !== generation.current) return;
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: false,
          noiseSuppression: false,
          autoGainControl: false,
        },
      });
      if (request !== generation.current) {
        stream.getTracks().forEach((t) => t.stop());
        return;
      }
      resources.current.stream = stream;
      const source = context.createMediaStreamSource(stream);
      const analyser = context.createAnalyser();
      analyser.fftSize = 1024;
      source.connect(analyser);
      const samples = new Float32Array(analyser.fftSize);
      const room: number[] = [];
      const began = performance.now();
      let last = began,
        held = 0,
        threshold = 0.055;
      setState("calibrating");
      const frame = (now: number) => {
        if (request !== generation.current) return;
        analyser.getFloatTimeDomainData(samples);
        const rms = Math.sqrt(
          samples.reduce((sum, v) => sum + v * v, 0) / samples.length,
        );
        const dt = Math.min(80, now - last);
        last = now;
        if (now - began < 700) {
          room.push(rms);
        } else {
          if (room.length) {
            room.sort((a, b) => a - b);
            threshold = Math.max(
              0.045,
              Math.min(0.22, room[Math.floor(room.length / 2)] * 2.8 + 0.015),
            );
            room.length = 0;
            setState("listening");
          }
          held = rms > threshold ? held + dt : Math.max(0, held - dt * 1.5);
          setProgress(Math.min(1, held / 380));
          if (held >= 380) {
            stop();
            callback.current();
            return;
          }
        }
        setLevel(Math.min(1, rms / threshold));
        resources.current.frame = requestAnimationFrame(frame);
      };
      resources.current.frame = requestAnimationFrame(frame);
    } catch (error) {
      if (request !== generation.current) return;
      release();
      setState("error");
      const name = error instanceof Error ? error.name : "";
      setMessage(
        name === "NotAllowedError"
          ? "Microphone access is off. You can try again or blow out with a tap."
          : name === "NotFoundError"
            ? "No microphone found. Blow out with a tap instead."
            : error instanceof Error &&
                error.message.startsWith("Use localhost")
              ? error.message
              : "The microphone couldn't start. Try again or blow out with a tap.",
      );
    }
  }, [enabled, release, stop]);
  return { state, message, level, progress, start, stop };
}
