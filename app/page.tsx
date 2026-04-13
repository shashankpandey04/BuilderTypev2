"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Leaderboard, type LeaderboardEntry } from "@/components/Leaderboard";
import { NameInput } from "@/components/NameInput";
import { ResultModal } from "@/components/ResultModal";
import { TypingArea } from "@/components/TypingArea";
import { useTypingEngine } from "@/hooks/useTypingEngine";
import { paragraphs } from "@/lib/paragraphs";
import { getSocket } from "@/lib/socket";

type FinalScorePayload = {
  name: string;
  wpm: number;
  accuracy: number;
  timestamp: string;
};

export default function Page() {
  const [name, setName] = useState("");
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [latestRun, setLatestRun] = useState<FinalScorePayload | null>(null);
  const [resultOpen, setResultOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const hasSubmittedRef = useRef(false);

  const handleFinish = useCallback(
    (result: { wpm: number; accuracy: number }) => {
      if (!name.trim() || hasSubmittedRef.current) {
        return;
      }

      const payload: FinalScorePayload = {
        name: name.trim(),
        wpm: result.wpm,
        accuracy: Number(result.accuracy.toFixed(1)),
        timestamp: new Date().toISOString(),
      };

      setLatestRun(payload);
      getSocket().emit("score:final", payload);
      setName("");
      hasSubmittedRef.current = true;
      setResultOpen(true);
    },
    [name],
  );

  const {
    text,
    input,
    setInput,
    timeLeft,
    countdownLeft,
    phase,
    result,
    startGame,
    resetGame,
  } = useTypingEngine({ duration: 45, onFinish: handleFinish });

  const startNewGame = useCallback(() => {
    const randomParagraph = paragraphs[Math.floor(Math.random() * paragraphs.length)];
    startGame(randomParagraph);
    setLatestRun(null);
    setResultOpen(false);
    hasSubmittedRef.current = false;

    requestAnimationFrame(() => {
      inputRef.current?.focus();
    });
  }, [startGame]);

  const returnToLobby = useCallback(() => {
    resetGame();
    setName("");
    setLatestRun(null);
    setResultOpen(false);
    hasSubmittedRef.current = false;
    requestAnimationFrame(() => {
      inputRef.current?.focus();
    });
  }, [resetGame]);

  useEffect(() => {
    const socket = getSocket();

    const handleLeaderboardUpdate = (entries: LeaderboardEntry[]) => {
      setLeaderboard(entries);
    };

    socket.on("leaderboard:update", handleLeaderboardUpdate);

    return () => {
      socket.off("leaderboard:update", handleLeaderboardUpdate);
    };
  }, []);

  useEffect(() => {
    if (phase === "countdown" || phase === "running") {
      requestAnimationFrame(() => {
        inputRef.current?.focus();
      });
    }
  }, [phase]);

  const rank = useMemo(() => {
    if (!latestRun) {
      return null;
    }

    const matchIndex = leaderboard.findIndex(
      (entry) =>
        entry.name === latestRun.name &&
        entry.wpm === latestRun.wpm &&
        entry.timestamp === latestRun.timestamp,
    );

    return matchIndex >= 0 ? matchIndex + 1 : null;
  }, [latestRun, leaderboard]);

  const isImmersive = phase !== "idle" && phase !== "finished";

  return (
    <main className={isImmersive ? "min-h-screen px-4 py-6 md:px-8" : "mx-auto grid min-h-screen w-full max-w-7xl gap-6 px-4 py-8 md:grid-cols-[1fr_360px] md:px-8"}>
      {isImmersive ? (
        <section className="mx-auto flex min-h-[calc(100vh-3rem)] w-full max-w-5xl flex-col justify-center">
          <TypingArea
            text={text || "Press Start Game to load a random challenge paragraph."}
            input={input}
            timeLeft={timeLeft}
            countdownLeft={countdownLeft}
            wpm={result.wpm}
            accuracy={result.accuracy}
            phase={phase}
            onInputChange={setInput}
            inputRef={inputRef}
          />
        </section>
      ) : (
        <>
          <section className="space-y-5">
            <header className="rounded-2xl border border-cyan-500/20 bg-slate-900/60 p-6 shadow-[0_30px_120px_-60px_rgba(6,182,212,0.65)]">
              <p className="text-xs uppercase tracking-[0.2em] text-cyan-300">Typing Arena</p>
              <h1 className="mt-2 text-4xl font-bold tracking-tight text-white sm:text-5xl">
                BuilderType
              </h1>
              <p className="mt-3 max-w-2xl text-sm text-slate-300">
                Type with speed and precision. Every completed run syncs instantly across all event systems.
              </p>
            </header>

            <NameInput name={name} onNameChange={setName} onStart={startNewGame} isRunning={phase !== "idle"} />

            <TypingArea
              text={text || "Press Start Game to load a random challenge paragraph."}
              input={input}
              timeLeft={timeLeft}
              countdownLeft={countdownLeft}
              wpm={result.wpm}
              accuracy={result.accuracy}
              phase={phase}
              onInputChange={setInput}
              inputRef={inputRef}
            />
          </section>

          <Leaderboard entries={leaderboard} />
        </>
      )}

      <ResultModal
        open={resultOpen}
        wpm={latestRun?.wpm ?? result.wpm}
        accuracy={latestRun?.accuracy ?? result.accuracy}
        rank={rank}
        onPlayAgain={returnToLobby}
      />
    </main>
  );
}