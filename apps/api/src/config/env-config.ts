import { getEnv } from "../utils/get-env";

export const Env = {
  NODE_ENV: getEnv("NODE_ENV", "development"),
  PORT: getEnv("PORT", "4000"),
  MONGO_URI: getEnv("MONGO_URI"),
  JWT_ACCESS_SECRET: getEnv("JWT_ACCESS_SECRET", "secret_jwt"),
  JWT_REFRESH_SECRET: getEnv("JWT_REFRESH_SECRET", "secret_jwt"),
  FRONTEND_URL: getEnv("FRONTEND_URL", "http://localhost:3000"),
  GOOGLE_CLIENT_ID: getEnv("GOOGLE_CLIENT_ID"),
  GOOGLE_CLIENT_SECRET: getEnv("GOOGLE_CLIENT_SECRET"),
} as const;