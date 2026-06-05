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
  // STEP 1: Search MongoDB knowledge base first
  const internalMatch = await searchKnowledgeBase(question);
  if (internalMatch) {
    return internalMatch;
  }

  // STEP 2: Fallback to OpenAI if no internal data matches
  if (!openai) {
    console.warn("OpenAI API key is missing.");
    return {
      source: '🤖 AI Assistant',
      title: 'AI Unavailable',
      answer: 'AI Assistant unavailable (Missing API Key)'
    };
  }

  try {
    const rules = await Rule.find({ 
      $or: [
        { expiryDate: { $exists: false } },
        { expiryDate: { $gt: new Date() } }
      ]
    });

    let contextText = "Here are the current rules and policies for the society:\n";
    rules.forEach(r => {
      contextText += `- [${r.category}] ${r.title}: ${r.description}\n`;
    });

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: `You are a helpful assistant for a society management platform called Panchayat. Answer the resident's question based ONLY on the following rules. If the answer is not in the rules, politely inform them that you cannot find a specific rule regarding their question.\n\n${contextText}`
        },
        {
          role: "user",
          content: question
        }
      ],
      max_tokens: 150,
    });

    return {
      source: '🤖 AI Assistant',
      title: 'AI Generated Response',
      answer: response.choices[0].message.content.trim()
    };
  } catch (error) {
    console.error("OpenAI Error:", error);
    if (error?.status === 429 || error?.code === 'insufficient_quota') {
      return {
        source: '🤖 AI Assistant',
        title: 'Quota Exceeded',
        answer: "AI service is currently unavailable. I couldn't find a specific internal rule matching your query."
      };
    }
    throw new Error("Failed to get AI response");
  }
};
