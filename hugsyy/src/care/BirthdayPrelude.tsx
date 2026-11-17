"use client";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { CandleBlower } from "./CandleBlower";
import "./prelude.css";

function BirthdayCake({ lit }: { lit: boolean }) {
  return (
    <svg
      className={`wish-cake ${lit ? "is-lit" : "is-out"}`}
      viewBox="0 0 500 350"
      role="img"
      aria-label={
        lit
          ? "Birthday cake with five lit candles"
          : "Birthday cake, all five candles blown out"
      }
    >
      <defs>
        <linearGradient id="wish-sponge" x2="1" y2="0">
          <stop stopColor="#bd7591" />
          <stop offset=".35" stopColor="#f0b4c8" />
          <stop offset=".7" stopColor="#e5a3bc" />
          <stop offset="1" stopColor="#ad617e" />
        </linearGradient>
        <linearGradient id="wish-frost" x2="0" y2="1">
          <stop stopColor="#fff5df" />
          <stop offset="1" stopColor="#ebc9ba" />
        </linearGradient>
        <radialGradient id="wish-flame">
          <stop stopColor="#fffde4" />
          <stop offset=".45" stopColor="#ffeaa0" />
          <stop offset="1" stopColor="#eea458" />
        </radialGradient>
        <radialGradient id="wish-plate">
          <stop stopColor="#fffbeb" />
          <stop offset=".85" stopColor="#e5d1b6" />
          <stop offset="1" stopColor="#c7a47f" />
        </radialGradient>
      </defs>
      <ellipse
        cx="250"
        cy="303"
        rx="205"
        ry="29"
        fill="#9f5a61"
        opacity=".12"
      />
      <ellipse cx="250" cy="287" rx="210" ry="43" fill="url(#wish-plate)" />
      <ellipse
        cx="250"
        cy="276"
        rx="192"
        ry="35"
        fill="#fff6e5"
        stroke="#dfc5ad"
      />
      <path d="M77 157v87c0 81 346 81 346 0v-87Z" fill="url(#wish-sponge)" />
      <path
        d="M78 212c0 76 344 76 344 0v13c0 74-344 74-344 0Z"
        fill="#fff1d9"
        opacity=".8"
      />
      <path
        d="M77 160v30q10 24 24 0v28q12 28 25 0v-18q14 12 27 2v23q13 26 26-1v-13q14 5 26 1v28q14 28 28 0v-24h30v23q14 27 27 0v-24q14 1 26-4v18q14 26 27-2v-26q13 3 26-6v21q14 24 26-2v-30q14 10 27-7v-17Z"
        fill="url(#wish-frost)"
      />
      <ellipse
        cx="250"
        cy="157"
        rx="173"
        ry="61"
        fill="#ffefd9"
        stroke="#efd4c2"
      />
      <ellipse
        cx="250"
        cy="157"
        rx="157"
        ry="49"
        fill="none"
        stroke="#fff9ed"
        strokeWidth="3"
      />
      {Array.from({ length: 22 }, (_, i) => {
        const a = (i / 22) * Math.PI * 2;
        return (
          <ellipse
            key={i}
            cx={250 + Math.cos(a) * 169}
            cy={254 + Math.sin(a) * 34}
            rx="10"
            ry="7"
            fill="#fff0dc"
          />
        );
      })}
      {[
        [158, 98],
        [204, 80],
        [250, 66],
        [296, 80],
        [342, 98],
      ].map(([x, y], i) => (
        <g
          key={i}
          transform={`translate(${x} ${y})`}
          style={{ "--candle-i": i } as CSSProperties}
        >
          <ellipse cy="61" rx="11" ry="4" fill="#c58d90" opacity=".22" />
          <rect
            x="-6"
            y="0"
            width="12"
            height="61"
            rx="3"
            fill={i % 2 ? "#af8daf" : "#cc7b93"}
          />
          {[8, 24, 40].map((v) => (
            <path
              key={v}
              d={`M-5 ${v + 7}l10-8`}
              stroke="#fff1dd"
              strokeWidth="4"
            />
          ))}
          <path d="M0 1v-8" stroke="#634941" strokeWidth="2" />
          <g className="wish-flame">
            <ellipse cy="-19" rx="23" ry="30" fill="#ffd778" opacity=".12" />
            <path
              d="M0-43C-5-30-14-22-10-13C-6-2 8-4 11-14C14-24 5-31 0-43Z"
              fill="url(#wish-flame)"
            />
            <path d="M0-25q-9 15 0 18q10-2 0-18" fill="#fffee3" />
          </g>
          {!lit && (
            <path
              className="wish-smoke"
              d="M0-9c-16-17 17-23 0-41s-5-25 2-31"
              fill="none"
              stroke="#aa9393"
              strokeWidth="2"
              strokeLinecap="round"
            />
          )}
        </g>
      ))}
    </svg>
  );
}

