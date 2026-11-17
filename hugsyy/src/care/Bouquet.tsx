import { useEffect, useRef, useState, type PointerEvent } from "react";
import { useCare } from "./store";
import { careContent } from "./content";
import { FlowerArt } from "./Artwork";
import { play } from "./audio";
import type { FlowerStem } from "./types";
export function BouquetArt({
  interactive = false,
  selected,
  onSelect,
  onNote,
}: {
  interactive?: boolean;
  selected?: string | null;
  onSelect?: (id: string) => void;
  onNote?: (text: string) => void;
}) {
  const b = useCare((s) => s.data.bouquet);
  const stemCleanup = useRef<(() => void) | null>(null);
  useEffect(() => () => stemCleanup.current?.(), []);
  function startStem(e: PointerEvent<SVGGElement>, f: FlowerStem) {
    if (!interactive || e.button !== 0) return;
    e.stopPropagation();
    e.preventDefault();
    stemCleanup.current?.();
    const svg = e.currentTarget.ownerSVGElement;
    if (!svg) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    const point = (x: number, y: number) => {
      const p = svg.createSVGPoint();
      p.x = x;
      p.y = y;
      const m = svg.getScreenCTM();
      return m ? p.matrixTransform(m.inverse()) : p;
    };
    const start = point(e.clientX, e.clientY),
      id = e.pointerId;
    onSelect?.(f.id);
    onNote?.(
      careContent.flowerNotes[f.type as keyof typeof careContent.flowerNotes],
    );
    play("pick");
    const move = (event: globalThis.PointerEvent) => {
      if (event.pointerId !== id) return;
      const p = point(event.clientX, event.clientY);
      useCare.getState().update((d) => ({
        ...d,
        bouquet: {
          ...d.bouquet,
          flowers: d.bouquet.flowers.map((stem) =>
            stem.id === f.id
              ? {
                  ...stem,
                  x: Math.max(8, Math.min(92, f.x + (p.x - start.x) / 3)),
                  y: Math.max(12, Math.min(76, f.y + (p.y - start.y) / 4.2)),
                }
              : stem,
          ),
        },
      }));
    };
    const finish = () => stemCleanup.current?.();
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", finish);
    window.addEventListener("pointercancel", finish);
    stemCleanup.current = () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", finish);
      window.removeEventListener("pointercancel", finish);
      stemCleanup.current = null;
    };
  }
  return (
    <svg
      className="bouquet-art"
      viewBox="0 0 300 420"
      aria-label="Your arranged bouquet"
    >
      <path
        d="m31 148 121 49 121-49-65 229-56 34-60-34Z"
        fill={b.wrap}
        stroke="#9c879e"
        strokeWidth="1.5"
      />
      <path
        d="m31 148 70 84 51 179-60-34Zm242 0-70 84-51 179 56-34Z"
        fill="#fff8ee"
        fillOpacity=".28"
      />
      <path
        d="m63 162 90 40 87-38m-158 53 40 128m105-130-36 128"
        fill="none"
        stroke="#a28aa2"
        strokeWidth="1"
        opacity=".5"
      />
      {interactive && b.flowers.length === 0 && (
        <g pointerEvents="none" className="empty-bouquet">
          <text x="150" y="58" textAnchor="middle" fill="#946d7a" fontSize="12">
            Choose your first flower.
          </text>
          <circle
            cx="150"
            cy="105"
            r="28"
            fill="none"
            stroke="#b993a0"
            strokeDasharray="3 5"
          />
          <path d="M140 105h20m-10-10v20" stroke="#b993a0" />
        </g>
      )}
      {b.flowers.map((f) => (
        <g
          key={f.id}
          transform={`translate(${f.x * 3} ${f.y * 4.2}) rotate(${f.rotation}) scale(${f.size * 0.95})`}
          data-flower={f.id}
          className={interactive ? "editable-stem" : ""}
          onPointerDown={(e) => startStem(e, f)}
        >
          {interactive && (
            <circle r="34" fill="transparent" pointerEvents="all" />
          )}
          <FlowerArt type={f.type} />
          {interactive && selected === f.id && (
            <circle
              r="30"
              cy="-15"
              stroke="#966c9f"
              strokeDasharray="3 4"
              fill="none"
            />
          )}
        </g>
      ))}
      <path
        d="m100 285 51 22 51-22-14 32-37 16-37-16Z"
        fill={b.ribbon}
        stroke="#9d536b"
      />
      <path
        d="M151 310q-58-54-66-13 3 38 66 13 64 21 66-16-9-38-66 16Z"
        fill={b.ribbon}
        stroke="#995467"
      />
      <path
        d="m145 312-29 68 25-8 9 16 9-76m1 0 20 59 20-8-27-54"
        fill={b.ribbon}
        stroke="#995467"
      />
      <ellipse cx="153" cy="309" rx="10" ry="9" fill="#c17f8a" />
      <g transform="rotate(-12 199 323)">
        <path
          d="m176 308 41-11 20 40-41 16-20-19Z"
          fill="#f9eed9"
          stroke="#c7b596"
        />
        <circle cx="185" cy="317" r="2" fill="#b69c85" />
        <text
          x="209"
          y="326"
          textAnchor="middle"
          fontSize="8"
          fontFamily="Georgia"
          fill="#9b736e"
          transform="rotate(-8 209 326)"
        >
          {b.tag.slice(0, 18)}
        </text>
      </g>
    </svg>
  );
}
export function FlowerTools({
  selected,
  onSelect,
  onNote,
}: {
  selected: string | null;
  onSelect: (s: string | null) => void;
  onNote: (s: string) => void;
}) {
  const bouquet = useCare((s) => s.data.bouquet),
    update = useCare((s) => s.update),
    chosen = bouquet.flowers.find((f) => f.id === selected);
  const didDrag = useRef(false);
  const [ghost, setGhost] = useState<{
    x: number;
    y: number;
    type: string;
  } | null>(null);
  function add(type: string, point?: { x: number; y: number }) {
    if (bouquet.flowers.length >= 32) {
      onNote("A very full bouquet! Remove a stem to make room.");
      return;
    }
    const f: FlowerStem = {
      id: crypto.randomUUID(),
      type,
      x: point?.x ?? 30 + Math.random() * 40,
      y: point?.y ?? 25 + Math.random() * 24,
      rotation: Math.random() * 40 - 20,
      size: 1,
    };
    update((d) => ({
      ...d,
      bouquet: { ...d.bouquet, flowers: [...d.bouquet.flowers, f] },
    }));
    onSelect(f.id);
    onNote(
      careContent.flowerNotes[type as keyof typeof careContent.flowerNotes],
    );
    play("pick");
  }
  function edit(p: Partial<FlowerStem>) {
    update((d) => ({
      ...d,
      bouquet: {
        ...d.bouquet,
        flowers: d.bouquet.flowers.map((f) =>
          f.id === selected ? { ...f, ...p } : f,
        ),
      },
    }));
  }
  const supplyCleanup = useRef<(() => void) | null>(null);
  useEffect(() => () => supplyCleanup.current?.(), []);
  function beginSupply(e: PointerEvent<HTMLButtonElement>, type: string) {
    if (e.button !== 0) return;
    e.preventDefault();
    supplyCleanup.current?.();
    const x = e.clientX,
      y = e.clientY,
      id = e.pointerId;
    didDrag.current = false;
    const cancel = () => {
      supplyCleanup.current?.();
      setGhost(null);
    };
    const move = (event: globalThis.PointerEvent) => {
      if (
        event.pointerId !== id ||
        Math.hypot(event.clientX - x, event.clientY - y) < 7
      )
        return;
      didDrag.current = true;
      setGhost({ x: event.clientX, y: event.clientY, type });
    };
    const up = (event: globalThis.PointerEvent) => {
      if (event.pointerId !== id) return;
      cancel();
      if (!didDrag.current) {
        add(type);
        didDrag.current = true;
        return;
      }
      const svg = document.querySelector<SVGSVGElement>(
          ".dialog-bouquet .bouquet-art, .is-focused .bouquet-art",
        ),
        m = svg?.getScreenCTM();
      if (svg && m) {
        const p = svg.createSVGPoint();
        p.x = event.clientX;
        p.y = event.clientY;
        const v = p.matrixTransform(m.inverse());
        if (v.x >= 0 && v.x <= 300 && v.y >= 0 && v.y <= 420)
          add(type, {
            x: Math.max(8, Math.min(92, v.x / 3)),
            y: Math.max(12, Math.min(76, v.y / 4.2)),
          });
        else onNote("Drop a little bloom onto the wrapping paper.");
      }
    };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
    window.addEventListener("pointercancel", cancel);
    supplyCleanup.current = () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
      window.removeEventListener("pointercancel", cancel);
      supplyCleanup.current = null;
    };
  }
  return (
    <>
      <p className="eyebrow">A FEW THINGS THAT BLOOM</p>
      <h2>
        Make it
        <br />
        <em>a little you.</em>
      </h2>
      <div className="flower-supply">
        {["daisy", "tulip", "rose", "cosmos", "leaf"].map((t) => (
          <button
            key={t}
            aria-label={"Add " + t}
            onPointerDown={(e) => beginSupply(e, t)}
            onClick={(e) => {
              if (e.detail !== 0 && didDrag.current) {
                didDrag.current = false;
                return;
              }
              didDrag.current = false;
              add(t);
            }}
          >
            <svg viewBox="-42 -65 84 125">
              <FlowerArt type={t} />
            </svg>
            <span>{t}</span>
          </button>
        ))}
      </div>
      <p className="tiny-instruction">
        Tap a flower to add it, or drag it onto the paper. Drag a stem to
        arrange it.
      </p>
      {bouquet.flowers.length > 0 && (
        <button
          className="quiet-action"
          onClick={() => {
            update((d) => ({ ...d, bouquet: { ...d.bouquet, flowers: [] } }));
            onSelect(null);
            onNote("An empty wrap. Start with a flower you love.");
          }}
        >
          Clear bouquet
        </button>
      )}
      <label className="small-label">
        Pick a stem to move it
        <select
          aria-label="Select a flower"
          value={selected || ""}
          onChange={(e) => onSelect(e.target.value || null)}
        >
          <option value="">Your stems</option>
          {bouquet.flowers.map((f, i) => (
            <option key={f.id} value={f.id}>
              {i + 1}. {f.type}
            </option>
          ))}
        </select>
      </label>
      {chosen && (
        <div className="stem-edit">
          <label>
            Turn
            <input
              type="range"
              aria-label="Flower rotation"
              min="-90"
              max="90"
              value={chosen.rotation}
              onChange={(e) => edit({ rotation: +e.target.value })}
            />
          </label>
          <label>
            Size
            <input
              type="range"
              aria-label="Flower size"
              min="60"
              max="150"
              value={chosen.size * 100}
              onChange={(e) => edit({ size: +e.target.value / 100 })}
            />
          </label>
          <div className="small-actions">
            <button
              aria-label="Move flower left"
              onClick={() => edit({ x: Math.max(8, chosen.x - 4) })}
            >
              ←
            </button>
            <button
              aria-label="Move flower right"
              onClick={() => edit({ x: Math.min(92, chosen.x + 4) })}
            >
              →
            </button>
            <button
              aria-label="Move flower up"
              onClick={() => edit({ y: Math.max(12, chosen.y - 4) })}
            >
              ↑
            </button>
            <button
              aria-label="Move flower down"
              onClick={() => edit({ y: Math.min(76, chosen.y + 4) })}
            >
              ↓
            </button>
            <button
              onClick={() => {
                update((d) => ({
                  ...d,
                  bouquet: {
                    ...d.bouquet,
                    flowers: d.bouquet.flowers.filter((f) => f.id !== selected),
                  },
                }));
                onSelect(null);
              }}
            >
              Remove
            </button>
          </div>
        </div>
      )}
      <div className="material-picks">
        <label>
          Paper
          <input
            type="color"
            aria-label="Wrapping paper colour"
            value={bouquet.wrap}
            onChange={(e) =>
              update((d) => ({
                ...d,
                bouquet: { ...d.bouquet, wrap: e.target.value },
              }))
            }
          />
        </label>
        <label>
          Ribbon
          <input
            type="color"
            aria-label="Bouquet ribbon colour"
            value={bouquet.ribbon}
            onChange={(e) =>
              update((d) => ({
                ...d,
                bouquet: { ...d.bouquet, ribbon: e.target.value },
              }))
            }
          />
        </label>
      </div>
      <label className="small-label">
        A little handwritten tag
        <input
          aria-label="Bouquet gift tag"
          value={bouquet.tag}
          maxLength={55}
          onChange={(e) =>
            update((d) => ({
              ...d,
              bouquet: { ...d.bouquet, tag: e.target.value },
            }))
          }
        />
      </label>
      <p className="hand-note">Drag the flowers. Keep the happy accidents.</p>
      {ghost && (
        <div
          className="supply-ghost flower-ghost"
          style={{ left: ghost.x, top: ghost.y }}
        >
          <svg viewBox="-40 -65 80 140">
            <FlowerArt type={ghost.type} />
          </svg>
        </div>
      )}
    </>
  );
}
