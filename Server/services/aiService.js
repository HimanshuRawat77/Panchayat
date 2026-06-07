import OpenAI from 'openai';
import Rule from '../models/Rule.js';
import { searchKnowledgeBase } from './searchKnowledge.js';

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
    if (error?.status === 429 || error?.code === 'insufficient_quota') {
      return `[Auto-Summary Fallback]: ${text.substring(0, 50)}...`;
    }
    throw new Error("Failed to generate AI summary");
  }
};

export const askAIAssistant = async (question) => {
  // STEP 1: Search MongoDB knowledge base using word-based matching
  const internalMatch = await searchKnowledgeBase(question);
  if (internalMatch) {
    return internalMatch;
  }

  // If no word-based match is found, return a default response without using OpenAI RAG
  return {
    source: '🤖 System',
    title: 'No Matching Rule Found',
    answer: "I couldn't find a specific internal rule or notice matching your query using word-based search. Please try rephrasing your question or contact the society office."
  };
};
