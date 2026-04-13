# BuilderRush v2

BuilderRush v2 is a real-time typing competition game designed for event booths with shared leaderboard updates across multiple systems.

## Stack

- Next.js App Router + TypeScript
- Tailwind CSS v4
- Custom Node server with Socket.IO
- MongoDB + Mongoose

## Core Features

- 45-second typing rounds
- Hidden input with real-time character highlighting
- Client-side WPM and accuracy calculations
- Final score sync through Socket.IO (`score:final`)
- Global top-10 leaderboard broadcast (`leaderboard:update`)
- MongoDB persistence for all submitted scores

## Environment Variables

Create a `.env.local` from `.env.example` and set values:

```bash
MONGODB_URI=mongodb://127.0.0.1:27017/builderrush
NEXT_PUBLIC_SOCKET_URL=
PORT=3000
```

`NEXT_PUBLIC_SOCKET_URL` can stay empty for same-origin socket connections.

## Local Development

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Production Mode

```bash
npm run build
npm run start
```

## Project Structure

- `app/page.tsx` main game UI and socket orchestration
- `components/NameInput.tsx` player name + start controls
- `components/TypingArea.tsx` typing surface and live metrics
- `components/ResultModal.tsx` final round summary and replay
- `components/Leaderboard.tsx` shared global ranking table
- `hooks/useTypingEngine.ts` game timing and metric engine
- `lib/paragraphs.ts` predefined paragraph pool
- `lib/socket.ts` singleton socket client
- `lib/db.ts` MongoDB connection and Score model
- `server/index.ts` custom Next.js + Socket.IO server
