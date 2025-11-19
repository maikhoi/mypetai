import mongoose, { Schema, models, model } from "mongoose";

export interface IMessage {
  channelId?: string;
  senderId?: string;
  senderName?: string;
  senderAvatar?: string;
  type?: "text" | "media";
  text?: string;
  mediaUrl?: string;
  mediaType?: "image" | "video";
  isGuest?: boolean;
}

const MessageSchema = new Schema<IMessage>(
  {
    channelId: { type: String, default: "general" },
    senderId: String,
    senderName: String,
    senderAvatar: String,
    type: { type: String, enum: ["text", "media"], default: "text" },
    text: String,
    mediaUrl: String,
    mediaType: { type: String, enum: ["image", "video"], default: "image" },
    isGuest: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Message = models.Message || model<IMessage>("Message", MessageSchema);

export default Message;
