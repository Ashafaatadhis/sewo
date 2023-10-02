import express from "express";
import routes from "./routes";
import errorHandler from "./middleware/errorHandler";
import logger from "./middleware/logger";
import cors from "cors";

const app = express();

app.use(logger);
app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);
app.use(routes);
app.use(errorHandler);

export default app;
