import mongoose, { Schema } from "mongoose";
import { ObjectId } from "mongodb";

const messageSchema: Schema = new Schema({
    senderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    receiverId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    text: {
        type: String,
    },
    image: {
        type: String,
    } 
},{
    timestamps: true,
});

const Message = mongoose.model('message', messageSchema);

export default Message;