import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

// CORS
app.use(cors({
  origin: process.env.CORS_ORIGIN || "*",
  credentials: true
}));

// Body parsing
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));

// Cookies
app.use(cookieParser());

// Static files
app.use(express.static("public"));

// Root route (IMPORTANT for Render/browser check)
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Videotube API is running 🚀"
  });
});

// Routes
import userRouter from "./routes/user.routes.js";
app.use("/api/v1/users", userRouter);

export { app };