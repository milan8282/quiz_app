import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";

import authRoutes from "./routes/auth.routes.js";
import adminQuizRoutes from "./routes/adminQuiz.routes.js";
import quizRoutes from "./routes/quiz.routes.js";
import attemptRoutes from "./routes/attempt.routes.js";
import importRoutes from "./routes/import.routes.js";

import { errorHandler, notFound } from "./middlewares/error.middleware.js";

dotenv.config();

const app = express();

app.use(helmet());

// Global CORS
app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 300,
    message: {
      success: false,
      message: "Too many requests, please try again later",
    },
  })
);

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Quiz API is running",
  });
});

app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "Server healthy",
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/admin/quizzes", adminQuizRoutes);
app.use("/api/quizzes", quizRoutes);
app.use("/api/attempts", attemptRoutes);
app.use("/api/import", importRoutes);


app.use(notFound);
app.use(errorHandler);

export default app;