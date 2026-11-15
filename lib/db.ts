import { neon } from "@neondatabase/serverless";

export function isDatabaseConfigured() {
  return Boolean(process.env.DATABASE_URL);
}

export function getDatabase() {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL não está configurada.");
  }
  return neon(process.env.DATABASE_URL);
}
