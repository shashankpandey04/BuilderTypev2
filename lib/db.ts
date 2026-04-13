import mongoose, { Model, Schema } from "mongoose";

type ScoreDocument = {
  name: string;
  wpm: number;
  accuracy: number;
  createdAt: Date;
};

const scoreSchema = new Schema<ScoreDocument>(
  {
    name: { type: String, required: true, trim: true, maxlength: 20 },
    wpm: { type: Number, required: true, min: 0 },
    accuracy: { type: Number, required: true, min: 0, max: 100 },
    createdAt: { type: Date, default: () => new Date(), index: true },
  },
  {
    versionKey: false,
  },
);

scoreSchema.index({ wpm: -1 });
scoreSchema.index({ createdAt: -1 });

declare global {
  var mongooseCache:
    | {
        conn: typeof mongoose | null;
        promise: Promise<typeof mongoose> | null;
      }
    | undefined;
}

const mongooseCache = global.mongooseCache ?? { conn: null, promise: null };
global.mongooseCache = mongooseCache;

export async function connectToDatabase() {
  const mongoUri = process.env.MONGODB_URI;

  if (!mongoUri) {
    throw new Error("MONGODB_URI is not configured.");
  }

  if (mongooseCache.conn) {
    return mongooseCache.conn;
  }

  if (!mongooseCache.promise) {
    mongooseCache.promise = mongoose.connect(mongoUri);
  }

  mongooseCache.conn = await mongooseCache.promise;
  return mongooseCache.conn;
}

export const Score: Model<ScoreDocument> =
  (mongoose.models.Score as Model<ScoreDocument>) || mongoose.model<ScoreDocument>("Score", scoreSchema);

export type { ScoreDocument };
