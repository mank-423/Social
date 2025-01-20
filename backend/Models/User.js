const mongoose = require('mongoose');

const UserSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    username: {
        type: String,
        required: true,
        unique: true,
    },
    profileUrl: {
        type: String,
        default: '',
    },
    password: {
        type: String,
        required: true,
    },
    followerCount: {
        type: Number,
        default: 0,
    },
    followerList: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
    ],
    postCount: {
        type: Number,
        default: 0,
    },
    postList: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Post',
        },
    ],
})

const User = mongoose.model('User', UserSchema);

module.exports = User;