// The familiar birthday melody, synthesised locally after the Start gesture.
function birthdayMusic() {
  const context = new AudioContext();
  void context.resume();
  const notes = [
    [67, 0.3],
    [67, 0.2],
    [69, 0.5],
    [67, 0.5],
    [72, 0.5],
    [71, 1],
    [67, 0.3],
    [67, 0.2],
    [69, 0.5],
    [67, 0.5],
    [74, 0.5],
    [72, 1],
    [67, 0.3],
    [67, 0.2],
    [79, 0.5],
    [76, 0.5],
    [72, 0.5],
    [71, 0.5],
    [69, 1],
    [77, 0.3],
    [77, 0.2],
    [76, 0.5],
    [72, 0.5],
    [74, 0.5],
    [72, 1.4],
  ];
  let at = context.currentTime + 0.15;
  notes.forEach(([note, duration]) => {
    const oscillator = context.createOscillator(),
      gain = context.createGain();
    oscillator.type = "sine";
    oscillator.frequency.value = 440 * 2 ** ((note - 69) / 12);
    gain.gain.setValueAtTime(0, at);
    gain.gain.linearRampToValueAtTime(0.065, at + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.001, at + duration * 0.8);
    oscillator.connect(gain).connect(context.destination);
    oscillator.start(at);
    oscillator.stop(at + duration);
    at += duration * 0.85;
  });
  return context;
}

