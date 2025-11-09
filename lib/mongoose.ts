import mongoose from 'mongoose';

const MONGO_URI = process.env.MONGO_URI!;
if (!MONGO_URI) throw new Error('Missing MONGO_URI');

interface GlobalMongoose {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  // eslint-disable-next-line no-var
  var _mongoose: GlobalMongoose | undefined;
}

let cached = global._mongoose || { conn: null, promise: null };

export async function dbConnect() {
  if (cached.conn) return cached.conn;
  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGO_URI, {
      // You can add options here if needed
      serverSelectionTimeoutMS: 20000, // 20 seconds
    });
  }
  cached.conn = await cached.promise;
  global._mongoose = cached;
  return cached.conn;
}
