import mongoose from "mongoose";

const societyInfoSchema = new mongoose.Schema(
  {
    societyName: { type: String, required: true },
    address: { type: String, required: true },
    officeLocation: { type: String, required: true },
    officeTiming: { type: String, required: true },
    emergencyNumber: { type: String, required: true },
    gymLocation: { type: String },
    gymTiming: { type: String },
    clubhouseLocation: { type: String },
    clubhouseTiming: { type: String },
    securityDesk: { type: String },
  },
  { timestamps: true }
);

import { syncDocumentToVectorDB, deleteDocumentFromVectorDB } from '../services/vectorSyncService.js';

societyInfoSchema.post('save', async function(doc) {
  await syncDocumentToVectorDB(doc, 'society_info');
});

societyInfoSchema.post('findOneAndUpdate', async function(doc) {
  if (doc) await syncDocumentToVectorDB(doc, 'society_info');
});

societyInfoSchema.post('findOneAndDelete', async function(doc) {
  if (doc) await deleteDocumentFromVectorDB(doc._id, 'society_info');
});

export default mongoose.model('SocietyInfo', societyInfoSchema);
