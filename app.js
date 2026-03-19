const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();
app.use(cors());
app.use(express.json());

// 🔑 PUT YOUR KEYS HERE
const GEMINI_API_KEY = "api";
const MURF_API_KEY = "api";

// ✅ TEST ROUTE
app.get("/", (req, res) => {
  res.send("Server is running");
});

// ✅ CHAT ROUTE
app.post("/chat", async (req, res) => {
  const { message } = req.body;

  try {
    // 🔹 GEMINI API
    const geminiRes = await axios.post(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent",
      {
        contents: [
          {
            role: "user",
            parts: [{ text: message }]
          }
        ]
      },
      {
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": GEMINI_API_KEY
        }
      }
    );

    let aiText =
      geminiRes.data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "Sorry, I couldn't understand.";

    // 🔥 LIMIT TEXT FOR MURF (IMPORTANT)
    if (aiText.length > 2500) {
      aiText = aiText.substring(0, 2500);
    }

    let audioUrl = null;

    // 🔹 MURF API
    try {
      const murfRes = await axios.post(
        "https://api.murf.ai/v1/speech/generate",
        {
          text: aiText,
          voiceId: "en-US-natalie",
          format: "MP3"
        },
        {
          headers: {
            "api-key": MURF_API_KEY,
            "Content-Type": "application/json"
          }
        }
      );

      console.log("Murf response:", murfRes.data);

      audioUrl = murfRes.data?.audioFile || null;

    } catch (murfErr) {
      console.log("Murf error:", murfErr.response?.data || murfErr.message);
    }

    // 🔹 FINAL RESPONSE
    res.json({
      text: aiText,
      audio: audioUrl
    });

  } catch (err) {
    console.log("Gemini error:", err.response?.data || err.message);

    res.status(500).json({
      text: "AI is currently unavailable",
      audio: null
    });
  }
});

// ✅ START SERVER
app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
