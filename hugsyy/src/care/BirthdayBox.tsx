"use client";
import { useEffect, useRef, useState, type PointerEvent } from "react";
import { AnimatePresence, motion, MotionConfig } from "motion/react";
import { useCare } from "./store";
import { CakeArt, CakeTools, type CakeHistory } from "./Cake";
import { BouquetArt, FlowerTools } from "./Bouquet";
import { ArcadeArt, ArcadeTools, useClaw } from "./Arcade";
import { Sprite } from "./Artwork";
import { careContent } from "./content";
import BirthdayPrelude from "./BirthdayPrelude";
import { BalloonInteraction, BalloonTools } from "./BalloonStudio";

import dynamic from "next/dynamic";
import "./birthday.css";
import "./experience.css";
import "./interaction.css";
const ToyCanvas = dynamic(() => import("./ToyCanvas"), { ssr: false });

type Gift = "cake" | "balloon" | "photo" | "bouquet" | "arcade";
const names = {
  cake: "A cake for you",
  balloon: "A little balloon magic",
  photo: "Your little collection",
  bouquet: "Flowers, your way",
  arcade: "Your tiny claw machine",
};
const letter = [
  "Dear JV,",
  "I wanted to give you something that feels a little like the happiness you bring into my life. So I packed this little world for you, one small thing at a time.",
  "I hope you know how much you mean to me. You deserve to feel loved on the ordinary days too — on the days when everything feels easy, and especially on the days when it doesn't.",
  "For your birthday, I wish you more reasons to laugh, people who make you feel at home, and the courage to keep choosing the things that make you happy.",
  "Make a cake that is entirely yours. Twist something silly out of a balloon. Keep a few moments close. Pick yourself the prettiest flowers. Every little thing in here is for you.",
  "Happy birthday. I'm so glad you're here.",
  "With love,\nHugsy",
];

function Ribbon() {
  return (
    <svg className="satin-bow" viewBox="0 0 360 230" aria-hidden="true">
      <defs>
        <linearGradient id="satin" x2="0.8" y2="1">
          <stop stopColor="#8e3854" />
          <stop offset=".35" stopColor="#e3a1ad" />
          <stop offset=".58" stopColor="#b95676" />
          <stop offset=".8" stopColor="#db8fa3" />
          <stop offset="1" stopColor="#84374e" />
        </linearGradient>
      </defs>
      <path
        d="M174 118C128 82 66 30 42 63C12 108 95 142 174 118Z"
        fill="url(#satin)"
        stroke="#99445e"
        strokeWidth="2"
      />
      <path
        d="M184 118C227 74 287 29 313 64C344 107 262 143 184 118Z"
        fill="url(#satin)"
        stroke="#99445e"
        strokeWidth="2"
      />
      <path
        d="M164 116C150 151 125 179 108 216L143 204L160 228C181 188 191 154 190 119M188 117C205 156 238 184 254 212L229 206L212 228C194 189 175 156 169 119"
        fill="url(#satin)"
        stroke="#99445e"
        strokeWidth="2"
      />
      <path
        d="M49 72Q106 74 165 115M308 73Q255 72 191 115"
        fill="none"
        stroke="#f1c0c7"
        strokeWidth="4"
        opacity=".6"
      />
      <path
        d="M164 101Q179 95 197 105L194 132Q176 140 161 128Z"
        fill="url(#satin)"
        stroke="#99445e"
        strokeWidth="2"
      />
    </svg>
  );
}

