import { MongoClient } from "mongodb"

const mongoUri =
  process.env.MONGODB_CONNECT_URI?.trim() ||
  process.env.MONGODB_URI?.trim() ||
  "mongodb://localhost:27017/Handigo"

const mongoDatabase = process.env.MONGODB_DB?.trim() || "Handigo"

/**
 * Keep a single MongoClient across hot reloads in development. Creating a new
 * client on every module evaluation quickly exhausts the connection pool.
 */
const globalForMongo = globalThis as typeof globalThis & {
  handigoMongoClient?: MongoClient
}

export const mongoClient =
  globalForMongo.handigoMongoClient ??
  new MongoClient(mongoUri, {
    maxPoolSize: 10,
    serverSelectionTimeoutMS: 8_000,
  })

if (process.env.NODE_ENV !== "production") {
  globalForMongo.handigoMongoClient = mongoClient
}

export const db = mongoClient.db(mongoDatabase)
