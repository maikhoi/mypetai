import mongoose, { Schema } from "mongoose";

const LinkClickSchema = new Schema(
  {
    type: { type: String, default: "unknown" },
    source: { type: String, default: null },
    productUrl: { type: String, default: null },
    encodedUrl: { type: String, default: null },
    targetUrl: { type: String, default: null },
    storeName: { type: String, default: null },
    fullUrl: { type: String, default: null },
    path: { type: String, default: null },
    query: { type: String, default: null },
    userAgent: { type: String, default: null },
    timestamp: { type: Date, default: Date.now },
    serverTs: { type: Date, default: Date.now }, // logged by server
  },
  { timestamps: true }
);
// Prevent duplicate events (same click)
LinkClickSchema.index({ encodedUrl: 1, clientTs: 1 }, { unique: true });

// Required to avoid recompilation errors during hot reload
export default mongoose.models.LinkClick ||
  mongoose.model("LinkClick", LinkClickSchema);
