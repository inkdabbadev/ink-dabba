import { useEffect, useRef, useState } from "react";
import { useCare } from "./store";
import { careContent } from "./content";
import { clawHit } from "./logic.mjs";
import { Sprite } from "./Artwork";
import { play } from "./audio";
export const prizePositions = careContent.prizes.map((p, i) => ({
  ...p,
  x: [21, 35, 49, 64, 77, 87][i],
  y: [66, 78, 69, 80, 64, 78][i],
}));
export interface ClawMotion {
  x: number;
  y: number;
  grab: string | null;
  phase: string;
  closed: boolean;
}
export const idleClaw: ClawMotion = {
  x: 50,
  y: 18,
  grab: null,
  phase: "idle",
  closed: false,
};
export function ArcadeArt({
  claw = idleClaw,
  onAim,
  onGrab,
}: {
  claw?: ClawMotion;
  onAim?: (x: number) => void;
  onGrab?: () => void;
}) {
  const won = useCare((s) => s.data.prizes);
  return (
    <svg
      className="arcade-art"
      viewBox="0 0 300 440"
      aria-label="A miniature playable claw machine"
    >
      <g fill="none" stroke="#8e656c" strokeWidth="1.5" strokeLinejoin="round">
        <path d="m27 35 23-17h210l14 17v350l-17 35H35l-8-35Z" fill="#c88d9d" />
        <path d="m42 40 8-15h204l8 15v337l-13 23H43Z" fill="#e3b8c2" />
        <rect x="43" y="67" width="215" height="236" rx="8" fill="#f1e2d2" />
        <path d="M49 296V75h203" stroke="#efd3d1" strokeWidth="6" />
        <path d="M50 297V95m204-23v225" stroke="#a37586" strokeWidth="3" />
        <path d="m41 39 218 1-8 29H48Z" fill="#f0d49e" />
        <text
          x="150"
          y="56"
          fontSize="11"
          textAnchor="middle"
          fontFamily="Georgia"
          fill="#a2626c"
          stroke="none"
          letterSpacing="2"
        >
          LITTLE LUCK
        </text>
        <path d="M61 93h177" stroke="#b99ba6" strokeWidth="5" />
        <path
          d={`M${claw.x * 2 + 50} 94V${claw.y * 2 + 90}`}
          stroke="#b9aaa3"
          strokeWidth="3"
        />
        {prizePositions.map((p) => {
          const held = claw.grab === p.id,
            lifted = held && ["lift", "deliver"].includes(claw.phase),
            collected = won.includes(p.id);
          if (collected && !held) return null;
          return (
            <g
              key={p.id}
              transform={`translate(${lifted ? claw.x * 2 + 50 : p.x * 2 + 50} ${lifted ? claw.y * 2 + 109 : p.y * 2 + 90}) scale(.24)`}
            >
              <g transform="translate(-100 -110)">
                <Sprite kind={p.id} />
              </g>
            </g>
          );
        })}
        <g transform={`translate(${claw.x * 2 + 50} ${claw.y * 2 + 90})`}>
          <rect x="-9" y="-6" width="18" height="15" rx="3" fill="#b9b0ab" />
          <path
            d={
              claw.closed
                ? "M-5 6q-20 17 3 30M5 6q20 17-3 30"
                : "M-5 6q-26 10-15 28M5 6q26 10 15 28"
            }
            fill="none"
            stroke="#9e9695"
            strokeWidth="3"
          />
          <path d="M0 7v24" stroke="#c7b8b1" strokeWidth="2" />
        </g>
        <path
          d="M59 78v82m0 13v27"
          stroke="#fffaf0"
          opacity=".55"
          strokeWidth="5"
        />
        <path d="m44 307 213 1 6 39H38Z" fill="#eac5b2" />
        <ellipse cx="98" cy="326" rx="16" ry="8" fill="#c38a91" />
        <path d="M98 327v-21" stroke="#9b646e" strokeWidth="5" />
        <circle cx="98" cy="302" r="9" fill="#ae5f72" />
        <ellipse cx="198" cy="327" rx="17" ry="8" fill="#c38a91" />
        <ellipse cx="198" cy="322" rx="13" ry="6" fill="#f0d493" />
        <path d="M78 363h141v39H78Z" fill="#a46c7d" />
        <path d="M85 368h127v25H85Z" fill="#725760" />
        <path d="M45 414v11h26v-11m159 0v11h26v-11" fill="#ad7b87" />
      </g>
      {onAim && (
        <rect
          x="50"
          y="80"
          width="200"
          height="217"
          fill="transparent"
          style={{ cursor: "crosshair" }}
          onPointerDown={(e) => {
            if (claw.phase !== "idle") return;
            const svg = e.currentTarget.ownerSVGElement!,
              p = svg.createSVGPoint();
            p.x = e.clientX;
            p.y = e.clientY;
            const m = svg.getScreenCTM();
            if (m)
              onAim(
                Math.max(
                  10,
                  Math.min(90, (p.matrixTransform(m.inverse()).x - 50) / 2),
                ),
              );
          }}
        />
      )}
      {onGrab && (
        <rect
          x="175"
          y="306"
          width="49"
          height="35"
          fill="transparent"
          style={{ cursor: "pointer" }}
          onPointerDown={(e) => {
            e.stopPropagation();
            onGrab();
          }}
        />
      )}
    </svg>
  );
}
export function useClaw(active: boolean, onNotice: (s: string) => void) {
  const [claw, setClaw] = useState(idleClaw),
    [reward, setReward] = useState<string | null>(null),
    raf = useRef(0),
    idleRaf = useRef(0),
    motion = useRef(idleClaw),
    heldDirection = useRef(0);
  function commit(c: ClawMotion) {
    motion.current = c;
    setClaw(c);
  }
  useEffect(() => {
    if (!active) {
      cancelAnimationFrame(raf.current);
      motion.current = { ...idleClaw };
      setClaw({ ...idleClaw });
    }
    let last = performance.now();
    function tick(t: number) {
      const dt = Math.min((t - last) / 1000, 0.05);
      last = t;
      if (heldDirection.current && motion.current.phase === "idle")
        commit({
          ...motion.current,
          x: Math.max(
            10,
            Math.min(90, motion.current.x + heldDirection.current * dt * 35),
          ),
        });
      idleRaf.current = requestAnimationFrame(tick);
    }
    if (active) idleRaf.current = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(idleRaf.current);
      heldDirection.current = 0;
    };
  }, [active]);
  useEffect(() => {
    const stop = () => {
      heldDirection.current = 0;
    };
    window.addEventListener("pointerup", stop);
    window.addEventListener("pointercancel", stop);
    window.addEventListener("blur", stop);
    return () => {
      cancelAnimationFrame(raf.current);
      window.removeEventListener("pointerup", stop);
      window.removeEventListener("pointercancel", stop);
      window.removeEventListener("blur", stop);
    };
  }, []);
  function aim(x: number) {
    if (motion.current.phase === "idle")
      commit({ ...motion.current, x: Math.max(10, Math.min(90, x)) });
  }
  function grab() {
    if (motion.current.phase !== "idle") return;
    heldDirection.current = 0;
    setReward(null);
    const start = motion.current.x,
      saved = useCare.getState().data.prizes;
    const pool = prizePositions.map((p) => ({
      ...p,
      collected: saved.includes(p.id),
    }));
    if (pool.every((p) => p.collected)) {
      onNotice(
        "All six little friends are yours. The machine is open for encore hugs.",
      );
      const repeat = prizePositions.reduce((a, b) =>
        Math.abs(a.x - start) < Math.abs(b.x - start) ? a : b,
      );
      setReward(repeat.id);
      play("win");
      return;
    }
    const hit = clawHit(start, pool, 12);
    const lowered = hit ? hit.y - 8 : 70;
    const reduced = useCare.getState().data.reduced;
    const dur = reduced ? 320 : 2100,
      begin = performance.now();
    play("drop");
    function animate(now: number) {
      const p = Math.min(1, (now - begin) / dur);
      let c: ClawMotion;
      if (p < 0.35)
        c = {
          x: start,
          y: 18 + (lowered - 18) * (p / 0.35),
          grab: null,
          phase: "lower",
          closed: false,
        };
      else if (p < 0.46)
        c = {
          x: start,
          y: lowered,
          grab: hit?.id || null,
          phase: "grab",
          closed: true,
        };
      else if (p < 0.72)
        c = {
          x: start,
          y: lowered - ((lowered - 18) * (p - 0.46)) / 0.26,
          grab: hit?.id || null,
          phase: "lift",
          closed: true,
        };
      else
        c = {
          x: start + ((22 - start) * (p - 0.72)) / 0.28,
          y: 18,
          grab: hit?.id || null,
          phase: "deliver",
          closed: true,
        };
      commit(c);
      if (p < 1) raf.current = requestAnimationFrame(animate);
      else {
        if (hit) {
          useCare.getState().update((d) => ({
            ...d,
            prizes: [...new Set([...d.prizes, hit.id])],
          }));
          setReward(hit.id);
          onNotice("A tiny friend, delivered. Tap it to keep it on the table.");
          play("win");
        } else {
          onNotice(
            "A little near-miss. Try aiming above a plush friend. No coins needed.",
          );
          play("miss");
        }
        commit({ ...idleClaw, x: 22 });
      }
    }
    cancelAnimationFrame(raf.current);
    raf.current = requestAnimationFrame(animate);
  }
  return { claw, reward, setReward, aim, grab, direction: heldDirection };
}
export function ArcadeTools({
  claw,
  aim,
  grab,
  direction,
  reward,
  onKeep,
}: {
  claw: ClawMotion;
  aim: (x: number) => void;
  grab: () => void;
  direction: React.MutableRefObject<number>;
  reward: string | null;
  onKeep: (id: string) => void;
}) {
  const prizes = useCare((s) => s.data.prizes);
  const prize = careContent.prizes.find((p) => p.id === reward);
  return (
    <>
      <p className="eyebrow">A VERY GENEROUS PRIZE POLICY</p>
      <h2>
        A little luck.
        <br />
        <em>All yours.</em>
      </h2>
      <label className="small-label">
        Slide the claw
        <input
          type="range"
          aria-label="Claw horizontal position"
          min="10"
          max="90"
          value={claw.x}
          disabled={claw.phase !== "idle"}
          onChange={(e) => aim(+e.target.value)}
        />
      </label>
      <div className="claw-controls">
        <button
          aria-label="Move claw left"
          disabled={claw.phase !== "idle"}
          onPointerDown={(e) => {
            direction.current = -1;
            e.currentTarget.setPointerCapture(e.pointerId);
          }}
          onPointerUp={() => (direction.current = 0)}
          onPointerCancel={() => (direction.current = 0)}
          onClick={() => aim(claw.x - 6)}
        >
          ←
        </button>
        <button
          className="grab-button"
          onClick={grab}
          disabled={claw.phase !== "idle"}
        >
          {claw.phase === "idle" ? "Grab a little joy" : "Here we go…"}
        </button>
        <button
          aria-label="Move claw right"
          disabled={claw.phase !== "idle"}
          onPointerDown={(e) => {
            direction.current = 1;
            e.currentTarget.setPointerCapture(e.pointerId);
          }}
          onPointerUp={() => (direction.current = 0)}
          onPointerCancel={() => (direction.current = 0)}
          onClick={() => aim(claw.x + 6)}
        >
          →
        </button>
      </div>
      <p className="hand-note">No coins. No pressure. Have another go.</p>
      {prize && (
        <div className="prize-ticket" role="status">
          <Sprite kind={prize.id} />
          <h3>{prize.name}</h3>
          <p>{prize.message}</p>
          <button onClick={() => onKeep(prize.id)}>
            Keep this prize in the box
          </button>
        </div>
      )}
      <div className="prize-stamps" aria-label="Your collected prizes">
        {careContent.prizes.map((p) => (
          <button
            type="button"
            disabled={!prizes.includes(p.id)}
            aria-label={"Keep " + p.name}
            onClick={() => onKeep(p.id)}
            key={p.id}
            className={prizes.includes(p.id) ? "collected" : ""}
            title={p.name}
          >
            <Sprite kind={p.id} />
          </button>
        ))}
      </div>
      <p className="tiny-instruction">
        {prizes.length} little things collected. Yours on every visit.
      </p>
    </>
  );
}
