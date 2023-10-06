import express from "express";
import routes from "./routes";
import errorHandler from "./middleware/errorHandler";
import logger from "./middleware/logger";
import cookieParser from "cookie-parser";
import cors from "cors";

const app = express();

app.use(logger);
app.use(express.json());
app.use(cors({ credentials: true, origin: ["http://localhost:3000"] }));
app.use(cookieParser());
app.use(routes);
app.use(errorHandler);

export default app;
