import mongoose from 'mongoose';


const MessageSchema = new mongoose.Schema({
    channelId: { type: String, default: 'general' },
    senderId: String,
    senderName: String,
    senderAvatar: String,
    type: { type: String, enum: ['text','media'], default: 'text' },
    text: String,
    mediaUrl: String,
    mediaType: { type: String, enum: ['image','video'], default: 'image' },
    isGuest: { type: Boolean, default: false },
}, { timestamps: true });


export const Message = mongoose.model('Message', MessageSchema);