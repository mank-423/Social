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

const Message = mongoose.model('message', messageSchema);

export default Message;