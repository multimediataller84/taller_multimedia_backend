import { z } from "zod";
import dotenv from "dotenv";

dotenv.config();

const envSchema = z.object({
  DATABASE: z.string(),
  USER: z.string(),
  PASSWORD: z.string(),
  HOST: z.string(),
  JWT_ACCESS_SECRET: z.string(),
  JWT_EXPIRES_IN: z.string(),
  NODE_ENV: z.string(),
  CORS_ORIGIN: z.string(),
  PORT: z.string(),
  URL: z.string(),
  DB_PORT: z.string(),
  PY_API: z.string(),
  HACIENDA_API_SANDBOX: z.string(),
  ENVIROMENT: z.string(),
  HACIENDA_TOKEN: z.string(),
  CERTIFICATE_PATH: z.string(),
  CERTIFICATE_PASSWORD: z.string(),
});

export const env = envSchema.parse(process.env);
