"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

type TypingEngineOptions = {
  duration?: number;
  onFinish?: (result: GameResult) => void;
};

type GamePhase = "idle" | "countdown" | "running" | "finished";

type GameResult = {
  wpm: number;
  accuracy: number;
  totalTyped: number;
  correctChars: number;
};

export function useTypingEngine({ duration = 45, onFinish }: TypingEngineOptions = {}) {
  const [text, setText] = useState("");
  const [input, setInput] = useState("");
  const [timeLeft, setTimeLeft] = useState(duration);
  const [phase, setPhase] = useState<GamePhase>("idle");
  const [countdownLeft, setCountdownLeft] = useState(3);

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const countdownRef = useRef<NodeJS.Timeout | null>(null);
  const finishSentRef = useRef(false);

  const totalTyped = input.length;

  const correctChars = useMemo(() => {
    if (!text || totalTyped === 0) {
      return 0;
    }

    let correct = 0;
    for (let i = 0; i < totalTyped; i += 1) {
      if (input[i] === text[i]) {
        correct += 1;
      }
    }

    return correct;
  }, [input, text, totalTyped]);

  const elapsedSeconds = duration - timeLeft;
  const elapsedMinutes = elapsedSeconds / 60;

  const wpm = useMemo(() => {
    if (elapsedMinutes <= 0 || totalTyped <= 0) {
      return 0;
    }

    return Math.max(0, Math.round((totalTyped / 5) / elapsedMinutes));
  }, [elapsedMinutes, totalTyped]);

  const accuracy = useMemo(() => {
    if (totalTyped <= 0) {
      return 100;
    }

    return Number(((correctChars / totalTyped) * 100).toFixed(1));
  }, [correctChars, totalTyped]);

  const startGame = useCallback(
    (nextText: string) => {
      setText(nextText);
      setInput("");
      setTimeLeft(duration);
      setCountdownLeft(3);
      setPhase("countdown");
      finishSentRef.current = false;
    },
    [duration],
  );

  const stopGame = useCallback(() => {
    setPhase("finished");
  }, []);

  const resetGame = useCallback(() => {
    setInput("");
    setTimeLeft(duration);
    setCountdownLeft(3);
    setPhase("idle");
    setText("");
    finishSentRef.current = false;
  }, [duration]);

  const handleInputChange = useCallback(
    (value: string) => {
      if (phase === "idle" || phase === "countdown" || phase === "finished") {
        return;
      }

      if (phase === "running") {
        setInput(value);
      }
    },
    [phase],
  );

  useEffect(() => {
    if (phase !== "running") {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      intervalRef.current = null;
      return;
    }

    intervalRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
          }

          setPhase("finished");
          return 0;
        }

        return prev - 1;
      });
    }, 1000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      intervalRef.current = null;
    };
  }, [phase]);

  useEffect(() => {
    if (phase !== "countdown") {
      if (countdownRef.current) {
        clearInterval(countdownRef.current);
      }
      countdownRef.current = null;
      return;
    }

    countdownRef.current = setInterval(() => {
      setCountdownLeft((prev) => {
        if (prev <= 1) {
          if (countdownRef.current) {
            clearInterval(countdownRef.current);
            countdownRef.current = null;
          }

          setInput("");
          setTimeLeft(duration);
          setPhase("running");
          return 0;
        }

        return prev - 1;
      });
    }, 1000);

    return () => {
      if (countdownRef.current) {
        clearInterval(countdownRef.current);
      }
      countdownRef.current = null;
    };
  }, [duration, phase]);

  useEffect(() => {
    if (phase !== "finished" || finishSentRef.current) {
      return;
    }

    finishSentRef.current = true;
    onFinish?.({
      wpm,
      accuracy,
      totalTyped,
      correctChars,
    });
  }, [accuracy, correctChars, onFinish, phase, totalTyped, wpm]);

  const result: GameResult = {
    wpm,
    accuracy,
    totalTyped,
    correctChars,
  };

  return {
    text,
    input,
    setInput: handleInputChange,
    timeLeft,
    countdownLeft,
    phase,
    result,
    startGame,
    stopGame,
    resetGame,
    cursorIndex: input.length,
  };
}