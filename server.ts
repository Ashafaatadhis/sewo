import express from "express";
import routes from "./routes/api";
import errorHandler from "./middleware/errorHandler";
import logger from "./middleware/logger";

const app = express();

app.use(logger);
app.use(routes);
app.use(errorHandler);

export default app;
