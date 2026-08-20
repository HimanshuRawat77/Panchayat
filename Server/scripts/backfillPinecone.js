import 'dotenv/config';
import mongoose from 'mongoose';
import Rule from '../models/Rule.js';
import Notice from '../models/Notice.js';
import CommunityPost from '../models/CommunityPost.js';
import Society from '../models/Society.js';
import { syncDocumentToVectorDB } from '../services/vectorSyncService.js';
import { initPinecone } from '../services/pineconeService.js';

const backfillPinecone = async () => {
  try {
    const mongoUri = process.env.MONGO_URI;
    if (!mongoUri) {
      console.error('❌ MONGO_URI is not set in .env');
      process.exit(1);
    }
    
    if (!process.env.PINECONE_API_KEY) {
      console.error('❌ PINECONE_API_KEY is not set in .env');
      process.exit(1);
    }

    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB.');
    
    console.log('🌲 Initializing Pinecone...');
    initPinecone();
    
    // Fallback for legacy documents that missed the multi-tenant migration
    // Find the primary existing society (created by the migration script)
    const defaultSociety = await Society.findOne({});
    const defaultSocietyId = defaultSociety ? defaultSociety._id : null;
    
    if (defaultSocietyId) {
      console.log(`ℹ️ Legacy document fallback: using Society ${defaultSocietyId}`);
    }

    console.log('\n🔄 Starting backfill process...');

    let globalFound = 0;
    let globalSuccess = 0;
    let globalFail = 0;

    const processDocuments = async (documents, type, label) => {
      console.log(`\n--- Syncing ${label} ---`);
      let successCount = 0;
      let failCount = 0;
      
      for (const doc of documents) {
        let docToSync = doc;
        
        if (type === 'society_info') {
          docToSync = doc.toObject ? doc.toObject() : { ...doc };
          docToSync.societyId = docToSync._id; // Ensure societyId exists for vector metadata
        } else if (!doc.societyId && defaultSocietyId) {
          // Legacy document fallback
          docToSync = doc.toObject ? doc.toObject() : { ...doc };
          docToSync.societyId = defaultSocietyId;
          
          // Persist the migration to MongoDB safely without triggering hooks again
          await mongoose.connection.db.collection(doc.collection.collectionName).updateOne(
            { _id: doc._id },
            { $set: { societyId: defaultSocietyId } }
          );
        }
        
        const success = await syncDocumentToVectorDB(docToSync, type);
        if (success) successCount++;
        else failCount++;
      }
      
      console.log(`Found: ${documents.length}`);
      console.log(`Successfully synced: ${successCount}`);
      console.log(`Failed: ${failCount}`);
      
      globalFound += documents.length;
      globalSuccess += successCount;
      globalFail += failCount;
    };

    // 1. Backfill Rules
    const rules = await Rule.find({});
    await processDocuments(rules, 'rule', 'Rules');

    // 2. Backfill Notices
    const notices = await Notice.find({});
    await processDocuments(notices, 'notice', 'Notices');

    // 3. Backfill Community Posts
    const posts = await CommunityPost.find({});
    await processDocuments(posts, 'community_post', 'Community Posts');

    // 4. Backfill Society Info
    const infos = await Society.find({});
    await processDocuments(infos, 'society_info', 'Society Infos');

    console.log('\nOverall:');
    console.log(`Found: ${globalFound}`);
    console.log(`Successfully synced: ${globalSuccess}`);
    console.log(`Failed: ${globalFail}`);

    if (globalFail > 0) {
      console.log('\n❌ Backfill completed with errors.');
      process.exit(1);
    } else {
      console.log('\n🎉 Backfill completed successfully!');
      process.exit(0);
    }
  } catch (error) {
    console.error('\n❌ Backfill failed:', error);
    process.exit(1);
  }
};

backfillPinecone();
