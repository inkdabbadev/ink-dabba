"use client";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, MotionConfig } from "motion/react";
import { useCare } from "./store";
import { careContent } from "./content";
import { finalAvailable } from "./logic.mjs";
import { play } from "./audio";
import { Sprite, FlowerArt, ButterflyArt } from "./Artwork";
import { InteractiveObject } from "./InteractiveObject";
import { BouquetArt, FlowerTools } from "./Bouquet";
import { CakeArt, CakeTools, type CakeHistory } from "./Cake";
import { ArcadeArt, ArcadeTools, useClaw } from "./Arcade";
import type { TableObject } from "./types";
function Unwrap({
  ready,
  done,
  onAction,
  children,
  className,
  label,
}: {
  ready: boolean;
  done: boolean;
  onAction: () => void;
  children: React.ReactNode;
  className: string;
  label: string;
}) {
  const start = useRef<{ x: number; y: number } | null>(null);
  return (
    <button
      className={className + (done ? " done" : "")}
      aria-label={label}
      aria-disabled={!ready}
      onPointerDown={(e) => {
        if (!ready || done) return;
        start.current = { x: e.clientX, y: e.clientY };
        e.currentTarget.setPointerCapture(e.pointerId);
      }}
      onPointerUp={(e) => {
        if (!ready || done) return;
        const s = start.current;
        start.current = null;
        if (s) onAction();
        e.currentTarget.releasePointerCapture(e.pointerId);
      }}
      onKeyDown={(e) => {
        if ((e.key === "Enter" || e.key === " ") && ready && !done) {
          e.preventDefault();
          onAction();
        }
      }}
      onClick={(e) => {
        if (e.detail === 0 && ready && !done) onAction();
      }}
    >
      {children}
    </button>
  );
}
function Letter({
  focused,
  isFinal = false,
  onClose,
  onCelebrate,
}: {
  focused: boolean;
  isFinal?: boolean;
  onClose: () => void;
  onCelebrate?: () => void;
}) {
  const stage = useCare((s) => s.data.letterStage),
    update = useCare((s) => s.update);
  const [finalSheet, setFinalSheet] = useState(false);
  useEffect(() => {
    if (isFinal && focused && !finalSheet) {
      setFinalSheet(true);
      onCelebrate?.();
    }
  }, [focused, isFinal, finalSheet, onCelebrate]);
  if (!focused) return <Sprite kind={isFinal ? "final" : "letter"} />;
  const openStage = isFinal ? 3 : stage;
  return (
    <div className={"letter-object stage-" + openStage} data-no-drag>
      <div className="letter-sleeve">
        <Sprite kind={isFinal ? "final" : "letter"} />
      </div>
      {openStage < 3 ? (
        <div className="folded-paper">
          <span>dear JV,</span>
          <div className="paper-fold-line" />
          <small>
            {openStage === 1
              ? "A little note, tucked inside."
              : "A few words, folded with care."}
          </small>
          <button
            onClick={() => {
              update((d) => ({
                ...d,
                letterStage: Math.min(3, d.letterStage + 1),
              }));
              play("paper");
            }}
          >
            {openStage === 1 ? "Pull the letter out" : "Unfold the paper"}{" "}
            <i>↗</i>
          </button>
        </div>
      ) : (
        <motion.article
          className="birthday-paper"
          initial={{ rotateX: 35, opacity: 0 }}
          animate={{ rotateX: 0, opacity: 1 }}
          transition={{ duration: 0.45 }}
        >
          <span className="paper-edition">
            {isFinal ? "ONE LAST LITTLE SOMETHING" : "A NOTE FOR YOUR POCKET"}
          </span>
          <div className="paper-doodles">
            <Sprite kind="cherry" />
            <Sprite kind="penguin" />
          </div>
          <div
            className="letter-reading"
            tabIndex={0}
            aria-label={
              isFinal ? "Final birthday message" : "Handwritten birthday letter"
            }
          >
            {(isFinal ? careContent.closing : careContent.letter)
              .split("\n\n")
              .map((p, i) => (
                <p key={i} className={i === 0 ? "salutation" : ""}>
                  {p}
                </p>
              ))}
          </div>
          <button
            className="fold-letter"
            onClick={() => {
              if (isFinal) {
                onClose();
              } else update((d) => ({ ...d, letterStage: 1 }));
              play("paper");
            }}
          >
            {isFinal ? "Keep playing" : "Fold it again"} <span>↙</span>
          </button>
        </motion.article>
      )}
    </div>
  );
}
function Celebration({ seed }: { seed: number }) {
  const ref = useRef<HTMLCanvasElement>(null),
    reduced = useCare((s) => s.data.reduced);
  useEffect(() => {
    if (reduced) return;
    const c = ref.current!,
      ctx = c.getContext("2d")!,
      w = innerWidth,
      h = innerHeight;
    c.width = w;
    c.height = h;
    const start = performance.now();
    let raf = 0;
    function frame(t: number) {
      const p = (t - start) / 4000;
      ctx.clearRect(0, 0, w, h);
      for (let i = 0; i < 65; i++) {
        const x = (((i * 137 + Math.sin(p * 7 + i) * 45) % w) + w) % w,
          y = p * (h + 160) - (i % 9) * 35;
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(p * 6 + i);
        ctx.fillStyle = ["#c2add0", "#e5c783", "#d19aaa", "#a7b695"][i % 4];
        ctx.fillRect(-2, -4, 4, 8);
        ctx.restore();
        if (i % 7 === 0) {
          ctx.save();
          ctx.translate(x, y - 20);
          const wing = 3 + Math.abs(Math.sin(t * 0.012 + i)) * 6;
          ctx.fillStyle = i % 2 ? "#c4afd4" : "#e6ce91";
          ctx.fillRect(-wing - 1, -3, wing, 8);
          ctx.fillRect(1, -3, wing, 8);
          ctx.fillStyle = "#87708d";
          ctx.fillRect(-1, -3, 2, 11);
          ctx.restore();
        }
      }
      if (p < 1.4) raf = requestAnimationFrame(frame);
    }
    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, [seed, reduced]);
  return <canvas ref={ref} className="birthday-confetti" aria-hidden="true" />;
}
export default function CarePackage() {
  const { data, ready, error, load, update, visit, raise } = useCare(),
    viewport = useRef<HTMLDivElement>(null),
    [size, setSize] = useState({ w: 1200, h: 850 }),
    [focus, setFocus] = useState<string | null>(null),
    [note, setNote] = useState(""),
    [flower, setFlower] = useState<string | null>(null),
    [topper, setTopper] = useState<string | null>(null),
    [tool, setTool] = useState("cherry"),
    [settings, setSettings] = useState(false),
    [reaction, setReaction] = useState(""),
    [eleFlower, setEleFlower] = useState(false),
    [celebrate, setCelebrate] = useState(0),
    [hrev, setHrev] = useState(0);
  const undo = useRef<CakeHistory[]>([]),
    redo = useRef<CakeHistory[]>([]),
    closeRef = useRef<HTMLButtonElement>(null),
    claw = useClaw(focus === "arcade", setNote);
  useEffect(load, [load]);
  useEffect(() => {
    const el = viewport.current;
    if (!el) return;
    const obs = new ResizeObserver(([r]) =>
      setSize({ w: r.contentRect.width, h: r.contentRect.height }),
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [ready]);
  useEffect(() => {
    document.documentElement.dataset.motion = data.reduced ? "reduced" : "full";
    document.documentElement.dataset.readable = data.readable ? "yes" : "no";
  }, [data.reduced, data.readable]);
  useEffect(() => {
    if (focus) closeRef.current?.focus({ preventScroll: true });
    const key = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setFocus(null);
        setNote("");
      }
    };
    window.addEventListener("keydown", key);
    return () => window.removeEventListener("keydown", key);
  }, [focus]);
  const mobile = size.w < 760,
    bw = mobile ? 900 : 1200,
    bh = mobile ? 1190 : 900,
    fit = Math.min((size.w - 24) / bw, (size.h - 40) / bh, 1.05),
    baseScale = fit * (data.parcel.lid ? 1 : 1.06),
    obj = data.objects.find((o) => o.id === focus);
  let z = baseScale,
    tx = (size.w - bw * z) / 2,
    ty = (size.h - bh * z) / 2;
  if (obj) {
    const dims =
      focus === "letter" || focus === "final"
        ? { w: 420, h: 550 }
        : { w: obj.metadata.w * 1.2, h: obj.metadata.h * 1.2 };
    const availableH = mobile ? size.h * 0.56 : size.h - 130;
    z = Math.min(
      mobile ? 1.8 : 2.4,
      (mobile ? size.w - 30 : size.w - 365) / dims.w,
      availableH / dims.h,
    );
    tx =
      (mobile ? size.w / 2 : (size.w - 320) / 2) -
      (obj.position.x / 1000) * bw * z;
    ty =
      (mobile ? size.h * 0.33 : size.h * 0.49) -
      (obj.position.y / 1000) * bh * z;
  }
  const available = finalAvailable(data.visited, data.prizes);
  function open(id: string) {
    raise(id);
    setFocus(id);
    visit(id);
    setNote("");
    if (id === "letter" && data.letterStage === 0)
      update((d) => ({ ...d, letterStage: 1 }));
    if (id === "coffee") setNote(careContent.coffee);
    if (id === "penguin") setNote(careContent.penguin);
    if (id === "elephant") setNote(careContent.elephant);
    if (["rose", "robot"].includes(id))
      setNote(careContent[id as "rose" | "robot"]);
    if (id === "car") {
      setNote(careContent.car);
      setReaction("car");
      update((d) => ({
        ...d,
        objects: d.objects.map((o) =>
          o.id === "car"
            ? {
                ...o,
                position: { ...o.position, x: o.position.x > 650 ? 200 : 820 },
              }
            : o,
        ),
      }));
    }
    if (["penguin", "elephant"].includes(id)) {
      setReaction(id);
      setTimeout(() => setReaction(""), 1400);
    }
    play(id === "letter" ? "paper" : "pick");
  }
  function close() {
    setFocus(null);
    setNote("");
    setFlower(null);
    setTopper(null);
    setTimeout(
      () =>
        document
          .querySelector<HTMLElement>(`[data-object="${focus}"]`)
          ?.focus({ preventScroll: true }),
      450,
    );
  }
  function unwrap(key: keyof typeof data.parcel) {
    update((d) => ({ ...d, parcel: { ...d.parcel, [key]: true } }));
    play(key === "tape" ? "tape" : key === "ribbon" ? "ribbon" : "paper");
  }
  function remember() {
    undo.current.push(structuredClone(useCare.getState().data.cake));
    if (undo.current.length > 35) undo.current.shift();
    redo.current = [];
    setHrev(hrev + 1);
  }
  function history(back: boolean) {
    const a = back ? undo.current : redo.current,
      b = back ? redo.current : undo.current;
    if (!a.length) return;
    b.push(structuredClone(useCare.getState().data.cake));
    const prev = a.pop()!;
    update((d) => ({ ...d, cake: prev }));
    setTopper(null);
    setHrev(hrev + 1);
  }
  function keepPrize(id: string) {
    const existing = data.objects.find((o) => o.id === "prize-" + id);
    if (existing) {
      raise(existing.id);
      setNote("Your little friend is already on the table.");
    } else {
      const base: TableObject = {
        id: "prize-" + id,
        type: id,
        position: { x: 780, y: 750 - data.prizes.indexOf(id) * 40 },
        rotation: -10 + data.prizes.indexOf(id) * 9,
        scale: 0.8,
        zIndex: Math.max(...data.objects.map((o) => o.zIndex)) + 1,
        draggable: true,
        interactive: true,
        interactionState: "idle",
        collected: true,
        completed: true,
        metadata: { w: 105, h: 120 },
      };
      update((d) => ({ ...d, objects: [...d.objects, base] }));
      setNote("A new little friend, just outside the box.");
    }
    play("drop");
  }
  if (!ready)
    return (
      <main className="care-loading">
        <span>jv.</span>
        <p>A little something is on its way…</p>
      </main>
    );
  return (
    <MotionConfig reducedMotion={data.reduced ? "always" : "never"}>
      <main
        className={
          "care-world " +
          (focus ? "object-focused" : "") +
          (data.finalOpened ? " birthday-glow" : "")
        }
      >
        <div className="table-heading">
          <span className="table-monogram">
            jv<span>’s little world</span>
          </span>
          <p>A FEW THINGS, JUST BECAUSE.</p>
        </div>
        <div className="discreet-controls">
          <button
            aria-label={
              data.sound ? "Mute little sounds" : "Enable little sounds"
            }
            aria-pressed={data.sound}
            onClick={() => {
              update((d) => ({ ...d, sound: !d.sound }));
              play("pick");
            }}
          >
            {data.sound ? "sound on" : "sound off"}
            <span className="sound-bars">ııı</span>
          </button>
          <button
            aria-label="Comfort and reset settings"
            onClick={() => setSettings(!settings)}
          >
            ···
          </button>
        </div>
        <div
          className="table-viewport"
          ref={viewport}
          aria-label="An interactive birthday care package on a tabletop"
        >
          <div className="tablecloth" />
          <div className="table-corner-note">
            <span>
              some things are better
              <br />
              when you can play with them.
            </span>
            <i>↗</i>
          </div>
          <motion.div
            className="camera-board"
            style={{ width: bw, height: bh }}
            animate={{ x: tx, y: ty, scale: z }}
            initial={false}
            transition={
              data.reduced
                ? { duration: 0 }
                : { type: "spring", stiffness: 85, damping: 24, mass: 1.1 }
            }
          >
            <div
              className="parcel-bottom"
              style={{
                left: bw * 0.13,
                top: bh * 0.21,
                width: bw * 0.74,
                height: bh * 0.59,
              }}
            >
              <div className="box-depth" />
              <div className="box-inside" />
              <div className="inside-message">
                a little bit of everything you love.
              </div>
              <div className="tissue-underlay" />
              <div className="cardboard-edge top" />
              <div className="cardboard-edge left" />
              <div className="cardboard-edge right" />
              <div className="cardboard-edge bottom" />
            </div>
            <div
              className="under-coffee"
              style={{ left: bw * 0.195 - 65, top: bh * 0.378 - 25 }}
            >
              a good day
              <br />
              starts with you.<span>♡</span>
            </div>
            {data.parcel.lid &&
              data.objects
                .filter(
                  (o) =>
                    (o.id !== "final" || available || data.finalOpened) &&
                    (!o.id.startsWith("prize-") ||
                      data.prizes.includes(o.type)),
                )
                .map((item) => (
                  <InteractiveObject
                    key={item.id}
                    item={item}
                    width={bw}
                    height={bh}
                    zoom={z}
                    focused={focus === item.id}
                    onActivate={() => open(item.id)}
                    extraClass={
                      (reaction === item.id ? "reacting " : "") +
                      (item.id === "photo" ? "hidden-photo " : "")
                    }
                    onDrop={(x, y) => {
                      if (item.id === "cherries") {
                        const cake = data.objects.find((o) => o.id === "cake")!;
                        if (
                          Math.hypot(x - cake.position.x, y - cake.position.y) <
                          120
                        ) {
                          remember();
                          update((d) => ({
                            ...d,
                            cake: {
                              ...d.cake,
                              toppers: [
                                ...d.cake.toppers,
                                {
                                  id: crypto.randomUUID(),
                                  type: "cherry",
                                  x: 45 + Math.random() * 15,
                                  y: 35 + Math.random() * 15,
                                  rotation: 0,
                                  size: 1,
                                },
                              ].slice(-80),
                            },
                          }));
                          setNote(
                            "A little cherry on top. Exactly where it belongs.",
                          );
                          play("magic");
                        }
                      }
                    }}
                  >
                    {item.id === "bouquet" ? (
                      <BouquetArt
                        interactive={focus === "bouquet"}
                        selected={flower}
                        onSelect={setFlower}
                        onNote={setNote}
                      />
                    ) : item.id === "cake" ? (
                      <CakeArt
                        interactive={focus === "cake"}
                        selected={topper}
                        tool={tool}
                        onSelect={setTopper}
                        onRemember={remember}
                      />
                    ) : item.id === "arcade" ? (
                      <ArcadeArt
                        claw={claw.claw}
                        onAim={focus === "arcade" ? claw.aim : undefined}
                        onGrab={focus === "arcade" ? claw.grab : undefined}
                      />
                    ) : item.id === "letter" || item.id === "final" ? (
                      <Letter
                        focused={focus === item.id}
                        isFinal={item.id === "final"}
                        onClose={close}
                        onCelebrate={() => {
                          update((d) => ({ ...d, finalOpened: true }));
                          setCelebrate((v) => v + 1);
                          play("magic");
                        }}
                      />
                    ) : (
                      <>
                        <Sprite kind={item.type} />
                        {item.id === "elephant" && eleFlower && (
                          <svg className="held-flower" viewBox="-40 -65 80 130">
                            <FlowerArt type="daisy" />
                          </svg>
                        )}
                      </>
                    )}
                    {focus !== item.id && (
                      <span className="object-whisper">
                        {item.id === "letter"
                          ? "a few words for you"
                          : item.id === "bouquet"
                            ? "a little room to bloom"
                            : item.id === "cake"
                              ? "extra cherries?"
                              : item.id === "arcade"
                                ? "feeling lucky?"
                                : item.id === "final"
                                  ? "psst. one last thing."
                                  : ""}
                      </span>
                    )}
                  </InteractiveObject>
                ))}
            {data.parcel.lid && !data.parcel.tissue && (
              <button
                className="tissue-sheet"
                aria-label="Fold back the tissue paper"
                style={{
                  left: bw * 0.15,
                  top: bh * 0.29,
                  width: bw * 0.67,
                  height: bh * 0.48,
                }}
                onClick={() => unwrap("tissue")}
              >
                <span>there’s a little world in here.</span>
                <small>lift the paper ↗</small>
              </button>
            )}
            <div
              className={"parcel-lid " + (data.parcel.lid ? "lid-open" : "")}
              style={{
                left: bw * 0.13,
                top: bh * 0.21,
                width: bw * 0.74,
                height: bh * 0.59,
              }}
              aria-hidden={data.parcel.lid}
            >
              <div className="lid-surface" />
              <div className="parcel-scribble">
                made for
                <br />
                <em>one very good human.</em>
              </div>
              <div className="shipping-label">
                <span>SPECIAL DELIVERY</span>
                <h1>
                  To: <em>{careContent.recipient}</em>
                </h1>
                <p>Contents: {careContent.opening}</p>
                <div className="label-postmark">
                  HANDLE WITH
                  <br />A LITTLE JOY
                </div>
                <small>{careContent.label}</small>
              </div>
              <div className="parcel-sticker cherry-sticker">
                <Sprite kind="cherry" />
              </div>
              <div className="parcel-sticker penguin-sticker">
                <Sprite kind="penguin" />
              </div>
              <div className="parcel-botanical">
                <svg viewBox="-50 -70 100 170">
                  <FlowerArt type="leaf" />
                </svg>
              </div>
              <Unwrap
                className="parcel-ribbon"
                ready
                done={data.parcel.ribbon}
                label="Pull or tap the ribbon to loosen it"
                onAction={() => unwrap("ribbon")}
              >
                <span className="ribbon-horizontal" />
                <span className="ribbon-vertical" />
                <svg className="ribbon-bow" viewBox="0 0 220 130">
                  <path
                    d="M109 64C-5-50-23 118 100 75 9 178 146 173 118 74 245 125 242-39 109 64Z"
                    fill="#b4596c"
                    stroke="#93475d"
                    strokeWidth="2"
                  />
                  <path
                    d="M109 65Q41 2 22 36q-11 33 79 35m12-7q64-64 87-31 15 32-84 40"
                    fill="none"
                    stroke="#cb8190"
                    strokeWidth="3"
                  />
                  <path d="m101 73-16 56 20-11 15 11 1-56" fill="#b4596c" />
                  <ellipse
                    cx="112"
                    cy="70"
                    rx="19"
                    ry="15"
                    fill="#bd6e7e"
                    stroke="#a65568"
                  />
                </svg>
                <small>pull the ribbon, lovely.</small>
              </Unwrap>
              <Unwrap
                className="parcel-tape"
                ready={data.parcel.ribbon}
                done={data.parcel.tape}
                label="Peel or tap the decorative tape"
                onAction={() => unwrap("tape")}
              >
                <span />
                <small>a little peel ↗</small>
              </Unwrap>
              <Unwrap
                className="lift-lid"
                ready={data.parcel.ribbon && data.parcel.tape}
                done={data.parcel.lid}
                label="Lift or tap the parcel lid"
                onAction={() => unwrap("lid")}
              >
                <span>open a little happiness</span>
                <i>↗</i>
              </Unwrap>
            </div>
            <div className="table-doodle doodle-one">
              <ButterflyArt />
            </div>
            <div className="table-doodle doodle-two">
              <ButterflyArt />
            </div>
            <div
              className="loose-stationery"
              style={{ left: bw * 0.78, top: bh * 0.84 }}
            >
              <span>
                not all good things
                <br />
                fit in a birthday card.
              </span>
              <i>♡</i>
            </div>
          </motion.div>
        </div>
        <AnimatePresence>
          {focus && (
            <motion.aside
              className={"object-workbench workbench-" + focus}
              key={focus}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.23 }}
              aria-label={"Playing with " + focus}
            >
              <button ref={closeRef} className="put-back" onClick={close}>
                ↙ <span>Put it back on the table</span>
              </button>
              <div className="workbench-scroll">
                {focus === "bouquet" ? (
                  <FlowerTools
                    selected={flower}
                    onSelect={setFlower}
                    onNote={setNote}
                  />
                ) : focus === "cake" ? (
                  <CakeTools
                    tool={tool}
                    onTool={setTool}
                    selected={topper}
                    onSelect={setTopper}
                    remember={remember}
                    onUndo={() => history(true)}
                    onRedo={() => history(false)}
                    undoable={undo.current.length > 0}
                    redoable={redo.current.length > 0}
                    onNotice={setNote}
                  />
                ) : focus === "arcade" ? (
                  <ArcadeTools {...claw} onKeep={keepPrize} />
                ) : focus === "letter" || focus === "final" ? (
                  <>
                    <p className="eyebrow">
                      {focus === "final"
                        ? "THE GOOD PART NEVER REALLY ENDS"
                        : "FOR YOUR EYES & YOUR IMAGINATION"}
                    </p>
                    <h2>
                      {focus === "final" ? (
                        <>
                          Happy birthday,
                          <br />
                          <em>JV.</em>
                        </>
                      ) : (
                        <>
                          A few words.
                          <br />
                          <em>All for you.</em>
                        </>
                      )}
                    </h2>
                    <p className="hand-note">
                      No hurry. The rest of the world can wait.
                    </p>
                    {focus === "letter" && careContent.letterIsDefault && (
                      <p className="personalisation-note">
                        A little default letter. Your own words can be added
                        before gifting.
                      </p>
                    )}
                    {focus === "final" && (
                      <button
                        className="ink-button"
                        onClick={() => {
                          setCelebrate((v) => v + 1);
                          play("magic");
                        }}
                      >
                        A little more birthday magic
                      </button>
                    )}
                  </>
                ) : (
                  <>
                    <p className="eyebrow">THE VERY LITTLE THINGS</p>
                    <h2>
                      {focus === "photo" ? (
                        <>
                          Something
                          <br />
                          <em>worth keeping.</em>
                        </>
                      ) : focus.startsWith("prize-") ? (
                        <>
                          A pocket-sized
                          <br />
                          <em>good thing.</em>
                        </>
                      ) : focus === "penguin" ? (
                        <>
                          No thoughts.
                          <br />
                          <em>Just penguin.</em>
                        </>
                      ) : focus === "coffee" ? (
                        <>
                          A good little
                          <br />
                          <em>coffee break.</em>
                        </>
                      ) : (
                        <>
                          Small things.
                          <br />
                          <em>Big personality.</em>
                        </>
                      )}
                    </h2>
                    {focus === "photo" ? (
                      <div className="photo-closeup">
                        {careContent.photo.src ? (
                          <img
                            src={careContent.photo.src}
                            alt={careContent.photo.caption}
                          />
                        ) : (
                          <Sprite kind="photo" />
                        )}
                        <p>{careContent.photo.caption}</p>
                        {!careContent.photo.src && (
                          <small>{careContent.photo.note}</small>
                        )}
                      </div>
                    ) : (
                      <p className="hand-note">
                        {note ||
                          careContent.prizes.find(
                            (p) => "prize-" + p.id === focus,
                          )?.message ||
                          "Yours to move around. Yours to keep."}
                      </p>
                    )}
                    {focus === "elephant" && (
                      <button
                        className="ink-button"
                        onClick={() => {
                          setEleFlower(!eleFlower);
                          setReaction("elephant");
                          play("magic");
                        }}
                      >
                        {eleFlower
                          ? "Put the flower down"
                          : "Let the elephant hold a flower"}
                      </button>
                    )}
                    {focus === "penguin" && (
                      <button
                        className="ink-button"
                        onClick={() => {
                          setReaction("");
                          requestAnimationFrame(() => setReaction("penguin"));
                          play("pick");
                        }}
                      >
                        One little wobble
                      </button>
                    )}
                    {focus === "car" && (
                      <button
                        className="ink-button"
                        onClick={() => open("car")}
                      >
                        Another tiny lap
                      </button>
                    )}
                  </>
                )}
                {!["letter", "final"].includes(focus) && note && (
                  <p className="live-note" role="status">
                    {note}
                  </p>
                )}
                <div className="object-placement">
                  <label>
                    Turn the little thing
                    <input
                      type="range"
                      aria-label="Rotate focused object"
                      min="-45"
                      max="45"
                      value={obj?.rotation || 0}
                      onChange={(e) =>
                        update((d) => ({
                          ...d,
                          objects: d.objects.map((o) =>
                            o.id === focus
                              ? { ...o, rotation: +e.target.value }
                              : o,
                          ),
                        }))
                      }
                    />
                  </label>
                </div>
              </div>
              <p className="workbench-footnote">
                Leave it however you like. It stays that way.
              </p>
            </motion.aside>
          )}
        </AnimatePresence>
        {!focus && (
          <div className="table-hint">
            {!data.parcel.ribbon
              ? "A little tug on the ribbon is a good place to start."
              : !data.parcel.tape
                ? "There’s a little tape left to peel."
                : !data.parcel.lid
                  ? "The lid is ready when you are."
                  : !data.parcel.tissue
                    ? "Lift the tissue. Then follow your curiosity."
                    : "Pick things up. Make a mess. Stay a while."}
            <span>♡</span>
          </div>
        )}
        {!focus && available && !data.finalOpened && (
          <div className="last-note-hint">
            there’s one more letter tucked in there.
          </div>
        )}
        {settings && (
          <aside className="comfort-sheet" aria-label="Comfort settings">
            <button
              className="comfort-close"
              onClick={() => setSettings(false)}
              aria-label="Close comfort settings"
            >
              ×
            </button>
            <span className="eyebrow">MAKE YOURSELF COMFORTABLE</span>
            <label>
              Less motion
              <input
                type="checkbox"
                checked={data.reduced}
                onChange={(e) =>
                  update((d) => ({ ...d, reduced: e.target.checked }))
                }
              />
            </label>
            <label>
              Clearer reading
              <input
                type="checkbox"
                checked={data.readable}
                onChange={(e) =>
                  update((d) => ({ ...d, readable: e.target.checked }))
                }
              />
            </label>
            <p>
              Tap to open. Drag to move.
              <br />
              Arrow keys move a focused object.
              <br />[ and ] turn it. Escape puts it back.
            </p>
            <p>Your little arrangement is saved only in this browser.</p>
            <button
              className="reset-care"
              onClick={() => {
                if (
                  confirm(
                    "Repack the whole birthday box? This removes this care package’s positions, cake, flowers and prizes. The earlier adventure save stays untouched.",
                  )
                ) {
                  useCare.getState().reset();
                  setFocus(null);
                  setSettings(false);
                  setEleFlower(false);
                  claw.setReward(null);
                  undo.current = [];
                  redo.current = [];
                }
              }}
            >
              Repack the box & start again
            </button>
          </aside>
        )}
        {error && (
          <p className="save-error" role="status">
            {error}
          </p>
        )}
        {celebrate > 0 && <Celebration key={celebrate} seed={celebrate} />}
      </main>
    </MotionConfig>
  );
}
