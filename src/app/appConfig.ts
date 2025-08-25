import express from "express";
import cors from "cors";
import helmet from "helmet";
import bodyParser from "body-parser";
import compression from "compression";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import { limiter } from "../utilities/limiter.js";
import { config } from "../utilities/config.js";
import router from "../routes/routes.js";

const app = express();

app.use(helmet());
app.use(cors({ origin: config.CORS_ORIGIN, credentials: true }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(compression());
app.use(morgan("combined"));
app.use(cookieParser());
app.use(limiter);

app.use("/api", router);

export default app;