"use client";

type NameInputProps = {
  name: string;
  onNameChange: (value: string) => void;
  onStart: () => void;
  isRunning: boolean;
};

export function NameInput({ name, onNameChange, onStart, isRunning }: NameInputProps) {
  const canStart = name.trim().length >= 2 && !isRunning;

  return (
    <div className="rounded-2xl border border-slate-700/60 bg-slate-900/70 p-6 shadow-[0_20px_80px_-50px_rgba(0,0,0,0.9)] backdrop-blur">
      <h2 className="text-2xl font-semibold tracking-tight text-slate-100">Pilot Profile</h2>
      <p className="mt-2 text-sm text-slate-400">Enter your name, launch the 45 second sprint, and climb the live leaderboard.</p>

      <div className="mt-5 flex flex-col gap-3 sm:flex-row">
        <input
          type="text"
          value={name}
          maxLength={20}
          onChange={(event) => onNameChange(event.target.value)}
          placeholder="Builder name"
          disabled={isRunning}
          className="h-12 w-full rounded-xl border border-slate-600 bg-slate-950 px-4 text-lg text-slate-100 outline-none ring-0 placeholder:text-slate-500 transition focus:border-cyan-500"
        />
        <button
          type="button"
          onClick={onStart}
          disabled={!canStart}
          className="h-12 min-w-36 rounded-xl bg-linear-to-r from-cyan-500 to-emerald-500 px-5 text-sm font-semibold uppercase tracking-wide text-slate-950 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Start Game
        </button>
      </div>
    </div>
  );
}
