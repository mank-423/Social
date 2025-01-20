const express = require('express');
const { createUser, getUsers, getUserById, loginUser, checkUsername } = require('../Controller/UserController')

const router = express.Router();

// Register route
router.post('/register', createUser);

// Login route
router.post('/login', loginUser);

// Check username
router.post('/check-username', checkUsername);

// Get all users
router.get('/', getUsers);

// Get user by Id
router.get('/:id', getUserById);

module.exports = router;