import OpenAI from 'openai';
import Rule from '../models/Rule.js';
import Notice from '../models/Notice.js';
import Society from '../models/Society.js';
import CommunityPost from '../models/CommunityPost.js';
import { searchKnowledgeBase } from './searchKnowledge.js';
import { getCache, setCache } from './cacheService.js';

const openai = process.env.OPENAI_API_KEY ? new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: 'https://openrouter.ai/api/v1',
}) : null;

const OPENAI_EMBED_MODEL = 'openai/text-embedding-3-small';
const OPENAI_CHAT_MODEL = 'openai/gpt-3.5-turbo';
const MAX_CONTEXT_DOCUMENTS = 5;
const MIN_VECTOR_SCORE = 0.25;
const MIN_KEYWORD_FALLBACK_SCORE = 2;
const NOISE_WORDS = new Set([
  'the', 'is', 'are', 'was', 'were', 'do', 'does', 'did', 'a', 'an', 'for', 'to',
  'of', 'in', 'on', 'at', 'with', 'please', 'tell', 'me', 'about', 'what', 'when',
  'where', 'which', 'who', 'can', 'could', 'would', 'should', 'my', 'our', 'any',
]);
import { queryVectors } from './pineconeService.js';

const normalizeTokens = (value) => (
  value
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter((token) => token.length >= 3)
);

const preprocessQuery = (question) => {
  const normalized = question.toLowerCase().replace(/[^a-z0-9\s]/g, ' ').replace(/\s+/g, ' ').trim();
  const tokens = normalized
    .split(' ')
    .filter((token) => token && !NOISE_WORDS.has(token));

  return {
    original: question.trim(),
    normalized,
    retrievalText: tokens.length ? tokens.join(' ') : normalized,
    tokens,
  };
};

const scoreKeywordFallback = (question, fallbackResult) => {
  const queryTokens = normalizeTokens(question);
  const referenceTokens = new Set(normalizeTokens(
    `${fallbackResult.title || ''} ${fallbackResult.answer || ''} ${fallbackResult.source || ''}`,
  ));

  let tokenMatches = 0;
  for (const token of queryTokens) {
    if (referenceTokens.has(token)) {
      tokenMatches += 1;
    }
  }

  const normalizedQuestion = question.toLowerCase().trim();
  const normalizedTitle = (fallbackResult.title || '').toLowerCase();
  const exactPhraseBonus = normalizedQuestion && normalizedTitle.includes(normalizedQuestion) ? 2 : 0;

  return tokenMatches + exactPhraseBonus;
};

const embedText = async (text, taskType) => {
  if (!openai) {
    throw new Error('OpenAI API key is missing');
  }

  const response = await openai.embeddings.create({
    model: OPENAI_EMBED_MODEL,
    input: text,
  });

  return response.data[0].embedding || [];
};

const retrieveRelevantContext = async (processedQuery, societyId) => {
  const queryText = processedQuery.retrievalText || processedQuery.normalized;
  const queryEmbedding = await embedText(queryText, 'RETRIEVAL_QUERY');

  // RAG settings
  const topK = parseInt(process.env.RAG_TOP_K || String(MAX_CONTEXT_DOCUMENTS), 10);
  const minScore = parseFloat(process.env.RAG_SIMILARITY_THRESHOLD || String(MIN_VECTOR_SCORE));

  const matches = await queryVectors({
    queryEmbedding,
    societyId,
    topK,
    minScore
  });

  if (!matches || !matches.length) {
    return [];
  }

  return matches.map((match) => ({
    id: match.id,
    source: match.metadata.type === 'rule' ? '📘 Society Rule' :
            match.metadata.type === 'notice' ? '📢 Notice' :
            match.metadata.type === 'community_post' ? '💬 Community Post' :
            '🏢 Society Information',
    title: match.metadata.title || 'Document',
    content: match.metadata.content || '',
    meta: match.metadata.type,
    score: match.score,
  }));
};

