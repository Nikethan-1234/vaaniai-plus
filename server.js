import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

app.post("/chat", (req, res) => {
  const { message } = req.body;

  // Dummy AI response (for demo)
  const reply = "This is VaaniAI responding to: " + message;

  res.json({
    text: reply,
    audio: "" // can keep empty for now
  });
});

app.listen(5000, () => console.log("Server running"));
