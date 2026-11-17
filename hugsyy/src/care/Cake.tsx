import { useEffect, useRef, useState, type PointerEvent } from "react";
import { useCare } from "./store";
import { Sprite } from "./Artwork";
import { play } from "./audio";
import type { CareData, IcingPath, Topper } from "./types";
import { CandleBlower } from "./CandleBlower";
export const cakeColors = {
  vanilla: "#e0bc88",
  chocolate: "#8e6650",
  strawberry: "#d69aa3",
};
export const toppings = [
  "cherry",
  "strawberry",
  "sprinkle",
  "flower",
  "star",
  "candle",
  "penguin",
  "elephant",
];
export function cakePoint(
  svg: SVGSVGElement,
  clientX: number,
  clientY: number,
) {
  const p = svg.createSVGPoint();
  p.x = clientX;
  p.y = clientY;
  const m = svg.getScreenCTM();
  if (!m) return null;
  const v = p.matrixTransform(m.inverse());
  const x = v.x / 3,
    y = (v.y - 35) / 2.1;
  if (((v.x - 150) / 126) ** 2 + ((v.y - 110) / 72) ** 2 > 1.05) return null;
  return { x: Math.max(12, Math.min(88, x)), y: Math.max(15, Math.min(85, y)) };
}
export function CakeArt({
  interactive = false,
  tool = "cherry",
  selected,
  onSelect,
  onRemember,
}: {
  interactive?: boolean;
  tool?: string;
  selected?: string | null;
  onSelect?: (id: string | null) => void;
  onRemember?: () => void;
}) {
  const cake = useCare((s) => s.data.cake),
    update = useCare((s) => s.update),
    svg = useRef<SVGSVGElement>(null),
    drawing = useRef<IcingPath | null>(null),
    moving = useRef<string | null>(null),
    [live, setLive] = useState<IcingPath | null>(null);
  const base = cakeColors[cake.base as keyof typeof cakeColors];
  function place(e: PointerEvent<SVGSVGElement>) {
    if (!interactive || e.button !== 0) return;
    const p = cakePoint(e.currentTarget, e.clientX, e.clientY);
    if (!p) return;
    e.stopPropagation();
    onRemember?.();
    e.currentTarget.setPointerCapture(e.pointerId);
    if (tool === "pipe") {
      drawing.current = {
        id: crypto.randomUUID(),
        color: cake.icing,
        width: 4,
        points: [p],
      };
      setLive({ ...drawing.current });
      play("pipe");
    } else if (cake.toppers.length < 80) {
      const t: Topper = {
        id: crypto.randomUUID(),
        type: tool,
        x: p.x,
        y: p.y,
        rotation: 0,
        size: 1,
      };
      update((d) => ({
        ...d,
        cake: { ...d.cake, toppers: [...d.cake.toppers, t] },
      }));
      onSelect?.(t.id);
      play("pick");
    }
  }
  function finish() {
    if (drawing.current) {
      const path = drawing.current;
      update((d) => ({
        ...d,
        cake: { ...d.cake, paths: [...d.cake.paths, path].slice(-100) },
      }));
      drawing.current = null;
      setLive(null);
    }
    moving.current = null;
  }
  const pathD = (p: IcingPath) =>
    p.points
      .map((v, i) => (i ? "L" : "M") + v.x * 3 + " " + (35 + v.y * 2.1))
      .join(" ");
  return (
    <svg
      ref={svg}
      data-cake-surface={interactive ? "active" : "mini"}
      className="cake-art"
      viewBox="0 0 300 320"
      aria-label="Your decorated birthday cake"
      onPointerDown={place}
      onPointerMove={(e) => {
        if (!interactive) return;
        const p = cakePoint(e.currentTarget, e.clientX, e.clientY);
        if (!p) return;
        if (moving.current) {
          update((d) => ({
            ...d,
            cake: {
              ...d.cake,
              toppers: d.cake.toppers.map((t) =>
                t.id === moving.current ? { ...t, ...p } : t,
              ),
            },
          }));
        } else if (drawing.current) {
          const a = drawing.current.points,
            last = a.at(-1)!;
          if (Math.hypot(p.x - last.x, p.y - last.y) < 0.5) return;
          a.push(p);
          setLive({ ...drawing.current, points: [...a] });
        }
      }}
      onPointerUp={finish}
      onPointerCancel={finish}
    >
      <ellipse
        cx="150"
        cy="275"
        rx="145"
        ry="36"
        fill="#e5d8c2"
        stroke="#c6af97"
      />
      <ellipse
        cx="150"
        cy="268"
        rx="133"
        ry="29"
        fill="#f7eddb"
        stroke="#d8c7ac"
      />
      <path
        d="M25 111v109c0 76 250 76 250 0V111Z"
        fill={base}
        stroke="#a38068"
        strokeWidth="1.5"
      />
      <path
        d="M26 170q124 69 248 0v10q-124 68-248 0Z"
        fill={cake.frost}
        opacity=".8"
      />
      <path
        d="M25 109v34q4 23 17 10l2 30q8 26 18 0l1-21q10 8 20 0l2 17q9 31 19 0v-8q22 7 37 2v24q10 25 20-2v-21q20-3 30-9v17q8 27 18 0v-22q13-4 24-14v16q9 24 17 0v-32Z"
        fill={cake.frost}
        stroke="#be899c"
        strokeWidth="1"
      />
      <ellipse
        cx="150"
        cy="110"
        rx="125"
        ry="72"
        fill={cake.frost}
        stroke="#b98b9d"
        strokeWidth="1.4"
      />
      <ellipse
        cx="150"
        cy="110"
        rx="117"
        ry="64"
        fill="none"
        stroke="#fff4e7"
        strokeWidth="2"
        opacity=".3"
      />
      {Array.from({ length: 24 }, (_, i) => {
        const a = (i / 24) * Math.PI * 2;
        return (
          <ellipse
            key={i}
            cx={150 + Math.cos(a) * 120}
            cy={240 + Math.sin(a) * 28}
            rx="7"
            ry="5"
            fill="#f6ead7"
            stroke="#d6c1a4"
            strokeWidth=".6"
          />
        );
      })}
      {cake.paths.concat(live ? [live] : []).map((p) => (
        <path
          key={p.id}
          d={pathD(p)}
          stroke={p.color}
          strokeWidth={p.width}
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
          pointerEvents="none"
        />
      ))}
      {cake.toppers.map((t) => (
        <g
          key={t.id}
          data-topper={t.id}
          className={interactive ? "cake-topper editable" : ""}
          transform={`translate(${t.x * 3} ${35 + t.y * 2.1}) rotate(${t.rotation}) scale(${t.size})`}
          onPointerDown={(e) => {
            if (!interactive) return;
            if (tool === "pipe") return;
            e.stopPropagation();
            e.preventDefault();
            onRemember?.();
            moving.current = t.id;
            onSelect?.(t.id);
            e.currentTarget.setPointerCapture(e.pointerId);
          }}
        >
          <g
            transform={
              t.type === "sprinkle"
                ? "translate(-17 -14) scale(.18)"
                : t.type === "candle"
                  ? "translate(-10 -63) scale(.12 .32)"
                  : "translate(-19 -41) scale(.2)"
            }
          >
            {t.type === "sprinkle" ? (
              <svg viewBox="0 0 200 220" width="200" height="220">
                {Array.from({ length: 16 }, (_, i) => (
                  <path
                    key={i}
                    d={`M${(i * 47) % 170} ${((i * 31) % 130) + 30}l8 6`}
                    stroke={["#f4e1b5", "#b887ae", "#b15569", "#9eaf88"][i % 4]}
                    strokeWidth="7"
                    strokeLinecap="round"
                  />
                ))}
              </svg>
            ) : (
              <Sprite kind={t.type} lit={cake.lit} />
            )}
          </g>
          {interactive && selected === t.id && (
            <ellipse
              cy="-8"
              rx="23"
              ry="21"
              fill="none"
              stroke="#876797"
              strokeWidth=".8"
              strokeDasharray="2 3"
            />
          )}
        </g>
      ))}
      {interactive && (
        <path d="M70 278q80 17 160 0" stroke="#c6b39a" fill="none" />
      )}
    </svg>
  );
}
export function CakeTools({
  tool,
  onTool,
  selected,
  onSelect,
  remember,
  onUndo,
  onRedo,
  undoable,
  redoable,
  onNotice,
}: {
  tool: string;
  onTool: (t: string) => void;
  selected: string | null;
  onSelect: (s: string | null) => void;
  remember: () => void;
  onUndo: () => void;
  onRedo: () => void;
  undoable: boolean;
  redoable: boolean;
  onNotice: (s: string) => void;
}) {
  const cake = useCare((s) => s.data.cake),
    update = useCare((s) => s.update);
  const [ghost, setGhost] = useState<{
      x: number;
      y: number;
      type: string;
    } | null>(null),
    chosen = cake.toppers.find((t) => t.id === selected);
  function add(
    type: string,
    p = { x: 40 + Math.random() * 20, y: 30 + Math.random() * 20 },
  ) {
    if (useCare.getState().data.cake.toppers.length >= 80) {
      onNotice("A very decorated cake. Remove something to make room.");
      return;
    }
    remember();
    const t = { id: crypto.randomUUID(), type, ...p, rotation: 0, size: 1 };
    update((d) => ({
      ...d,
      cake: { ...d.cake, toppers: [...d.cake.toppers, t] },
    }));
    onSelect(t.id);
    play("pick");
  }
  function edit(p: Partial<Topper>) {
    update((d) => ({
      ...d,
      cake: {
        ...d.cake,
        toppers: d.cake.toppers.map((t) =>
          t.id === selected ? { ...t, ...p } : t,
        ),
      },
    }));
  }
  const supplyCleanup = useRef<(() => void) | null>(null);
  useEffect(() => () => supplyCleanup.current?.(), []);
  function startSupply(e: PointerEvent<HTMLButtonElement>, type: string) {
    if (e.button !== 0) return;
    e.preventDefault();
    supplyCleanup.current?.();
    const x = e.clientX,
      y = e.clientY,
      id = e.pointerId;
    const cancel = () => {
      supplyCleanup.current?.();
      setGhost(null);
    };
    const move = (event: globalThis.PointerEvent) => {
      if (
        event.pointerId === id &&
        Math.hypot(event.clientX - x, event.clientY - y) > 7
      )
        setGhost({ x: event.clientX, y: event.clientY, type });
    };
    const up = (event: globalThis.PointerEvent) => {
      if (event.pointerId !== id) return;
      cancel();
      onTool(type);
      if (Math.hypot(event.clientX - x, event.clientY - y) <= 7) return;
      const svg = document.querySelector<SVGSVGElement>(
        "[data-cake-surface=active]",
      );
      const canvas = document.querySelector<
        HTMLCanvasElement & {
          cakeDrop?: (x: number, y: number) => { x: number; y: number } | null;
        }
      >('.dialog-cake canvas[data-toy="cake"]');
      const point = svg
        ? cakePoint(svg, event.clientX, event.clientY)
        : canvas?.cakeDrop?.(event.clientX, event.clientY);
      if (point) add(type, point);
      else onNotice("Drop the little topper onto the icing.");
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
      <p className="eyebrow">A SMALL SLICE OF HAPPINESS</p>
      <h2>
        Extra cherries.
        <br />
        <em>Always.</em>
      </h2>
      <div className="small-actions flavor-picks">
        {Object.entries(cakeColors).map(([id, c]) => (
          <button
            key={id}
            aria-pressed={cake.base === id}
            onClick={() => {
              remember();
              update((d) => ({ ...d, cake: { ...d.cake, base: id } }));
            }}
          >
            <i style={{ background: c }} />
            {id}
          </button>
        ))}
      </div>
      <div className="swatch-row">
        <span>Frosting</span>
        {["#e9afc0", "#f4e5c3", "#96715e", "#c8b6d8"].map((c) => (
          <button
            key={c}
            aria-label={"Frosting " + c}
            aria-pressed={cake.frost === c}
            style={{ background: c }}
            onClick={() => {
              remember();
              update((d) => ({ ...d, cake: { ...d.cake, frost: c } }));
            }}
          />
        ))}
      </div>
      <div className="pipe-pick">
        <button aria-pressed={tool === "pipe"} onClick={() => onTool("pipe")}>
          Draw with icing
        </button>
        <input
          type="color"
          aria-label="Piping icing colour"
          value={cake.icing}
          onPointerDown={remember}
          onChange={(e) =>
            update((d) => ({
              ...d,
              cake: { ...d.cake, icing: e.target.value },
            }))
          }
        />
      </div>
      <div className="topper-supply">
        {toppings.map((t) => (
          <button
            key={t}
            aria-label={"Use " + t + " topper"}
            aria-pressed={tool === t}
            onPointerDown={(e) => startSupply(e, t)}
            onClick={() => onTool(t)}
          >
            <Sprite kind={t} />
            <small>{t}</small>
          </button>
        ))}
      </div>
      <p className="tiny-instruction">
        Drag a topper onto the cake, or pick one & tap the icing.
      </p>
      <button
        className="ink-button"
        onClick={() => add(tool === "pipe" ? "cherry" : tool)}
      >
        Place one for me
      </button>
      {chosen && (
        <div className="stem-edit">
          <label>
            Size
            <input
              aria-label="Topper size"
              type="range"
              min="50"
              max="160"
              value={chosen.size * 100}
              onPointerDown={remember}
              onChange={(e) => edit({ size: +e.target.value / 100 })}
            />
          </label>
          <label>
            Turn
            <input
              aria-label="Topper rotation"
              type="range"
              min="-180"
              max="180"
              value={chosen.rotation}
              onPointerDown={remember}
              onChange={(e) => edit({ rotation: +e.target.value })}
            />
          </label>
          <div className="small-actions">
            <button
              aria-label="Move topper left"
              onClick={() => {
                remember();
                edit({ x: Math.max(12, chosen.x - 4) });
              }}
            >
              ←
            </button>
            <button
              aria-label="Move topper right"
              onClick={() => {
                remember();
                edit({ x: Math.min(88, chosen.x + 4) });
              }}
            >
              →
            </button>
            <button
              aria-label="Move topper up"
              onClick={() => {
                remember();
                edit({ y: Math.max(15, chosen.y - 4) });
              }}
            >
              ↑
            </button>
            <button
              aria-label="Move topper down"
              onClick={() => {
                remember();
                edit({ y: Math.min(85, chosen.y + 4) });
              }}
            >
              ↓
            </button>
            <button
              onClick={() => {
                remember();
                update((d) => ({
                  ...d,
                  cake: {
                    ...d.cake,
                    toppers: d.cake.toppers.filter((t) => t.id !== selected),
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
      <div className="small-actions history">
        <button disabled={!undoable} onClick={onUndo}>
          Undo
        </button>
        <button disabled={!redoable} onClick={onRedo}>
          Redo
        </button>
        <button
          onClick={() => {
            const current = useCare.getState().data.cake;
            if (
              !current.lit &&
              !current.toppers.some((t) => t.type === "candle") &&
              current.toppers.length >= 80
            ) {
              onNotice("Remove a topper to make room for your candle.");
              return;
            }
            remember();
            update((d) => ({
              ...d,
              cake: {
                ...d.cake,
                lit: !d.cake.lit,
                toppers:
                  !d.cake.lit &&
                  !d.cake.toppers.some((t) => t.type === "candle")
                    ? [
                        ...d.cake.toppers,
                        {
                          id: crypto.randomUUID(),
                          type: "candle",
                          x: 50,
                          y: 40,
                          rotation: 0,
                          size: 1,
                        },
                      ]
                    : d.cake.toppers,
              },
            }));
            play("magic");
          }}
        >
          {cake.lit ? "Blow out" : "Light candles"}
        </button>
      </div>
      <CandleBlower
        lit={cake.lit && cake.toppers.some((t) => t.type === "candle")}
        onBlow={() => {
          remember();
          update((d) => ({ ...d, cake: { ...d.cake, lit: false } }));
          onNotice("A little wish, just for you.");
        }}
      />
      {ghost && (
        <div className="supply-ghost" style={{ left: ghost.x, top: ghost.y }}>
          <Sprite kind={ghost.type} />
        </div>
      )}
    </>
  );
}
export type CakeHistory = CareData["cake"];