export function BalloonArt({
  shape = "dog",
  color = "#cf7896",
  step = 0,
}: {
  shape?: string;
  color?: string;
  step?: number;
}) {
  const segment = (
    x: number,
    y: number,
    w: number,
    h: number,
    r = 0,
    key = "",
  ) => (
    <ellipse
      key={key || `${x}-${y}`}
      cx={x}
      cy={y}
      rx={w}
      ry={h}
      transform={`rotate(${r} ${x} ${y})`}
      fill={color}
      stroke="#773e59"
      strokeOpacity=".4"
      strokeWidth="2.5"
    />
  );
  return (
    <svg
      viewBox="0 0 340 290"
      className="balloon-art"
      aria-label={`${shape} balloon, step ${step} of 4`}
    >
      <defs>
        <filter id="balloon-shadow">
          <feDropShadow dx="0" dy="9" stdDeviation="5" floodOpacity=".12" />
        </filter>
      </defs>
      <g filter="url(#balloon-shadow)">
        {step <= 1 ? (
          segment(170, 160, 125, step === 0 ? 5 : 17)
        ) : shape === "flower" ? (
          <>
            {segment(170, 207, 13, 64)}
            {Array.from({ length: Math.min(6, step * 2) }, (_, i) => {
              const a = (i * Math.PI) / 3;
              return segment(
                170 + Math.cos(a) * 39,
                108 + Math.sin(a) * 39,
                21,
                35,
                i * 60 + 90,
                `petal-${i}`,
              );
            })}
            {step === 4 && segment(170, 108, 23, 23)}
          </>
        ) : (
          <>
            {segment(180, 155, 65, 23)}
            {segment(97, 119, 37, 22, -10)}
            {segment(129, 144, 17, 27, -20)}
            {step >= 2 && (
              <>
                {segment(
                  119,
                  shape === "bunny" ? 57 : 86,
                  15,
                  shape === "bunny" ? 48 : 30,
                  -12,
                )}
                {segment(
                  141,
                  shape === "bunny" ? 57 : 86,
                  15,
                  shape === "bunny" ? 48 : 30,
                  12,
                )}
              </>
            )}
            {step >= 3 && (
              <>
                {segment(145, 198, 17, 43, 12)}
                {segment(172, 198, 17, 43, -12)}
              </>
            )}
            {step >= 4 && (
              <>
                {segment(221, 198, 17, 43, 12)}
                {segment(246, 198, 17, 43, -12)}
                {segment(255, 126, 13, 32, 35)}
                <circle cx="84" cy="112" r="3" fill="#663849" />
                <path d="m59 121-10-5 2 12Z" fill={color} />
              </>
            )}
          </>
        )}
        <path
          d={step <= 1 ? "M70 153Q160 142 241 153" : "M158 146Q181 138 207 147"}
          fill="none"
          stroke="white"
          opacity=".45"
          strokeWidth="5"
          strokeLinecap="round"
        />
      </g>
    </svg>
  );
}

