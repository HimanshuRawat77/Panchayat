import OpenAI from 'openai';

const openai = process.env.OPENAI_API_KEY ? new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
}) : null;

export const getAISummary = async (text) => {
  if (!openai) {
    console.warn("OpenAI API key is missing. Skipping AI summary.");
    return "AI Summary unavailable (Missing API Key)";
  }

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a helpful assistant for a society management platform called Panchayat. Your task is to summarize resident complaints into a single, concise 1-line summary that captures the core issue."
        },
        {
          role: "user",
          content: `Please summarize this complaint: ${text}`
        }
      ],
      max_tokens: 50,
    });

    return response.choices[0].message.content.trim();
  } catch (error) {
    console.error("OpenAI Error:", error);
    throw new Error("Failed to generate AI summary");
  }
};
