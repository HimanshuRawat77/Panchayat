import { Pinecone } from '@pinecone-database/pinecone';

let pineconeClient = null;
let index = null;

export const initPinecone = () => {
  if (!pineconeClient) {
    if (!process.env.PINECONE_API_KEY) {
      console.warn("⚠️ PINECONE_API_KEY is not set. Vector search will be unavailable.");
      return null;
    }
    pineconeClient = new Pinecone({
      apiKey: process.env.PINECONE_API_KEY,
    });
    
    const indexName = process.env.PINECONE_INDEX_NAME || 'panchayat';
    index = pineconeClient.index(indexName);
  }
  return index;
};

export const getIndex = () => {
  if (!index) {
    return initPinecone();
  }
  return index;
};

export const upsertVector = async ({ id, values, metadata }) => {
  try {
    const idx = getIndex();
    if (!idx) throw new Error("Pinecone index not initialized");
    
    // Add prefix to namespace if needed or keep default
    const namespace = process.env.PINECONE_NAMESPACE_PREFIX || 'panchayat';
    
    await idx.namespace(namespace).upsert({
      records: [{
        id,
        values,
        metadata
      }]
    });
    
    console.log(`✅ Pinecone upsert completed for ${id}`);
  } catch (error) {
    console.error(`❌ Pinecone upsert error for ${id}:`, error.message);
    throw error;
  }
};

export const queryVectors = async ({ queryEmbedding, societyId, topK = 5, minScore = 0.25 }) => {
  try {
    const idx = getIndex();
    if (!idx) return [];
    
    const namespace = process.env.PINECONE_NAMESPACE_PREFIX || 'panchayat';
    
    console.log(`🔍 Pinecone query started for society: ${societyId}`);
    const start = Date.now();

    const response = await idx.namespace(namespace).query({
      vector: queryEmbedding,
      topK,
      includeMetadata: true,
      filter: {
        societyId: { $eq: societyId.toString() }
      }
    });
    
    const duration = Date.now() - start;
    
    const matches = response.matches || [];
    const validMatches = matches.filter(match => match.score >= minScore);
    
    console.log(`✅ Pinecone query completed in ${duration}ms. Results: ${validMatches.length}/${matches.length} (>= ${minScore})`);
    
    return validMatches;
  } catch (error) {
    console.error(`❌ Pinecone query error for society ${societyId}:`, error.message);
    throw error;
  }
};

export const deleteVector = async (id) => {
  try {
    const idx = getIndex();
    if (!idx) throw new Error("Pinecone index not initialized");
    
    const namespace = process.env.PINECONE_NAMESPACE_PREFIX || 'panchayat';
    
    await idx.namespace(namespace).deleteOne(id);
    
    console.log(`🗑️ Pinecone delete completed for ${id}`);
  } catch (error) {
    console.error(`❌ Pinecone delete error for ${id}:`, error.message);
    throw error;
  }
};
