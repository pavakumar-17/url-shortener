// index.js
import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import validUrl from "valid-url";
import { nanoid } from "nanoid";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// ✅ Root route for quick check
app.get("/", (req, res) => {
  res.send("🚀 URL Shortener API is running...");
});

// MongoDB connect
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1);
  });

// URL Model
const UrlSchema = new mongoose.Schema({
  longUrl: String,
  shortUrl: String,
  urlCode: String,
  date: { type: String, default: Date.now },
});
const Url = mongoose.model("Url", UrlSchema);

// POST /api/shorten - shorten a URL
app.post("/api/shorten", async (req, res) => {
  console.log("Incoming request:", req.body);

  const { longUrl } = req.body;
  const baseUrl = `http://localhost:${PORT}`;

  if (!validUrl.isUri(baseUrl)) {
    return res.status(401).json("Invalid base URL");
  }

  if (validUrl.isUri(longUrl)) {
    try {
      let url = await Url.findOne({ longUrl });

      if (url) {
        res.json(url);
      } else {
        const urlCode = nanoid(6);
        const shortUrl = `${baseUrl}/${urlCode}`;

        url = new Url({
          longUrl,
          shortUrl,
          urlCode,
          date: new Date(),
        });

        await url.save();
        res.json(url);
      }
    } catch (err) {
      console.error("Error in POST /api/shorten:", err);
      res.status(500).json("Server error");
    }
  } else {
    res.status(401).json("Invalid long URL");
  }
});

// GET /:code - redirect to long URL
app.get("/:code", async (req, res) => {
  try {
    const url = await Url.findOne({ urlCode: req.params.code });

    if (url) {
      return res.redirect(url.longUrl);
    } else {
      return res.status(404).json("No URL found");
    }
  } catch (err) {
    console.error("Error in GET /:code:", err);
    res.status(500).json("Server error");
  }
});

app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
