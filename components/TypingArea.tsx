"use client";

import { useMemo } from "react";

type GamePhase = "idle" | "countdown" | "running" | "finished";

type TypingAreaProps = {
  text: string;
  input: string;
  timeLeft: number;
  countdownLeft: number;
  wpm: number;
  accuracy: number;
  phase: GamePhase;
  onInputChange: (value: string) => void;
  inputRef: React.RefObject<HTMLInputElement | null>;
};

export function TypingArea({
  text,
  input,
  timeLeft,
  countdownLeft,
  wpm,
  accuracy,
  phase,
  onInputChange,
  inputRef,
}: TypingAreaProps) {
  const isRunning = phase === "running";
  const isCountdown = phase === "countdown";

  const renderedText = useMemo(() => {
    return text.split("").map((char, index) => {
      let className = "text-slate-500";

      if (index < input.length) {
        className = input[index] === char ? "text-emerald-400" : "text-rose-400";
      }

      const isCursor = isRunning && index === input.length;

      return (
        <span
          key={`${char}-${index}`}
          className={`${className} transition-colors ${
            isCursor ? "rounded-sm bg-cyan-500/20 underline decoration-cyan-300 decoration-2 underline-offset-4" : ""
          }`}
        >
          {char}
        </span>
      );
    });
  }, [input, isRunning, text]);

  return (
    <section className="relative rounded-2xl border border-slate-700/60 bg-slate-900/80 p-6">
      <input
        ref={inputRef}
        value={input}
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
        spellCheck={false}
        disabled={phase === "idle" || phase === "finished"}
        onChange={(event) => onInputChange(event.target.value)}
        className="pointer-events-none absolute left-0 top-0 h-0 w-0 opacity-0"
        aria-label="Typing input"
      />

      <div className="mb-4 flex flex-wrap items-center gap-3">
        <StatPill label="Time" value={`${timeLeft}s`} />
        {isCountdown ? <StatPill label="Start" value={`${countdownLeft}`} /> : null}
        <StatPill label="WPM" value={`${wpm}`} />
        <StatPill label="Accuracy" value={`${accuracy.toFixed(1)}%`} />
      </div>

      <div className="relative overflow-hidden rounded-xl border border-slate-700 bg-slate-950/80 p-5">
        {isCountdown ? (
          <div className="grid min-h-65 place-items-center text-center">
            <div>
              <p className="text-xs uppercase tracking-[0.35em] text-cyan-300">Get ready</p>
              <div className="mt-4 text-7xl font-bold text-white sm:text-8xl">{countdownLeft}</div>
              <p className="mt-3 text-sm text-slate-400">The typing lane opens in a moment.</p>
            </div>
          </div>
        ) : isRunning ? (
          <button
            type="button"
            onClick={() => inputRef.current?.focus()}
            className="w-full text-left text-2xl leading-relaxed tracking-wide"
          >
            {renderedText}
          </button>
        ) : (
          <button
            type="button"
            onClick={() => inputRef.current?.focus()}
            className="w-full rounded-xl border border-dashed border-slate-700 bg-slate-950/80 p-8 text-center"
          >
            <p className="text-xs uppercase tracking-[0.35em] text-cyan-300">Ready</p>
            <p className="mt-3 text-xl text-slate-200">Start the round, then type any character to launch the countdown.</p>
            <p className="mt-2 text-sm text-slate-500">The paragraph stays hidden until the sprint begins.</p>
          </button>
        )}
      </div>
    </section>
  );
}

type StatPillProps = {
  label: string;
  value: string;
};

function StatPill({ label, value }: StatPillProps) {
  return (
    <div className="rounded-full border border-slate-700 bg-slate-950/70 px-4 py-2">
      <span className="text-xs uppercase tracking-wider text-slate-400">{label}</span>
      <span className="ml-2 font-mono text-sm text-cyan-300">{value}</span>
    </div>
  );
}