export default function BirthdayPrelude({
  onComplete,
  reduced,
}: {
  onComplete: () => void;
  reduced: boolean;
}) {
  const [started, setStarted] = useState(false),
    [lit, setLit] = useState(true),
    [music, setMusic] = useState(true);
  const [typed, setTyped] = useState("");
  const audio = useRef<AudioContext | null>(null);
  const continueButton = useRef<HTMLButtonElement>(null);
  const phrase = "The world got a little brighter when you arrived.";
  useEffect(() => {
    if (!started) return;
    if (reduced) {
      setTyped(phrase);
      return;
    }
    let n = 0;
    const timer = setInterval(() => {
      n++;
      setTyped(phrase.slice(0, n));
      if (n >= phrase.length) clearInterval(timer);
    }, 48);
    return () => clearInterval(timer);
  }, [started, reduced]);
  useEffect(
    () => () => {
      void audio.current?.close().catch(() => {});
    },
    [],
  );
  useEffect(() => {
    if (!lit) continueButton.current?.focus({ preventScroll: true });
  }, [lit]);
  function start() {
    setStarted(true);
    if (music) {
      try {
        audio.current = birthdayMusic();
      } catch {
        setMusic(false);
      }
    }
  }
  function toggleMusic() {
    if (music) {
      void audio.current?.close().catch(() => {});
      audio.current = null;
    } else if (started) {
      try {
        audio.current = birthdayMusic();
      } catch {
        return;
      }
    }
    setMusic(!music);
  }
  function blow() {
    setLit(false);
    void audio.current?.close().catch(() => {});
    audio.current = null;
    setMusic(false);
  }
  return (
    <main
      className={`birthday-prelude ${started ? "has-started" : "is-waiting"} ${lit ? "candles-lit" : "wish-made"}`}
      data-reduced={reduced}
    >
      <header className="prelude-header">
        <span>from Hugsy, with love.</span>
        <button onClick={toggleMusic} aria-pressed={music}>
          Sound {music ? "on" : "off"}
        </button>
      </header>
      <div className="prelude-sparkles" aria-hidden="true">
        {Array.from({ length: 24 }, (_, i) => (
          <i
            key={i}
            style={
              {
                "--i": i,
                left: `${(i * 37) % 100}%`,
                top: `${(i * 23) % 95}%`,
              } as CSSProperties
            }
          />
        ))}
      </div>
      {!started ? (
        <section className="prelude-invitation">
          <span className="prelude-eyebrow">
            TODAY IS A LITTLE MORE SPECIAL
          </span>
          <h1>
            A day for <em>you.</em>
          </h1>
          <p>JV, I made you a little birthday magic.</p>
          <button className="prelude-start" onClick={start}>
            Start the celebration <span aria-hidden="true">↗</span>
          </button>
          <span className="invitation-footnote">
            a wish, a little wonder, and something from me.
          </span>
        </section>
      ) : (
        <>
          <div className="prelude-balloons" aria-hidden="true">
            {Array.from({ length: 8 }, (_, i) => (
              <i key={i} style={{ "--i": i } as CSSProperties} />
            ))}
          </div>
          <div
            className={`prelude-confetti ${!lit ? "wish-confetti" : ""}`}
            key={lit ? "hello" : "wish"}
            aria-hidden="true"
          >
            {Array.from({ length: 54 }, (_, i) => (
              <i
                key={i}
                style={
                  {
                    "--i": i,
                    left: `${(i * 43) % 100}%`,
                    "--fall-duration": `${6 + (i % 5) * 0.8}s`,
                    "--fall-delay": `${(i % 12) * 0.2}s`,
                  } as CSSProperties
                }
              />
            ))}
          </div>
          <section
            className="prelude-celebration"
            aria-label="JV's birthday celebration"
          >
            <div className="birthday-bunting" aria-label="Happy birthday">
              <span aria-hidden="true">
                {"HAPPY BIRTHDAY".split("").map((c, i) => (
                  <i
                    key={i}
                    style={
                      {
                        "--i": i,
                        "--hang": `${17 - Math.abs(6 - i) * 2.5}px`,
                      } as CSSProperties
                    }
                  >
                    {c}
                  </i>
                ))}
              </span>
            </div>
            <h1>
              JV<span>.</span>
            </h1>
            <p className="prelude-typed">
              <span className="sr-only">{phrase}</span>
              <span aria-hidden="true">
                {typed}
                <span className="typing-caret">|</span>
              </span>
            </p>
            <div className="prelude-cake-stage">
              <BirthdayCake lit={lit} />
            </div>
            {lit ? (
              <div className="prelude-wish">
                <h2>
                  Close your eyes. <em>Make a wish.</em>
                </h2>
                <CandleBlower
                  lit={lit}
                  onBlow={blow}
                  onListen={() => {
                    void audio.current?.close().catch(() => {});
                    audio.current = null;
                    setMusic(false);
                  }}
                />
              </div>
            ) : (
              <div className="prelude-wish wish-success" role="status">
                <span className="prelude-eyebrow">
                  A LITTLE WISH, SENT TO THE UNIVERSE
                </span>
                <h2>
                  May it all come <em>true.</em>
                </h2>
                <p>There’s a little more waiting for you.</p>
                <button
                  ref={continueButton}
                  className="prelude-continue"
                  onClick={onComplete}
                >
                  Open your birthday box <span aria-hidden="true">↗</span>
                </button>
              </div>
            )}
          </section>
        </>
      )}
    </main>
  );
}
