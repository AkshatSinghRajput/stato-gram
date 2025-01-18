import _mongoose, { connect } from "mongoose";

// Define global types for mongoose connection caching
declare global {
  var mongoose: {
    promise: ReturnType<typeof connect> | null;
    conn: typeof _mongoose | null;
  };
}

// Get MongoDB connection string from environment variables
const MONGODB_URI = process.env.DATABASE_URL;

// Validate MongoDB URI exists
if (!MONGODB_URI) {
  throw new Error(
    "Please define the MONGODB_URI environment variable inside .env.local"
  );
}

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections from growing exponentially
 * during API Route usage.
 */
let cached = global.mongoose;

// Initialize cache if not exists
if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function dbConnect() {
  // Return existing connection if available
  if (cached.conn) {
    return cached.conn;
  }

  // Create new connection if none is pending
  if (!cached.promise) {
    const opts = {
      bufferCommands: false, // Disable mongoose buffering
    };

    // Establish connection and store promise
    cached.promise = connect(MONGODB_URI!, opts).then((mongoose) => {
      return mongoose;
    });
  }

  try {
    // Await connection and store in cache
    cached.conn = await cached.promise;
  } catch (e) {
    // Reset promise on error
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

export default dbConnect;
