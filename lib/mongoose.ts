import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGO_URI!;
if (!MONGODB_URI) throw new Error('Missing MONGODB_URI');

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
    cached.promise = mongoose.connect(MONGODB_URI, {
      // You can add options here if needed
    });
  }
  cached.conn = await cached.promise;
  global._mongoose = cached;
  return cached.conn;
}
