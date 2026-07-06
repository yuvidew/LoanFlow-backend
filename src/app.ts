import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import {env} from "./config/env";
import { errorHandler } from "./middleware/error-handler";
import { notFound } from "./middleware/not-found";
import routes from "./routes";

const app = express();

// CORS configuration
app.use(
    cors({
        origin: env.CLIENT_URL, 
        credentials: true,
    })
);

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

// Mount the API routes
app.use("/api/v1", routes);

// Handle 404 Not Found errors
app.use(notFound);

// Handle errors
app.use(errorHandler);

export default app;