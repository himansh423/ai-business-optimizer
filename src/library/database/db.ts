/* eslint-disable */
import mongoose, { Connection, Mongoose } from "mongoose";

// Defined the cached structure type
interface MongooseCache {
  conn: Connection | null;
  promise: Promise<Mongoose> | null;
}

// Properly defined the global type augmentation
declare global {
  var mongoose:
    | {
        conn: Connection | null;
        promise: Promise<Mongoose> | null;
      }
    | undefined;
}

const MONGODB_URI = process.env.MONGO_URI as string;

if (!MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable");
}

let cached: MongooseCache = global.mongoose || { conn: null, promise: null };

if (!global.mongoose) {
  global.mongoose = cached;
}

async function connectToDatabase(): Promise<Connection> {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts: mongoose.ConnectOptions = {
      bufferCommands: false,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      return mongoose;
    });
  }

  try {
    const client = await cached.promise;
    cached.conn = client.connection;
  } catch (e) {
    cached.promise = null;
    console.error("MongoDB connection error:", e);
    throw e;
  }

  return cached.conn;
}

export default connectToDatabase;
