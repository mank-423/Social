import mongoose, { Schema } from "mongoose";
import { ObjectId } from "mongodb";

const messageSchema: Schema = new Schema({
    senderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true,
    },
    receiverId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true,
    },
    text: {
        type: String,
    },
    image: {
        type: String,
    } ,
    status: {
        type: String,
        enum: ['sending', 'sent', 'delivered', 'read', 'failed'],
        default: 'sent',
    },
    retryCount: {
        type: Number,
        default: 0,
    }
},{
    timestamps: true,
});

// Add compound index for efficient pagination
messageSchema.index({ senderId: 1, receiverId: 1, createdAt: -1 });
messageSchema.index({ receiverId: 1, senderId: 1, createdAt: -1 });

const Message = mongoose.model('message', messageSchema);

export default Message;