function Pull({
  kind,
  onDone,
}: {
  kind: "ribbon" | "tear";
  onDone: () => void;
}) {
  const [progress, setProgress] = useState(0),
    [released, setReleased] = useState(false);
  const reduced = useCare((s) => s.data.reduced),
    timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const releaseLocked = useRef(false);
  function release() {
    if (releaseLocked.current) return;
    releaseLocked.current = true;
    setReleased(true);
    setProgress(1);
    if (reduced) onDone();
    else timer.current = setTimeout(onDone, 480);
  }
  const dragged = useRef(false);
  const cleanup = useRef<(() => void) | null>(null);
  useEffect(
    () => () => {
      cleanup.current?.();
      if (timer.current) clearTimeout(timer.current);
    },
    [],
  );
  function begin(e: PointerEvent<HTMLButtonElement>) {
    if (e.button !== 0 || released) return;
    e.preventDefault();
    cleanup.current?.();
    dragged.current = false;
    const x = e.clientX,
      y = e.clientY,
      pointer = e.pointerId;
    const amount = (event: globalThis.PointerEvent) =>
      (kind === "ribbon" ? event.clientY - y : event.clientX - x) /
      (kind === "ribbon" ? 95 : Math.min(210, innerWidth * 0.4));
    const move = (event: globalThis.PointerEvent) => {
      if (Math.hypot(event.clientX - x, event.clientY - y) > 8)
        dragged.current = true;
      if (event.pointerId === pointer)
        setProgress(Math.max(0, Math.min(1, amount(event))));
    };
    const cancel = () => {
      cleanup.current?.();
      setProgress(0);
    };
    const up = (event: globalThis.PointerEvent) => {
      if (event.pointerId !== pointer) return;
      cleanup.current?.();
      if (amount(event) >= 0.88 || !dragged.current) release();
      else setProgress(0);
    };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
    window.addEventListener("pointercancel", cancel);
    cleanup.current = () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
      window.removeEventListener("pointercancel", cancel);
      cleanup.current = null;
    };
  }
  return (
    <div
      className={"pull-wrap " + kind + (released ? " is-released" : "")}
      style={{ "--pull": progress } as React.CSSProperties}
    >
      <button
        className="physical-pull"
        aria-label={
          kind === "ribbon"
            ? "Pull ribbon downward to untie"
            : "Pull tear tab to the right"
        }
        onPointerDown={begin}
        onClick={(e) => {
          if (e.detail === 0 || !dragged.current) release();
        }}
      >
        {kind === "ribbon" ? (
          <>
            <span className="satin-band" />
            <Ribbon />
          </>
        ) : (
          <>
            <span className="perforation" />
            <span className="tear-paper" />
            <span className="tear-tab">PULL &#8594;</span>
          </>
        )}
      </button>
      <button className="pull-alternative" onClick={release}>
        {kind === "ribbon" ? "Untie ribbon" : "Tear strip"}
      </button>
    </div>
  );
}

