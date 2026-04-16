"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Leaderboard, type LeaderboardEntry } from "@/components/Leaderboard";
import { ChallengeChoiceModal } from "@/components/ChallengeChoiceModal";
import { CodeLanguageModal } from "@/components/CodeLanguageModal";
import { NameInput } from "@/components/NameInput";
import { ResultModal } from "@/components/ResultModal";
import { TypingArea } from "@/components/TypingArea";
import { useTypingEngine } from "@/hooks/useTypingEngine";
import { codeSnippetsByLanguage, type CodeLanguage } from "@/lib/codeSnippets";
import { paragraphs } from "@/lib/paragraphs";
import { getSocket } from "@/lib/socket";

type FinalScorePayload = {
  name: string;
  wpm: number;
  accuracy: number;
  timestamp: string;
};

type TypingMode = "paragraph" | "code";

type ChallengeKey = "paragraph" | CodeLanguage;

const RECENT_CHALLENGE_LIMIT = 4;

function pickChallenge(pool: string[], recent: string[]): string {
  const available = pool.filter((candidate) => !recent.includes(candidate));
  const source = available.length > 0 ? available : pool;
  return source[Math.floor(Math.random() * source.length)];
}

export default function Page() {
  const [name, setName] = useState("");
  const [selectedChallenge, setSelectedChallenge] = useState<"paragraph" | CodeLanguage | null>(null);
  const [challengeChoiceOpen, setChallengeChoiceOpen] = useState(false);
  const [codeModalOpen, setCodeModalOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState<CodeLanguage | null>(null);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [latestRun, setLatestRun] = useState<FinalScorePayload | null>(null);
  const [resultOpen, setResultOpen] = useState(false);
  const nameInputRef = useRef<HTMLInputElement | null>(null);
  const inputRef = useRef<HTMLTextAreaElement | null>(null);
  const hasSubmittedRef = useRef(false);
  const recentChallengesRef = useRef<Record<ChallengeKey, string[]>>({
    paragraph: [],
    java: [],
    cpp: [],
    python: [],
    javascript: [],
    go: [],
    rust: [],
    php: [],
    csharp: [],
  });

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

  const startNewGame = useCallback((challenge: "paragraph" | CodeLanguage) => {
    if (!name.trim()) {
      return;
    }

    const challengeKey: ChallengeKey = challenge;
    const source = challenge === "paragraph" ? paragraphs : codeSnippetsByLanguage[challenge];
    const nextText = pickChallenge(source, recentChallengesRef.current[challengeKey]);

    recentChallengesRef.current[challengeKey] = [
      ...recentChallengesRef.current[challengeKey],
      nextText,
    ].slice(-RECENT_CHALLENGE_LIMIT);

    setSelectedChallenge(challenge);
    startGame(nextText);
    setLatestRun(null);
    setResultOpen(false);
    hasSubmittedRef.current = false;
    setCodeModalOpen(false);
    setChallengeChoiceOpen(false);

    requestAnimationFrame(() => {
      inputRef.current?.focus();
    });
  }, [name, startGame]);

  const startParagraphRound = useCallback(() => {
    startNewGame("paragraph");
  }, [startNewGame]);

  const openChallengeChoice = useCallback(() => {
    if (name.trim().length < 2 || phase !== "idle") {
      return;
    }

    setChallengeChoiceOpen(true);
  }, [name, phase]);

  const openCodeModal = useCallback(() => {
    if (name.trim().length < 2 || phase !== "idle") {
      return;
    }

    setSelectedLanguage(null);
    setChallengeChoiceOpen(false);
    setCodeModalOpen(true);
  }, [name, phase]);

  const returnToLobby = useCallback(() => {
    resetGame();
    setName("");
    setSelectedChallenge(null);
    setChallengeChoiceOpen(false);
    setSelectedLanguage(null);
    setCodeModalOpen(false);
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

  useEffect(() => {
    if (phase === "idle") {
      requestAnimationFrame(() => {
        nameInputRef.current?.focus();
      });
    }
  }, [phase, codeModalOpen, challengeChoiceOpen]);

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

  const mode: TypingMode | null = selectedChallenge === null ? null : selectedChallenge === "paragraph" ? "paragraph" : "code";
  const language: CodeLanguage =
    selectedChallenge && selectedChallenge !== "paragraph"
      ? selectedChallenge
      : "python";

  const isImmersive = phase !== "idle" && phase !== "finished";

  return (
    <main className={isImmersive ? "px-4 py-6 md:px-8" : "px-4 py-6 md:px-8 md:py-8"}>
      {isImmersive ? (
        <section className="mx-auto w-full max-w-6xl">
          <div className="rounded-3xl border border-white/12 bg-[rgb(22,29,38)]/85 p-4 shadow-[0_28px_100px_-60px_rgba(0,0,0,0.8)] md:p-7">
            <TypingArea
              text={text || "Press Start Game to load your challenge text."}
              input={input}
              timeLeft={timeLeft}
              countdownLeft={countdownLeft}
              wpm={result.wpm}
              accuracy={result.accuracy}
              phase={phase}
              mode={mode}
              language={language}
              onInputChange={setInput}
              inputRef={inputRef}
            />
          </div>
        </section>
      ) : (
        <div className="mx-auto w-full max-w-350 space-y-6">
          <section className="rounded-3xl border border-white/12 bg-[rgb(22,29,38)]/88 p-6 shadow-[0_30px_110px_-70px_rgba(0,0,0,0.9)] md:p-8">
            <div className="grid gap-8 lg:grid-cols-[1.05fr_1fr] lg:items-center">
              <div>
                <p className="text-xs uppercase tracking-[0.24em] text-[rgb(191,128,255)]">Builder Center</p>
                <h1 className="mt-3 text-4xl font-bold tracking-tight text-white md:text-6xl">
                  Your speed.
                  <br />
                  Your precision.
                  <br />
                  Your BuilderType.
                </h1>
                <p className="mt-5 max-w-2xl text-base leading-relaxed text-white/80">
                  Connect with builders in real time. Launch a 45 second sprint, submit your run,
                  and watch the leaderboard update instantly across every connected screen.
                </p>
              </div>

              <div className="relative w-full overflow-hidden bg-[rgb(20,26,35)]" style={{ aspectRatio: '790/420' }}>
                <div className="absolute inset-0"
                  style={{
                    backgroundImage: 'linear-gradient(rgba(255,255,255,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.07) 1px, transparent 1px)',
                    backgroundSize: 'calc(100%/18) calc(100%/10)'
                  }} />
                <div className="absolute" style={{ left:'calc(100%/18*1)', top:'calc(100%/10*3.8)', width:'calc(100%/18*3.2)', height:'calc(100%/10*3.8)', background:'linear-gradient(145deg,#ff18b0,#e010a8)' }} />
                <div className="absolute" style={{ left:'calc(100%/18*5.5)', top:'calc(100%/10*5.5)', width:'calc(100%/18*2.5)', height:'calc(100%/10*2.8)', background:'linear-gradient(145deg,#c050d4,#a840bc)' }} />
                <div className="absolute" style={{ left:'calc(100%/18*8)', top:'calc(100%/10*5.5)', width:'calc(100%/18*1)', height:'calc(100%/10*1.1)', background:'linear-gradient(145deg,#a040b8,#9035ae)' }} />
                <div className="absolute" style={{ left:'calc(100%/18*8)', top:'calc(100%/10*0.9)', width:'calc(100%/18*3)', height:'calc(100%/10*4.6)', background:'linear-gradient(145deg,#9b72dc,#7e5cc4)' }} />
                <div className="absolute" style={{ left:'calc(100%/18*12.5)', top:'calc(100%/10*3.8)', width:'calc(100%/18*5.5)', height:'calc(100%/10*5)', background:'linear-gradient(145deg,#7b72dc,#5e99e8)' }} />
              </div>
            </div>
          </section>

          <section>
            <div className="space-y-5">
              <NameInput
                name={name}
                onNameChange={setName}
                onSubmit={openChallengeChoice}
                isRunning={phase !== "idle"}
                inputRef={nameInputRef}
              />

              <TypingArea
                text={
                  text ||
                  "Enter your name, choose paragraph or code mode, then press Start Game to load your challenge."
                }
                input={input}
                timeLeft={timeLeft}
                countdownLeft={countdownLeft}
                wpm={result.wpm}
                accuracy={result.accuracy}
                phase={phase}
                mode={mode}
                language={language}
                onInputChange={setInput}
                inputRef={inputRef}
              />
            </div>
          </section>
        </div>
      )}

      <ResultModal
        open={resultOpen}
        wpm={latestRun?.wpm ?? result.wpm}
        accuracy={latestRun?.accuracy ?? result.accuracy}
        rank={rank}
        onPlayAgain={returnToLobby}
      />

      <CodeLanguageModal
        open={codeModalOpen}
        selectedLanguage={selectedLanguage}
        onSelectLanguage={(languageChoice) => {
          setSelectedLanguage(languageChoice);
          setSelectedChallenge(languageChoice);
          startNewGame(languageChoice);
        }}
        onClose={() => {
          setSelectedLanguage(null);
          setCodeModalOpen(false);
        }}
      />

      <ChallengeChoiceModal
        open={challengeChoiceOpen}
        onSelectParagraph={() => startParagraphRound()}
        onSelectCode={openCodeModal}
        onClose={() => setChallengeChoiceOpen(false)}
      />
    </main>
  );
}