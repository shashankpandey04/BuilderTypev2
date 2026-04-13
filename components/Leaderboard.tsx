"use client";

export type LeaderboardEntry = {
  name: string;
  wpm: number;
  accuracy: number;
  timestamp: string;
};

type LeaderboardProps = {
  entries: LeaderboardEntry[];
  variant?: "compact" | "display";
};

export function Leaderboard({ entries, variant = "compact" }: LeaderboardProps) {
  const isDisplay = variant === "display";

  return (
    <aside
      className={
        isDisplay
          ? "rounded-3xl border border-cyan-500/20 bg-slate-950/60 p-5 shadow-[0_40px_140px_-70px_rgba(6,182,212,0.55)] backdrop-blur md:p-8"
          : "h-fit rounded-2xl border border-slate-700/60 bg-slate-900/75 p-6"
      }
    >
      <div className={isDisplay ? "flex flex-col gap-4 md:flex-row md:items-end md:justify-between" : ""}>
        <div>
          <p className={isDisplay ? "text-xs uppercase tracking-[0.3em] text-cyan-300" : "text-xs uppercase tracking-wide text-slate-400"}>
            {isDisplay ? "BuilderRush v2" : "Live booth ranking"}
          </p>
          <h2 className={isDisplay ? "mt-2 text-4xl font-bold tracking-tight text-white md:text-6xl" : "mt-1 text-xl font-semibold text-slate-100"}>
            Global Top 10
          </h2>
          <p className={isDisplay ? "mt-3 max-w-2xl text-sm text-slate-300 md:text-base" : "mt-1 text-xs uppercase tracking-wide text-slate-400"}>
            {isDisplay
              ? "The fastest scoreboards from every connected system appear here instantly."
              : "Live booth ranking"}
          </p>
        </div>

        {isDisplay ? (
          <div className="rounded-2xl border border-slate-700 bg-slate-900/80 px-4 py-3 text-right">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Sync Status</p>
            <p className="mt-1 text-lg font-semibold text-emerald-300">Live</p>
          </div>
        ) : null}
      </div>

      <div className={isDisplay ? "mt-6 overflow-hidden rounded-3xl border border-slate-800/80" : "mt-4 overflow-hidden rounded-xl border border-slate-800"}>
        <table className={isDisplay ? "w-full table-fixed text-left" : "w-full text-left text-sm"}>
          <thead className={isDisplay ? "bg-slate-950/90 text-slate-400" : "bg-slate-950/80 text-slate-400"}>
            <tr className={isDisplay ? "text-sm uppercase tracking-[0.18em]" : ""}>
              <th className={isDisplay ? "w-16 px-5 py-4" : "px-3 py-2"}>#</th>
              <th className={isDisplay ? "px-5 py-4" : "px-3 py-2"}>Name</th>
              <th className={isDisplay ? "w-32 px-5 py-4 text-right" : "px-3 py-2 text-right"}>WPM</th>
            </tr>
          </thead>
          <tbody>
            {entries.length === 0 ? (
              <tr>
                <td colSpan={3} className={isDisplay ? "px-5 py-12 text-center text-slate-500" : "px-3 py-8 text-center text-slate-500"}>
                  No runs yet.
                </td>
              </tr>
            ) : (
              entries.map((entry, index) => (
                <tr
                  key={`${entry.name}-${entry.timestamp}-${index}`}
                  className={
                    isDisplay
                      ? "border-t border-slate-800/80 text-slate-100 transition hover:bg-cyan-500/5"
                      : "border-t border-slate-800 text-slate-200"
                  }
                >
                  <td className={isDisplay ? "px-5 py-5 font-mono text-2xl text-cyan-300" : "px-3 py-2 font-mono text-cyan-300"}>
                    {index + 1}
                  </td>
                  <td className={isDisplay ? "px-5 py-5 text-xl font-medium text-slate-100" : "px-3 py-2 max-w-40 truncate"}>
                    <span className={isDisplay ? "block truncate" : "truncate block"}>{entry.name}</span>
                  </td>
                  <td className={isDisplay ? "px-5 py-5 text-right font-mono text-3xl font-semibold text-emerald-300" : "px-3 py-2 text-right font-mono text-emerald-300"}>
                    {entry.wpm}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </aside>
  );
}
