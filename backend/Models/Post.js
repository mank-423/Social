const mongoose = require('mongoose');

const postSchema = mongoose.Schema({
    content: {
        type: String,
        required: true,
    },
    hashtags: [
        {
            type: String,
        }
    ],
    likes: {
        type: Number,
        default: 0,
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    }
})

const Post = mongoose.model('Post', postSchema);

module.exports = Post;