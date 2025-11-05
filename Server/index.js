import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import authRoute from "./router/auth.js";
import userRoute from "./router/users.js";
import bookingRoute from "./router/bookings.js";
import blogRoute from "./router/blog.js";
import facilityRoute from "./router/facility.js";
import popupRoute from "./router/popup.js";   // ✅ import popup routes
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();
const app = express();
const port = process.env.PORT || 5000;

// ------------------- Middleware -------------------
app.use(express.json());
app.use(cookieParser());

// ✅ Allow CORS for localhost + Codespaces frontend
const allowedOrigins = [
  "http://localhost:3000",
  "https://turbo-space-giggle-wxw795jxxxg25xwp-3000.app.github.dev",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

// ------------------- Gemini AI -------------------
if (!process.env.GEMINI_API_KEY) {
  console.error("Error: GEMINI_API_KEY is not set in .env");
  process.exit(1);
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({
  model: "gemini-2.0-flash-lite",
  generationConfig: {
    temperature: 0.7,
    maxOutputTokens: 200,
  },
  safetySettings: [
    { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
    { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
    { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
    { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
  ],
});

const getAIResponse = async (message) => {
  console.log("Gemini request:", message);
  try {
    const result = await model.generateContent(message);
    const responseText = result.response.text();
    console.log("Gemini response:", responseText);
    return responseText;
  } catch (error) {
    console.error("Gemini API error:", error);
    if (error.message?.includes("API key")) {
      return "Invalid or missing API key. Please contact support.";
    }
    if (error.name === "ResponseStoppedException") {
      if (error.message.includes("SAFETY")) {
        return "Content blocked due to safety concerns. Please rephrase your message.";
      }
      if (error.message.includes("RECITATION")) {
        return "Response stopped due to recitation issues. Try a different question.";
      }
    }
    return "Failed to generate response. Please try again later.";
  }
};

// ------------------- Routes -------------------
app.get("/", (req, res) => {
  console.log("GET / called");
  res.send("Hello, world!");
});

// Chat endpoint
app.post("/api/chat", async (req, res) => {
  console.log("POST /api/chat received:", req.body);
  const { message } = req.body;

  if (!message) {
    console.log("No message provided");
    return res.status(400).json({ error: "Message is required" });
  }

  try {
    const reply = await getAIResponse(message);
    res.json({ reply });
  } catch (error) {
    console.error("Error processing chat request:", error);
    res.status(500).json({ error: "Failed to process request" });
  }
});

// Health check
app.get("/api/health", (req, res) => {
  console.log("GET /api/health called");
  res.json({ status: "Server is running 🚀" });
});

// API routes
app.use("/api/v1/auth", authRoute);
app.use("/api/v1/users", userRoute);
app.use("/api/v1/booking", bookingRoute);
app.use("/api/v1/blogs", blogRoute);
app.use("/api/v1/facility", facilityRoute);
app.use("/api/v1/popups", popupRoute);   // ✅ mount popup routes here

// ------------------- MongoDB -------------------
mongoose.set("strictQuery", false);

async function connect() {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ MongoDB Database Connected");
  } catch (err) {
    console.error("❌ MongoDB Database Connection Failed:", err);
  }
}

// ------------------- Start Server -------------------
app.listen(port, "0.0.0.0", () => {
  connect();
  console.log(`🚀 Server is listening on port ${port}`);
  console.log("Registered endpoints:");
  console.log("- GET /");
  console.log("- GET /api/health");
  console.log("- POST /api/chat");
  console.log("- /api/v1/auth/*");
  console.log("- /api/v1/users/*");
  console.log("- /api/v1/booking/*");
  console.log("- /api/v1/blogs/*");
  console.log("- /api/v1/facility/*");
  console.log("- /api/v1/popups/* ✅");   // log popups route
});
