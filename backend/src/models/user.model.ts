import mongoose, { Schema } from "mongoose";
import { IUser } from "../types/db.types";

const userSchema: Schema = new Schema({
    email: {
        type: String, 
        required: true,
        unique: true,
        index: true,
    },
    fullName: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    profilePic: {
        type: String,
        default: "",
    }
}, {
    timestamps: true,
});

const User = mongoose.model<IUser>('user', userSchema);

export default User;