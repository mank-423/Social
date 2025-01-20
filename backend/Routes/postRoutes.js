const express = require('express');
const {
    createPost,
    getAllPosts,
    getPostById,
    updatePost,
    deletePost,
    likePost,
    getPostsByUser,
} = require('../Controller/PostController');

const router = express.Router();

// Route to create a new post
router.post('/create', createPost);

// Route to get all posts
router.get('/', getAllPosts);

// Route to get a single post by ID
router.get('/:id', getPostById);

// Route to update a post by ID
router.put('/:id', updatePost);

// Route to delete a post by ID
router.delete('/:id', deletePost);

// Route to like a post by ID
router.put('/:id/like', likePost);

// Route to get posts by a specific user
router.get('/user/:userId', getPostsByUser);

module.exports = router;
