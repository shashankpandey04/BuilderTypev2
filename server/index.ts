import { loadEnvConfig } from "@next/env";
import { createServer } from "http";
import { Server } from "socket.io";
import next from "next";
import { connectToDatabase, Score } from "../lib/db";

loadEnvConfig(process.cwd());

const dev = process.env.NODE_ENV !== "production";
const port = Number(process.env.PORT ?? 3000);
const app = next({ dev });
const handle = app.getRequestHandler();

type ScorePayload = {
  name: string;
  wpm: number;
  accuracy: number;
  timestamp: string;
};

let leaderboard: ScorePayload[] = [];

function normalizeLeaderboard(entries: ScorePayload[]) {
  return entries
    .sort((a, b) => {
      if (b.wpm !== a.wpm) {
        return b.wpm - a.wpm;
      }

      return new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime();
    })
    .slice(0, 10);
}

async function hydrateLeaderboard() {
  const topScores = await Score.find({}, { _id: 0, __v: 0 })
    .sort({ wpm: -1, createdAt: 1 })
    .limit(10)
    .lean();

  leaderboard = normalizeLeaderboard(
    topScores.map((item) => ({
      name: item.name,
      wpm: item.wpm,
      accuracy: item.accuracy,
      timestamp: item.createdAt.toISOString(),
    })),
  );
}

app.prepare().then(() => {
  const server = createServer((req, res) => {
    handle(req, res);
  });

  const io = new Server(server);

  io.on("connection", (socket) => {
    socket.emit("leaderboard:update", leaderboard);

    socket.on("score:final", async (data: ScorePayload) => {
      if (!data || typeof data !== "object") {
        return;
      }

      const safeName = String(data.name ?? "").trim().slice(0, 20);
      const wpm = Number(data.wpm ?? 0);
      const accuracy = Number(data.accuracy ?? 0);
      const timestamp = typeof data.timestamp === "string" ? data.timestamp : new Date().toISOString();

      if (!safeName || Number.isNaN(wpm) || Number.isNaN(accuracy)) {
        return;
      }

      const payload: ScorePayload = {
        name: safeName,
        wpm: Math.max(0, Math.round(wpm)),
        accuracy: Math.max(0, Math.min(100, Number(accuracy.toFixed(1)))),
        timestamp,
      };

      leaderboard = normalizeLeaderboard([...leaderboard, payload]);

      try {
        await Score.create({
          name: payload.name,
          wpm: payload.wpm,
          accuracy: payload.accuracy,
          createdAt: new Date(payload.timestamp),
        });
      } catch (error) {
        console.error("Failed to persist score", error);
      }

      io.emit("leaderboard:update", leaderboard);
    });
  });

  connectToDatabase()
    .then(hydrateLeaderboard)
    .catch((error) => {
      console.error("MongoDB connection failed. Running with in-memory leaderboard only.", error);
    })
    .finally(() => {
      server.listen(port, () => {
        console.log(`BuilderRush v2 server listening at http://localhost:${port}`);
      });
    });
});