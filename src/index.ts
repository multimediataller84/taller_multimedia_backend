import http from "http";
import app from "./app/appConfig.js";
import { initDB } from "./database/init.js";

const server = http.createServer(app);

initDB();

const port = process.env.PORT ?? 3000;

server.listen(port, () => {
  console.log(`http://localhost:${port}`);
});

