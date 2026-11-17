import { useBlowCandles } from "./useBlowCandles";

export function CandleBlower({
  lit,
  onBlow,
  onListen,
}: {
  lit: boolean;
  onBlow: () => void;
  onListen?: () => void;
}) {
  const mic = useBlowCandles(onBlow, lit);
  if (!lit) return null;
  const active = ["requesting", "calibrating", "listening"].includes(mic.state);
  return (
    <div className="candle-blower" data-mic-state={mic.state}>
      <button
        className="wish-mic-button"
        onClick={() => {
          if (active) mic.stop();
          else {
            onListen?.();
            void mic.start();
          }
        }}
      >
        {active
          ? "Stop microphone"
          : mic.state === "error"
            ? "Try microphone again"
            : "Blow out the candles · use microphone"}
      </button>
      {active && (
        <div
          className="breath-meter"
          role="meter"
          aria-label="Your breath"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(mic.level * 100)}
        >
          <span style={{ transform: `scaleX(${mic.level})` }} />
        </div>
      )}
      <p className="wish-mic-status" role="status">
        {mic.state === "requesting"
          ? "Allow microphone access to make your wish."
          : mic.state === "calibrating"
            ? "A quiet moment… getting ready."
            : mic.state === "listening"
              ? "Make a wish, then blow gently towards your microphone."
              : mic.state === "error"
                ? mic.message
                : "Your microphone is used only here. Nothing is recorded."}
      </p>
      <button
        className="wish-tap-button"
        onClick={() => {
          mic.stop();
          onBlow();
        }}
      >
        Blow out with a tap
      </button>
    </div>
  );
}