export default function BirthdayBox() {
  const { data, ready, load, update, error } = useCare();
  const [focus, setFocus] = useState<Gift | null>(null),
    [intro, setIntro] = useState(true),
    [reading, setReading] = useState(false),
    [dodges, setDodges] = useState(0),
    [settings, setSettings] = useState(false);
  const [tool, setTool] = useState("cherry"),
    [topper, setTopper] = useState<string | null>(null),
    [flower, setFlower] = useState<string | null>(null),
    [note, setNote] = useState(""),
    [, revision] = useState(0);
  const [turn, setTurn] = useState(0);
  const [photoIndex, setPhotoIndex] = useState(0),
    [photoError, setPhotoError] = useState("");
  const claw = useClaw(focus === "arcade", setNote);
  const undo = useRef<CakeHistory[]>([]),
    redo = useRef<CakeHistory[]>([]),
    closeButton = useRef<HTMLButtonElement>(null),
    lastFocus = useRef<HTMLElement | null>(null);
  useEffect(load, [load]);
  useEffect(() => {
    try {
      if (sessionStorage.getItem("jv-birthday-intro:v1")) setIntro(false);
    } catch {
      /* Session storage is optional. */
    }
  }, []);
  useEffect(() => {
    document.documentElement.dataset.motion = data.reduced ? "reduced" : "full";
  }, [data.reduced]);
  useEffect(() => {
    if (focus || reading) {
      lastFocus.current = document.activeElement as HTMLElement;
      closeButton.current?.focus();
    } else lastFocus.current?.focus();
  }, [focus, reading]);
  useEffect(() => {
    const fn = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setFocus(null);
        setReading(false);
      }
      if (e.key === "Tab" && (focus || reading)) {
        const nodes = [
          ...document.querySelectorAll<HTMLElement>(
            ".gift-dialog button, .gift-dialog input, .gift-dialog select, .gift-dialog textarea, .letter-dialog button",
          ),
        ].filter(
          (el) => !el.hasAttribute("disabled") && el.getClientRects().length,
        );
        const first = nodes[0],
          last = nodes[nodes.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last?.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first?.focus();
        }
      }
    };
    window.addEventListener("keydown", fn);
    return () => window.removeEventListener("keydown", fn);
  }, [focus, reading]);
  function remember() {
    undo.current.push(structuredClone(useCare.getState().data.cake));
    redo.current = [];
    revision((v) => v + 1);
  }
  function history(back: boolean) {
    const from = back ? undo.current : redo.current,
      to = back ? redo.current : undo.current;
    if (!from.length) return;
    to.push(structuredClone(useCare.getState().data.cake));
    const cake = from.pop()!;
    update((d) => ({ ...d, cake }));
    setTopper(null);
    revision((v) => v + 1);
  }
  function keepPrize(id: string) {
    if (
      !careContent.prizes.some((p) => p.id === id) ||
      !useCare.getState().data.prizes.includes(id)
    )
      return;
    update((d) =>
      d.objects.some((o) => o.id === "prize-" + id)
        ? d
        : {
            ...d,
            objects: [
              ...d.objects,
              {
                id: "prize-" + id,
                type: id,
                position: { x: 500, y: 750 },
                rotation: 0,
                scale: 0.8,
                zIndex: 30,
                draggable: true,
                interactive: true,
                interactionState: "idle",
                collected: true,
                completed: true,
                metadata: { w: 105, h: 120 },
              },
            ],
          },
    );
    setNote("Your little friend is waiting in the box.");
    claw.setReward(null);
  }
  function unwrap(key: "ribbon" | "tape" | "lid") {
    update((d) => ({
      ...d,
      parcel: {
        ...d.parcel,
        [key]: true,
        ...(key === "lid" ? { tissue: true } : {}),
      },
    }));
  }
  function catchEnvelope(keyboard = false) {
    if (keyboard || data.reduced || dodges >= 3) setReading(true);
    else setDodges((v) => v + 1);
  }
  async function upload(file?: File) {
    if (!file) return;
    setPhotoError("");
    if (!file.type.startsWith("image/")) {
      setPhotoError("Choose a photo file.");
      return;
    }
    const index = photoIndex,
      url = URL.createObjectURL(file);
    try {
      const img = new Image();
      img.src = url;
      await img.decode();
      const scale = Math.min(1, 900 / Math.max(img.width, img.height));
      const canvas = document.createElement("canvas");
      canvas.width = Math.round(img.width * scale);
      canvas.height = Math.round(img.height * scale);
      canvas
        .getContext("2d")!
        .drawImage(img, 0, 0, canvas.width, canvas.height);
      const src = canvas.toDataURL("image/jpeg", 0.78);
      update((d) => ({
        ...d,
        polaroids: d.polaroids.map((p, i) =>
          i === index ? { ...p, src, collected: false } : p,
        ),
      }));
    } catch {
      setPhotoError("That photo couldn't be opened. Try another image.");
    } finally {
      URL.revokeObjectURL(url);
    }
  }
  if (!ready) return <main className="birthday-loading">for you, JV.</main>;
  if (intro)
    return (
      <BirthdayPrelude
        reduced={data.reduced}
        onComplete={() => {
          try {
            sessionStorage.setItem("jv-birthday-intro:v1", "done");
          } catch {
            /* Continue without persistence. */
          }
          setIntro(false);
        }}
      />
    );
  const giftStage = data.giftsRevealed;
  const currentPhoto = data.polaroids[photoIndex];
  return (
    <MotionConfig reducedMotion={data.reduced ? "always" : "never"}>
      <main
        className={
          "birthday-world experience-world " +
          (!data.parcel.lid
            ? "phase-parcel"
            : !giftStage
              ? "phase-envelope"
              : "phase-gifts")
        }
        onPointerMove={(e) => {
          if (data.reduced || e.pointerType === "touch") return;
          e.currentTarget.style.setProperty(
            "--look-x",
            String((e.clientX / innerWidth - 0.5) * 2),
          );
          e.currentTarget.style.setProperty(
            "--look-y",
            String((e.clientY / innerHeight - 0.5) * 2),
          );
        }}
      >
        <div className="window-light" aria-hidden="true" />
        <div className="ambient-grain" aria-hidden="true" />
        <header className="birthday-header">
          <span>
            <span className="brand-mark">h.</span>
            <span className="brand-dedication">
              a little world, for <em>JV.</em>
            </span>
          </span>
          <button aria-label="Settings" onClick={() => setSettings(!settings)}>
            ···
          </button>
        </header>
        <div className="experience-caption" aria-hidden="true">
          <span>
            {!data.parcel.lid
              ? "01 / THE UNWRAPPING"
              : !giftStage
                ? "02 / THE WORDS"
                : "03 / THE LITTLE THINGS"}
          </span>
          <p>
            {!data.parcel.lid ? (
              <>
                Good things.
                <br />
                <em>In small packages.</em>
              </>
            ) : !giftStage ? (
              <>
                Before everything,
                <br />
                <em>a few words.</em>
              </>
            ) : (
              <>
                A little bit of joy.
                <br />
                <em>Entirely yours.</em>
              </>
            )}
          </p>
        </div>
        <div className="birthday-stage" inert={!!focus || reading}>
          <AnimatePresence mode="wait">
            {!data.parcel.lid ? (
              <motion.section
                key="parcel"
                className="new-parcel"
                initial={{ opacity: 0, y: 45 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{
                  opacity: 0,
                  y: -140,
                  rotateX: -55,
                  transition: { duration: 0.8 },
                }}
                transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              >
                <div className="parcel-grain" />
                <div className="box-front-edge" />
                <div className="box-right-edge" />
                <span className="parcel-edition">
                  THE BIRTHDAY EDITION / 01
                </span>
                <div className="simple-label">
                  <small>THIS LITTLE WORLD BELONGS TO</small>
                  <h1>
                    JV<span>.</span>
                  </h1>
                  <span>from Hugsy, with love.</span>
                  <span className="postage-heart">
                    h<small>WITH LOVE</small>
                  </span>
                </div>
                {!data.parcel.ribbon ? (
                  <Pull
                    key="ribbon"
                    kind="ribbon"
                    onDone={() => unwrap("ribbon")}
                  />
                ) : !data.parcel.tape ? (
                  <Pull key="tear" kind="tear" onDone={() => unwrap("tape")} />
                ) : (
                  <button className="new-lid-tab" onClick={() => unwrap("lid")}>
                    Lift the lid <span>&#8599;</span>
                  </button>
                )}
              </motion.section>
            ) : !giftStage ? (
              <motion.section
                key="envelope"
                className="envelope-scene"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <div className="empty-box" />
                <div className="envelope-tissue tissue-left" />
                <div className="envelope-tissue tissue-right" />
                <motion.button
                  className="playful-envelope"
                  aria-label="Open Hugsy's letter"
                  animate={{
                    x: data.reduced ? 0 : [0, -90, 85, 0][Math.min(dodges, 3)],
                    y: data.reduced ? 0 : [0, -55, 40, 0][Math.min(dodges, 3)],
                    scale: data.reduced
                      ? 1
                      : [1, 0.78, 0.67, 1][Math.min(dodges, 3)],
                    rotate: [-7, 9, -12, -4][Math.min(dodges, 3)],
                  }}
                  transition={{ type: "spring", stiffness: 190, damping: 19 }}
                  onClick={(e) => catchEnvelope(e.detail === 0)}
                >
                  <span className="envelope-fold" />
                  <span className="wax-seal">h</span>
                  <span className="envelope-address">
                    JV, this one's for you.
                  </span>
                </motion.button>
                <p className="envelope-hint" role="status">
                  {dodges === 0
                    ? "A letter, before the little things."
                    : dodges < 3
                      ? "A little shy. Try again ♡"
                      : "Okay, okay. All yours."}
                </p>
                {dodges > 0 && dodges < 3 && (
                  <button
                    className="quiet-action"
                    onClick={() => setReading(true)}
                  >
                    Hold still & open
                  </button>
                )}
              </motion.section>
            ) : (
              <motion.section
                key="gifts"
                className={
                  "gift-box" +
                  (data.objects.some((o) => o.id.startsWith("prize-"))
                    ? " with-keepsakes"
                    : "")
                }
                initial={{ opacity: 0, scale: 0.94 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <div className="gift-box-lid">made for your kind of magic.</div>
                <div className="gift-tissue" aria-hidden="true" />
                <div className="gift-grid">
                  {(
                    ["balloon", "cake", "photo", "bouquet", "arcade"] as Gift[]
                  ).map((id, index) => (
                    <motion.button
                      key={id}
                      initial={{ opacity: 0, y: 35, scale: 0.85 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{
                        delay: data.reduced ? 0 : index * 0.14,
                        duration: data.reduced ? 0 : 0.8,
                        type: "spring",
                        bounce: 0.15,
                      }}
                      className={`gift-item gift-${id}`}
                      data-gift={id}
                      onClick={() => {
                        setFocus(id);
                        setTurn(0);
                        setNote("");
                      }}
                      aria-label={names[id]}
                    >
                      <span className="gift-art">
                        {id === "balloon" ? (
                          <ToyCanvas
                            kind="balloon"
                            miniature
                            fallback={
                              <BalloonArt
                                shape={data.balloon.shape}
                                color={data.balloon.color}
                                step={data.balloon.step}
                              />
                            }
                          />
                        ) : id === "cake" ? (
                          <ToyCanvas
                            kind="cake"
                            miniature
                            fallback={<CakeArt />}
                          />
                        ) : id === "arcade" ? (
                          <ArcadeArt />
                        ) : id === "bouquet" ? (
                          <BouquetArt />
                        ) : (
                          <span className="mini-polaroid">
                            {data.polaroids.find(
                              (p) => p.collected && p.src,
                            ) ? (
                              <img
                                src={
                                  data.polaroids.find(
                                    (p) => p.collected && p.src,
                                  )!.src
                                }
                                alt="Your collected photo"
                              />
                            ) : (
                              <span className="polaroid-illustration">
                                <span className="photo-sun" />
                                <span className="photo-hill" />
                                <span className="photo-flower">✳</span>
                              </span>
                            )}
                            <small>little moments</small>
                          </span>
                        )}
                      </span>
                      <span className="gift-caption">
                        {id === "balloon"
                          ? "twist a little joy"
                          : id === "cake"
                            ? "make a wish"
                            : id === "photo"
                              ? "keep a moment"
                              : id === "arcade"
                                ? "a little luck"
                                : "pick your flowers"}
                      </span>
                    </motion.button>
                  ))}
                </div>
                {data.objects.some((o) => o.id.startsWith("prize-")) && (
                  <div
                    className="keepsake-tray"
                    aria-label="Your claw machine prizes"
                  >
                    {data.objects
                      .filter((o) => o.id.startsWith("prize-"))
                      .map((o) => (
                        <span
                          key={o.id}
                          title={
                            careContent.prizes.find((p) => p.id === o.type)
                              ?.name
                          }
                        >
                          <Sprite kind={o.type} />
                        </span>
                      ))}
                  </div>
                )}
                <button
                  className="reread-letter"
                  onClick={() => setReading(true)}
                >
                  Hugsy’s letter ↗
                </button>
              </motion.section>
            )}
          </AnimatePresence>
        </div>
        <AnimatePresence>
          {reading && (
            <motion.div
              className="birthday-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <section
                className="letter-dialog"
                role="dialog"
                aria-modal="true"
                aria-label="A birthday letter from Hugsy"
              >
                <button
                  className="dialog-close"
                  ref={closeButton}
                  onClick={() => setReading(false)}
                  aria-label="Close letter"
                >
                  ×
                </button>
                <span className="letter-date">JUST FOR YOU</span>
                {letter.map((p, i) => (
                  <p
                    key={i}
                    className={
                      i === 0
                        ? "dear"
                        : i === letter.length - 1
                          ? "signature"
                          : ""
                    }
                  >
                    {p}
                  </p>
                ))}
                <button
                  className="birthday-primary"
                  onClick={() => {
                    update((d) => ({
                      ...d,
                      giftsRevealed: true,
                      letterStage: 3,
                    }));
                    setReading(false);
                  }}
                >
                  {giftStage ? "Back to your box" : "Open the little things →"}
                </button>
              </section>
            </motion.div>
          )}
        </AnimatePresence>
        <AnimatePresence>
          {focus && (
            <motion.div
              className="birthday-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <section
                className={`gift-dialog dialog-${focus}`}
                role="dialog"
                aria-modal="true"
                aria-label={names[focus]}
              >
                <button
                  className="dialog-close"
                  ref={closeButton}
                  onClick={() => setFocus(null)}
                  aria-label="Back to gift box"
                >
                  ×
                </button>
                <div className="atelier-heading">
                  <span>
                    {focus === "cake"
                      ? "THE PATISSERIE"
                      : focus === "balloon"
                        ? "THE TWIST STUDIO"
                        : focus === "photo"
                          ? "THE MEMORY DRAWER"
                          : focus === "arcade"
                            ? "THE LITTLE ARCADE"
                            : "THE FLOWER ROOM"}
                  </span>
                  <h2>{names[focus]}</h2>
                </div>
                <div className="gift-workspace">
                  <div className="gift-preview">
                    {focus === "cake" ? (
                      <ToyCanvas
                        kind="cake"
                        turn={turn}
                        tool={tool}
                        selected={topper}
                        onSelect={setTopper}
                        remember={remember}
                        fallback={
                          <CakeArt
                            interactive
                            tool={tool}
                            selected={topper}
                            onSelect={setTopper}
                            onRemember={remember}
                          />
                        }
                      />
                    ) : focus === "arcade" ? (
                      <ArcadeArt
                        claw={claw.claw}
                        onAim={claw.aim}
                        onGrab={claw.grab}
                      />
                    ) : focus === "bouquet" ? (
                      <BouquetArt
                        interactive
                        selected={flower}
                        onSelect={setFlower}
                        onNote={setNote}
                      />
                    ) : focus === "balloon" ? (
                      <BalloonInteraction>
                        <ToyCanvas
                          kind="balloon"
                          turn={turn}
                          fallback={<BalloonArt {...data.balloon} />}
                        />
                      </BalloonInteraction>
                    ) : (
                      <div
                        className={
                          "large-polaroid " +
                          (currentPhoto.collected ? "is-collected" : "")
                        }
                      >
                        {currentPhoto.src ? (
                          <img
                            src={currentPhoto.src}
                            alt={currentPhoto.caption || "Your chosen photo"}
                          />
                        ) : (
                          <div className="photo-empty">
                            <span>&#9825;</span>
                            <p>A moment of yours.</p>
                          </div>
                        )}
                        <span>{currentPhoto.caption || "a little memory"}</span>
                        {currentPhoto.collected && (
                          <span className="collected-stamp">
                            KEPT WITH LOVE
                          </span>
                        )}
                      </div>
                    )}
                    {(focus === "cake" || focus === "balloon") && (
                      <div className="turntable-controls">
                        <button
                          aria-label="Turn object left"
                          onClick={() => setTurn((v) => v - Math.PI / 5)}
                        >
                          ↶
                        </button>
                        <span>TURN IT A LITTLE</span>
                        <button
                          aria-label="Turn object right"
                          onClick={() => setTurn((v) => v + Math.PI / 5)}
                        >
                          ↷
                        </button>
                      </div>
                    )}
                  </div>
                  <div className="gift-tools">
                    {focus === "cake" ? (
                      <CakeTools
                        tool={tool}
                        onTool={setTool}
                        selected={topper}
                        onSelect={setTopper}
                        remember={remember}
                        onUndo={() => history(true)}
                        onRedo={() => history(false)}
                        undoable={!!undo.current.length}
                        redoable={!!redo.current.length}
                        onNotice={setNote}
                      />
                    ) : focus === "arcade" ? (
                      <ArcadeTools {...claw} onKeep={keepPrize} />
                    ) : focus === "bouquet" ? (
                      <FlowerTools
                        selected={flower}
                        onSelect={setFlower}
                        onNote={setNote}
                      />
                    ) : focus === "balloon" ? (
                      <BalloonTools />
                    ) : (
                      <>
                        <div
                          className="photo-tabs"
                          aria-label="Polaroid collection"
                        >
                          {data.polaroids.map((p, i) => (
                            <button
                              key={p.id}
                              aria-pressed={photoIndex === i}
                              onClick={() => {
                                setPhotoIndex(i);
                                setPhotoError("");
                              }}
                            >
                              {String(i + 1).padStart(2, "0")}
                              {p.collected ? " ♡" : ""}
                            </button>
                          ))}
                        </div>
                        <label className="photo-upload">
                          Choose a photo
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              void upload(e.target.files?.[0]);
                              e.target.value = "";
                            }}
                          />
                        </label>
                        <label>
                          A few words
                          <input
                            aria-label="Polaroid caption"
                            maxLength={80}
                            value={currentPhoto.caption}
                            placeholder="The day, the place, the feeling…"
                            onChange={(e) =>
                              update((d) => ({
                                ...d,
                                polaroids: d.polaroids.map((p, i) =>
                                  i === photoIndex
                                    ? { ...p, caption: e.target.value }
                                    : p,
                                ),
                              }))
                            }
                          />
                        </label>
                        <button
                          className="birthday-primary"
                          disabled={!currentPhoto.src || currentPhoto.collected}
                          onClick={() =>
                            update((d) => ({
                              ...d,
                              polaroids: d.polaroids.map((p, i) =>
                                i === photoIndex
                                  ? { ...p, collected: true }
                                  : p,
                              ),
                            }))
                          }
                        >
                          {currentPhoto.collected
                            ? "Kept in your collection ♡"
                            : "Keep this Polaroid"}
                        </button>
                        <p className="collection-count">
                          {data.polaroids.filter((p) => p.collected).length} / 3
                          moments kept
                        </p>
                        {photoError && <p role="alert">{photoError}</p>}
                      </>
                    )}
                    {note && (
                      <p className="workshop-note" role="status">
                        {note}
                      </p>
                    )}
                  </div>
                </div>
              </section>
            </motion.div>
          )}
        </AnimatePresence>
        {settings && (
          <aside className="birthday-settings" aria-label="Settings">
            <button
              className="dialog-close"
              aria-label="Close settings"
              onClick={() => setSettings(false)}
            >
              ×
            </button>
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
            <button
              className="quiet-action"
              onClick={() => {
                setSettings(false);
                setIntro(true);
              }}
            >
              Replay the birthday wish
            </button>
            <button
              className="quiet-action"
              onClick={() => {
                update((d) => ({
                  ...d,
                  parcel: {
                    ribbon: false,
                    tape: false,
                    lid: false,
                    tissue: false,
                  },
                  giftsRevealed: false,
                  letterStage: 0,
                }));
                setDodges(0);
                setFocus(null);
                setReading(false);
                setSettings(false);
              }}
            >
              Replay the opening
            </button>
            <button
              className="quiet-action"
              onClick={() => {
                if (
                  confirm(
                    "Repack your box? Your cake, flowers, balloons and saved Polaroids will be cleared.",
                  )
                ) {
                  useCare.getState().reset();
                  setDodges(0);
                  setFocus(null);
                  setReading(false);
                  setSettings(false);
                  undo.current = [];
                  redo.current = [];
                }
              }}
            >
              Repack the box
            </button>
          </aside>
        )}
        {error && (
          <p className="birthday-save-error" role="status">
            {error}
          </p>
        )}
      </main>
    </MotionConfig>
  );
}
