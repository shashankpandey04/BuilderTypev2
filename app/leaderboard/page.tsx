"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Leaderboard, type LeaderboardEntry } from "@/components/Leaderboard";
import { getSocket } from "@/lib/socket";

export default function LeaderboardPage() {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);

  useEffect(() => {
    const socket = getSocket();

    const handleLeaderboardUpdate = (nextEntries: LeaderboardEntry[]) => {
      setEntries(nextEntries);
    };

    socket.on("leaderboard:update", handleLeaderboardUpdate);

    return () => {
      socket.off("leaderboard:update", handleLeaderboardUpdate);
    };
  }, []);

  return (
    <main className="min-h-screen px-4 py-6 md:px-8">
      <div className="mx-auto flex min-h-[calc(100vh-3rem)] max-w-7xl flex-col rounded-3xl border border-cyan-500/20 bg-slate-950/45 p-5 shadow-[0_40px_140px_-70px_rgba(6,182,212,0.55)] backdrop-blur md:p-8">
        <Leaderboard entries={entries} variant="display" />

        <footer className="mt-6 border-t border-slate-800 pt-4 text-sm text-slate-400">
          <Link href="/" className="text-cyan-300 transition hover:text-cyan-200">
            Back to game screen
          </Link>
        </footer>
      </div>
    </main>
  );
}