import mongoose, { Schema } from "mongoose";
import { ObjectId } from "mongodb";

const messageSchema: Schema = new Schema({
    senderId: {
        type: ObjectId,
        required: true,
    },
    receiverId: {
        type: ObjectId,
        required: true,
    },
    text: {
        type: String,
        required: true,
    },
    imageUrl: {
        type: String,
        default: " ",
    } 
});

const Message = mongoose.model('message', messageSchema);

export default Message;