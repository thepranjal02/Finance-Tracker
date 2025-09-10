const express = require("express");
const OpenAI = require("openai");
const dotenv = require("dotenv");
dotenv.config();

const router = express.Router();

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// POST /api/tips
router.post("/", async (req, res) => {
  try {
    const { transactions } = req.body;

    // If no transactions provided
    if (!transactions || !Array.isArray(transactions)) {
      return res.status(400).json({ msg: "Transactions data required" });
    }

    // ✅ Mock mode (for when quota is exceeded or for local testing)
    if (process.env.MOCK_AI === "true") {
      return res.json({
        tips: "📊 Mock Tip: Try reducing food & entertainment expenses to save more.",
      });
    }

    // Build prompt from transactions
    const prompt =
      "I have the following transactions:\n" +
      transactions
        .map(
          (t) =>
            `Category: ${t.category}, Type: ${t.type}, Amount: ${t.amount}`
        )
        .join("\n") +
      "\nGive me personalized budget tips based on this spending.";

    // Call OpenAI API
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini", // or gpt-4 if available in your account
      messages: [{ role: "user", content: prompt }],
      max_tokens: 200,
    });

    const tips = response.choices[0].message.content;
    res.json({ tips });
  } catch (error) {
    console.error("❌ OpenAI API error:", error);

    // If quota exceeded or any API error → return mock fallback
    res.status(500).json({
      msg: "AI service unavailable. Showing mock tip instead.",
      tips: "⚠️ Reduce high expenses like dining out & shopping to save more.",
    });
  }
});

module.exports = router;
