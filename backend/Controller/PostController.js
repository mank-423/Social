const Post = require('../Models/Post');

// Create a new post
const createPost = async (req, res) => {
    try {
        // Destructure the data from the request body
        const { content, hashtags, createdBy } = req.body;

        // Basic validation
        if (!content || !createdBy) {
            return res.status(400).json({ success: false, message: 'Content and createdBy fields are required.', });
        }

        // Ensure hashtags is an array of strings (optional)
        let hashtagArray = [];
        if (hashtags) {
            // Ensure hashtags is an array (if provided)
            hashtagArray = Array.isArray(hashtags) ? hashtags : hashtags.split(',').map(tag => tag.trim());
        }

        // Create a new post
        const newPost = new Post({ content, hashtags: hashtagArray, createdBy, });

        // Save the post
        await newPost.save();

        res.status(201).json({ success: true, post: newPost });
    } catch (error) {
        // Log the error and send a generic message
        console.error(error);
        res.status(500).json({ success: false, message: 'An error occurred while creating the post', error: error.message });
    }
};

// Get all posts
const getAllPosts = async (req, res) => {
    try {
        const posts = await Post.find().populate('createdBy', 'username name');
        res.status(200).json({ success: true, posts });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get a single post
const getPostById = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id).populate('createdBy', 'username name');
        if (!post) {
            return res.status(404).json({ success: false, message: 'Post not found' });
        }
        res.status(200).json({ success: true, post });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Update a post
const updatePost = async (req, res) => {
    try {
        const { content, hashtags } = req.body;
        const updatedPost = await Post.findByIdAndUpdate(
            req.params.id,
            { content, hashtags },
            { new: true }
        );

        if (!updatedPost) {
            return res.status(404).json({ success: false, message: 'Post not found' });
        }

        res.status(200).json({ success: true, post: updatedPost });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Delete a post
const deletePost = async (req, res) => {
    try {
        const deletedPost = await Post.findByIdAndDelete(req.params.id);

        if (!deletedPost) {
            return res.status(404).json({ success: false, message: 'Post not found' });
        }

        res.status(200).json({ success: true, message: 'Post deleted' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Like a post
const likePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        if (!post) {
            return res.status(404).json({ success: false, message: 'Post not found' });
        }

        post.likes += 1;
        await post.save();

        res.status(200).json({ success: true, post });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get posts by user
const getPostsByUser = async (req, res) => {
    try {
        const posts = await Post.find({ createdBy: req.params.userId }).populate('createdBy', 'username name');
        res.status(200).json({ success: true, posts });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = { createPost, getAllPosts, getPostById, updatePost, deletePost, likePost, getPostsByUser }
