import OpenAI from 'openai';
import { upsertVector, deleteVector } from './pineconeService.js';

let openaiClient = null;

const getOpenAIClient = () => {
  if (!openaiClient && process.env.OPENAI_API_KEY) {
    openaiClient = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
      baseURL: 'https://openrouter.ai/api/v1',
    });
  }
  return openaiClient;
};

const OPENAI_EMBED_MODEL = 'openai/text-embedding-3-small';

export const generateEmbedding = async (text) => {
  const openai = getOpenAIClient();
  if (!openai) {
    throw new Error('OpenAI API key is missing');
  }

  const response = await openai.embeddings.create({
    model: OPENAI_EMBED_MODEL,
    input: text,
  });

  return response.data[0].embedding || [];
};

/**
 * Normalizes document content into text for embedding
 */
const buildNormalizedText = (document, type) => {
  const parts = [];
  
  if (type === 'rule') {
    parts.push(`Rule: ${document.title}`);
    parts.push(`Category: ${document.category || 'General'}`);
    parts.push(document.description);
  } else if (type === 'notice') {
    parts.push(`Notice: ${document.title}`);
    parts.push(document.content);
  } else if (type === 'community_post') {
    parts.push(`Post Category: ${document.category}`);
    parts.push(document.content);
  } else if (type === 'society_info') {
    parts.push(`Society: ${document.name || document.societyName || 'Information'}`);
    if (document.address) parts.push(`Address: ${document.address}`);
    if (document.gymTiming) parts.push(`Gym: ${document.gymTiming} at ${document.gymLocation}`);
    if (document.officeTiming) parts.push(`Office: ${document.officeTiming} at ${document.officeLocation}`);
    if (document.clubhouseTiming) parts.push(`Clubhouse: ${document.clubhouseTiming} at ${document.clubhouseLocation}`);
    if (document.emergencyNumber) parts.push(`Emergency: ${document.emergencyNumber}`);
  }

  return parts.filter(Boolean).join('\n');
};

export const syncDocumentToVectorDB = async (document, type) => {
  try {
    if (!document || !document._id) {
      console.warn(`Skipping vector sync: invalid document (${type})`);
      return false;
    }

    if (!document.societyId) {
      console.warn(`Skipping vector sync: missing societyId for ${type} ${document._id}`);
      return false;
    }

    const textToEmbed = buildNormalizedText(document, type);
    if (!textToEmbed || textToEmbed.trim().length === 0) {
      console.warn(`Skipping vector sync: empty normalized text for ${type} ${document._id}`);
      return false;
    }

    const embedding = await generateEmbedding(textToEmbed);
    
    if (!embedding || !Array.isArray(embedding)) {
      console.error(`Skipping vector sync: embedding generation failed for ${type} ${document._id}`);
      return false;
    }

    if (embedding.length !== 1536) {
      console.error(`Skipping vector sync: embedding dimension mismatch (expected 1536, got ${embedding.length}) for ${type} ${document._id}`);
      return false;
    }
    
    // Deterministic ID
    const vectorId = `${type}_${document._id.toString()}`;
    
    await upsertVector({
      id: vectorId,
      values: embedding,
      metadata: {
        societyId: document.societyId.toString(),
        documentId: document._id.toString(),
        type,
        // Storing the content to avoid N+1 MongoDB queries during RAG construction
        title: document.title || document.category || document.name || document.societyName || 'Document',
        content: textToEmbed
      }
    });
    return true;
  } catch (error) {
    console.error(`❌ Vector Sync Error for ${type} ${document?._id}:`, error.message);
    return false;
  }
};

export const deleteDocumentFromVectorDB = async (documentId, type) => {
  try {
    const vectorId = `${type}_${documentId.toString()}`;
    await deleteVector(vectorId);
    return true;
  } catch (error) {
    console.error(`❌ Vector Delete Error for ${type} ${documentId}:`, error.message);
    return false;
  }
};
