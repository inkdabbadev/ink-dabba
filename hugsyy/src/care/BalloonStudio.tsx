import { useRef, useState, type ReactNode } from "react";
import { useCare } from "./store";
import { play } from "./audio";

const instructions: Record<string, string[]> = {
  dog: [
    "Inflate your balloon.",
    "Twist the nose and lock the ears.",
    "Fold and twist the front legs.",
    "Finish the back legs and tail.",
    "Your balloon dog. Made by you.",
  ],
  bunny: [
    "Inflate your balloon.",
    "Fold two long bunny ears.",
    "Twist the front paws.",
    "Finish the back paws and tail.",
    "Your balloon bunny. Made by you.",
  ],
  flower: [
    "Inflate your balloon.",
    "Fold and twist the first petals.",
    "Loop the rest of the petals.",
    "Lock the centre and stem.",
    "Your balloon flower. Made by you.",
  ],
};
function advance() {
  useCare.getState().update((d) => ({
    ...d,
    balloon: { ...d.balloon, step: Math.min(4, d.balloon.step + 1) },
  }));
  play("magic");
}

export function BalloonInteraction({ children }: { children: ReactNode }) {
  const balloon = useCare((s) => s.data.balloon);
  const start = useRef<{ x: number; y: number } | null>(null);
  const consumed = useRef(false);
  const [pull, setPull] = useState(0);
  return (
    <div className="balloon-interactive" data-balloon-step={balloon.step}>
      <div
        className="balloon-model"
        style={{
          transform: `rotate(${pull * 9}deg) scale(${1 + Math.abs(pull) * 0.06})`,
        }}
      >
        {children}
      </div>
      {balloon.step < 4 && (
        <button
          className="balloon-touch-layer"
          aria-label={
            balloon.step === 0
              ? "Inflate balloon on the canvas"
              : "Twist balloon on the canvas"
          }
          onPointerDown={(e) => {
            if (e.button !== 0) return;
            start.current = { x: e.clientX, y: e.clientY };
            consumed.current = false;
            e.currentTarget.setPointerCapture(e.pointerId);
          }}
          onPointerMove={(e) => {
            if (!start.current) return;
            setPull(
              Math.max(
                -1,
                Math.min(
                  1,
                  (e.clientX -
                    start.current.x +
                    (e.clientY - start.current.y) * 0.5) /
                    65,
                ),
              ),
            );
          }}
          onPointerUp={(e) => {
            if (!start.current) return;
            const distance = Math.hypot(
              e.clientX - start.current.x,
              e.clientY - start.current.y,
            );
            start.current = null;
            setPull(0);
            if (distance >= 35) {
              consumed.current = true;
              advance();
            }
          }}
          onPointerCancel={() => {
            start.current = null;
            consumed.current = true;
            setPull(0);
          }}
          onClick={(e) => {
            if (consumed.current && e.detail !== 0) {
              consumed.current = false;
              return;
            }
            advance();
          }}
        >
          <span>
            {balloon.step === 0
              ? "Tap or drag the balloon to inflate"
              : "Tap or drag the balloon to twist"}{" "}
            <span aria-hidden="true">↔</span>
          </span>
        </button>
      )}
    </div>
  );
}

export function BalloonTools() {
  const balloon = useCare((s) => s.data.balloon),
    update = useCare((s) => s.update);
  return (
    <>
      <label>
        Make a
        <select
          aria-label="Balloon shape"
          value={balloon.shape}
          onChange={(e) =>
            update((d) => ({
              ...d,
              balloon: { ...d.balloon, shape: e.target.value, step: 0 },
            }))
          }
        >
          <option value="dog">Balloon dog</option>
          <option value="bunny">Balloon bunny</option>
          <option value="flower">Balloon flower</option>
        </select>
      </label>
      <label>
        Balloon colour
        <input
          type="color"
          aria-label="Balloon colour"
          value={balloon.color}
          onChange={(e) =>
            update((d) => ({
              ...d,
              balloon: { ...d.balloon, color: e.target.value },
            }))
          }
        />
      </label>
      <div className="balloon-colors">
        {["#cf7896", "#baa2d2", "#8caca0", "#e2b969", "#88a8c4"].map(
          (color) => (
            <button
              key={color}
              aria-label={`Balloon colour ${color}`}
              aria-pressed={balloon.color === color}
              style={{ background: color }}
              onClick={() =>
                update((d) => ({ ...d, balloon: { ...d.balloon, color } }))
              }
            />
          ),
        )}
      </div>
      <div className="twist-progress" aria-label={`${balloon.step} of 4 steps`}>
        {[1, 2, 3, 4].map((n) => (
          <span key={n} className={balloon.step >= n ? "complete" : ""} />
        ))}
      </div>
      <p className="twist-instruction" role="status">
        {instructions[balloon.shape][balloon.step]}
      </p>
      <button
        className="birthday-primary"
        onClick={() =>
          balloon.step === 4
            ? update((d) => ({ ...d, balloon: { ...d.balloon, step: 0 } }))
            : advance()
        }
      >
        {balloon.step === 4
          ? "Make another"
          : balloon.step === 0
            ? "Inflate balloon"
            : "Twist balloon ↻"}
      </button>
      {balloon.step > 0 && (
        <button
          className="quiet-action"
          onClick={() =>
            update((d) => ({
              ...d,
              balloon: { ...d.balloon, step: Math.max(0, d.balloon.step - 1) },
            }))
          }
        >
          Undo twist
        </button>
      )}
    </>
  );
}
