import type { TConfig } from "../models/types/TConf.js";
import { env } from "./validator.js";

export const config: TConfig = {
  DATABASE: env.DATABASE,
  USER: env.USER,
  PASSWORD: env.PASSWORD,
  HOST: env.HOST,
  JWT_ACCESS_SECRET: env.JWT_ACCESS_SECRET,
  //Agregado el as jwt.Secret para que no de error
  JWT_EXPIRES_IN: env.JWT_EXPIRES_IN,
  NODE_ENV: env.NODE_ENV,
  CORS_ORIGIN: env.CORS_ORIGIN,
  PORT: env.PORT,
  URL: env.URL,
  DB_PORT: env.DB_PORT,
};