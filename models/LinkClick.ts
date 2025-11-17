import mongoose from "mongoose";

const LinkClickSchema = new mongoose.Schema({
  type: { type: String, default: "unknown" },
  // optional source (linkedin, seek, homepage, etc.)
  source: { type: String, default: null },

  
  path: String,
  fullUrl: String,
  query: mongoose.Schema.Types.Mixed,
  
  productUrl: String,
  encodedUrl: String,
  storeName: String,
  targetUrl: String,

  userAgent: String,
  
  timestamp: { type: Date, default: Date.now }
});

export default mongoose.models.LinkClick ||
  mongoose.model("LinkClick", LinkClickSchema);
