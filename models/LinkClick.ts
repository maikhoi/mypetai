import mongoose, { Schema, Document } from "mongoose";

export interface LinkClickDoc extends Document {
  source: string;
  timestamp: number;
  ip: string;
  userAgent: string;
}

const LinkClickSchema = new Schema<LinkClickDoc>({
  source: { type: String, required: true },
  timestamp: { type: Number, required: true },
  ip: String,
  userAgent: String,
});

export default mongoose.models.LinkClick ||
  mongoose.model<LinkClickDoc>("LinkClick", LinkClickSchema);
