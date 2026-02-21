const axios = require("axios");

const GROQ_API_KEY = process.env.GROQ_API_KEY;

if (!GROQ_API_KEY) {
  console.warn(
    "Warning: GROQ_API_KEY environment variable is not set. Chatbot will be unavailable."
  );
}

async function chatbot(prompt) {
  try {
    if (!GROQ_API_KEY) {
      return "Chatbot is currently unavailable. GROQ_API_KEY is not configured.";
    }

    const response = await axios.post(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        model: "llama-3.3-70b-versatile",
        messages: [
          {
            role: "system",
            content:
              'You are CareLink, a medical chatbot. Please answer only medical-field-related questions and some very generic questions. Make sure the response does not exceed 3-4 lines and is easy to understand. Answer the user in any language of their choice. If a question is not related to medical-field, respond with "I am a medical assistance AI and designed to only answer medical questions."',
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.7,
        max_tokens: 256,
      },
      {
        headers: {
          Authorization: `Bearer ${GROQ_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    return response.data.choices[0].message.content;
  } catch (error) {
    console.error("Groq API error:", error.response?.data || error.message);
    return `An error occurred: ${error.message}`;
  }
}

const chatBotController = async (req, res) => {
  try {
    const { prompt } = req.body;
    if (!prompt) {
      return res.status(400).json({ error: "Prompt is required" });
    }

    const response = await chatbot(prompt);
    return res.json({ response });
  } catch (error) {
    console.error("Error in chat endpoint:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = chatBotController;
