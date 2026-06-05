import { getAISummary, askAIAssistant } from '../services/aiService.js';

export const summarizeComplaint = async (req, res) => {
  const { text } = req.body;

  if (!text) {
    return res.status(400).json({ message: "Text is required for summarization" });
  }

  try {
    const summary = await getAISummary(text);
    res.status(200).json({ summary });
  } catch (error) {
    res.status(500).json({ message: error.message || "Internal server error" });
  }
};

export const askAssistant = async (req, res) => {
  const { question } = req.body;

  if (!question) {
    return res.status(400).json({ message: "Question is required" });
  }

  try {
    const response = await askAIAssistant(question);
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ message: error.message || "Internal server error" });
  }
};