const buildContextPrompt = (question, contextDocuments) => {
  const context = contextDocuments.map((document, index) => (
    `Context ${index + 1}\nSource: ${document.source}\nTitle: ${document.title}\nDetails:\n${document.content}`
  )).join('\n\n');

  return [
    'You are Panchayat AI, a helpful assistant for a housing society management platform.',
    'Use the retrieved internal knowledge to answer the resident question.',
    'Do not invent society-specific facts.',
    'If the context is partial, say what is known and note what is missing.',
    'Keep the answer concise and practical.',
    '',
    `Resident question: ${question}`,
    '',
    'Retrieved context:',
    context,
  ].join('\n');
};

const buildGeneralPrompt = (question) => ([
  'You are Panchayat AI, a helpful assistant for a housing society management platform.',
  'No matching internal knowledge was found for this question.',
  'Provide a short general answer only if it does not require society-specific facts.',
  'If the question needs internal society data, say that the internal records do not currently contain it.',
  '',
  `Resident question: ${question}`,
].join('\n'));

const generateOpenAIText = async (prompt) => {
  if (!openai) {
    throw new Error('OpenAI API key is missing');
  }

  const response = await openai.chat.completions.create({
    model: OPENAI_CHAT_MODEL,
    messages: [
      {
        role: 'user',
        content: prompt,
      },
    ],
    temperature: 0.2,
    max_tokens: 400,
  });

  const answer = response.choices[0]?.message?.content?.trim();

  if (!answer) {
    throw new Error('OpenAI returned an empty response');
  }

  return answer;
};

export const getAISummary = async (text) => {
  if (!openai) {
    console.warn('OpenAI API key is missing. Skipping AI summary.');
    return 'AI Summary unavailable (Missing API Key)';
  }

  try {
    const response = await openai.chat.completions.create({
      model: OPENAI_CHAT_MODEL,
      messages: [
        {
          role: 'system',
          content: 'You are a helpful assistant for a society management platform called Panchayat. Your task is to summarize resident complaints into a single, concise 1-line summary that captures the core issue.',
        },
        {
          role: 'user',
          content: `Please summarize this complaint: ${text}`,
        },
      ],
      max_tokens: 50,
    });

    return response.choices[0].message.content.trim();
  } catch (error) {
    console.error('OpenAI Error:', error);
    if (error?.status === 429 || error?.code === 'insufficient_quota') {
      return `[Auto-Summary Fallback]: ${text.substring(0, 50)}...`;
    }
    throw new Error('Failed to generate AI summary');
  }
};

export const askAIAssistant = async (question, societyId) => {
  const processedQuery = preprocessQuery(question);

  let contextDocuments = [];
  try {
    contextDocuments = await retrieveRelevantContext(processedQuery, societyId);
    
    if (contextDocuments.length) {
      const primarySource = contextDocuments[0];
      const answer = await generateOpenAIText(buildContextPrompt(processedQuery.original, contextDocuments));

      return {
        source: primarySource.source,
        title: primarySource.title,
        answer,
        references: contextDocuments.map((document) => ({
          source: document.source,
          title: document.title,
          meta: document.meta,
          score: Number(document.score.toFixed(3)),
        })),
        retrievalMode: 'openai-rag',
      };
    }

    const answer = await generateOpenAIText(buildGeneralPrompt(processedQuery.original));
    return {
      source: '🤖 AI Assistant',
      title: 'General Guidance',
      answer,
      references: [],
      retrievalMode: 'general-assistant',
    };
  } catch (error) {
    console.error('OpenAI generation/retrieval failed:', error.message);
    
    // Fallback to keyword matching if OpenAI is out of quota or fails
    const fallbackResult = await searchKnowledgeBase(processedQuery.normalized, societyId);
    if (fallbackResult && scoreKeywordFallback(processedQuery.normalized, fallbackResult) >= MIN_KEYWORD_FALLBACK_SCORE) {
      return {
        ...fallbackResult,
        references: [
          {
            source: fallbackResult.source,
            title: fallbackResult.title,
            meta: 'Structured fallback',
            score: 0,
          },
        ],
        retrievalMode: 'keyword-fallback',
      };
    }
    
    return {
      source: '🤖 AI Assistant',
      title: 'System Notice',
      answer: "I'm currently unable to connect to my AI brain (OpenAI returned an error, likely quota exceeded). I also couldn't find a direct keyword match for your question in the rulebook. Please try again later or ask differently.",
      references: [],
      retrievalMode: 'error-fallback',
    };
  }
};
