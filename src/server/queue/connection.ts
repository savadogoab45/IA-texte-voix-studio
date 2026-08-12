import { Queue } from "bullmq";
import { Redis } from "ioredis";

export const connection = new Redis({
  host: "localhost",
  port: 6379,
  maxRetriesPerRequest: null,
});

connection.on("connect", () => {
  console.log("✅ Connected to Redis");
});

connection.on("error", (err) => {
  console.error("❌ Redis connection error:", err);
});

export const generationQueue = new Queue("generation", {
  connection,
});
