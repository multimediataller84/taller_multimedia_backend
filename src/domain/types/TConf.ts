export type TConfig = {
  DATABASE: string;
  USER: string;
  PASSWORD: string;
  HOST: string;
  JWT_ACCESS_SECRET: string;
  // Modificado para que el tiempo de expiracion del token sea variable de entorno
  JWT_EXPIRES_IN: string;
  NODE_ENV: string;
  CORS_ORIGIN: string;
  PORT: string;
  URL: string;
  DB_PORT: string;
};
