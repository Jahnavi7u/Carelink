const axios = require("axios");

const GROQ_API_KEY = process.env.GROQ_API_KEY;

const SPECIALIZATIONS = [
    "Cardiology", "Neurology", "Orthopedics", "Dermatology", "Pediatrics",
    "Psychiatry", "Ophthalmology", "Gynecology", "General Medicine", "ENT"
];

const symptomCheckerController = async (req, res) => {
    try {
        const { symptoms } = req.body;

        if (!symptoms) {
            return res.status(400).json({ success: false, message: "Symptoms are required" });
        }

        if (!GROQ_API_KEY) {
            return res.status(500).json({ success: false, message: "AI service unavailable" });
        }

        const response = await axios.post(
            "https://api.groq.com/openai/v1/chat/completions",
            {
                model: "llama-3.3-70b-versatile",
                messages: [
                    {
                        role: "system",
                        content: `You are a medical triage assistant. Based on the patient's symptoms, you must:
1. Provide a brief assessment of what the symptoms could indicate (2-3 sentences max).
2. Recommend exactly ONE specialist from this list: ${SPECIALIZATIONS.join(", ")}.
3. Rate the urgency as: "Low", "Medium", or "High".

You MUST respond in this exact JSON format and nothing else:
{
  "assessment": "Brief description of likely condition",
  "specialization": "One from the list above",
  "urgency": "Low/Medium/High",
  "advice": "One line of immediate advice"
}`
                    },
                    {
                        role: "user",
                        content: `My symptoms are: ${symptoms}`
                    }
                ],
                temperature: 0.3,
                max_tokens: 256,
            },
            {
                headers: {
                    Authorization: `Bearer ${GROQ_API_KEY}`,
                    "Content-Type": "application/json",
                },
            }
        );

        const aiResponse = response.data.choices[0].message.content;

        // Try to parse the JSON response from AI
        try {
            const parsed = JSON.parse(aiResponse);
            // Validate that specialization is from our list
            if (!SPECIALIZATIONS.includes(parsed.specialization)) {
                parsed.specialization = "General Medicine";
            }
            return res.status(200).json({ success: true, result: parsed });
        } catch {
            // If AI didn't return valid JSON, wrap it
            return res.status(200).json({
                success: true,
                result: {
                    assessment: aiResponse,
                    specialization: "General Medicine",
                    urgency: "Medium",
                    advice: "Please consult a doctor for proper diagnosis."
                }
            });
        }
    } catch (error) {
        console.error("Symptom checker error:", error.response?.data || error.message);
        return res.status(500).json({
            success: false,
            message: "Error analyzing symptoms",
            error: error.message,
        });
    }
};

module.exports = symptomCheckerController;
