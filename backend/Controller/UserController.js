const User = require('../Models/User');
const bcrypt = require('bcrypt');

// Create user
const createUser = async (req, res) => {
    try {
        const { name, username, password } = req.body;

        // Validation for username
        const usernameRegex = /^(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z\d!@#$%^&*(),.?":{}|<>]{4,}$/;

        if (!usernameRegex.test(username)) {
            return res.status(400).json({
                success: false,
                message: 'Username must be at least 4 characters long and contain at least one special symbol.',
            });
        }

        // Check if username already exists
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'Username already exists. Please choose a different one.',
            });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);


        // Create new user
        const newUser = new User({ name, username, password: hashedPassword });
        await newUser.save();

        res.status(201).json({ success: true, message: 'User created successfully' });
    } catch (error) {
        console.log('Error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

const checkUsername = async (req, res) => {
    try {
        const { username } = req.body;

        // Use regex for partial match (case-insensitive search)
        const user = await User.findOne({ username: { $regex: `^${username}`, $options: 'i' } });

        if (user) {
            return res.status(400).json({ success: false, message: 'Username is already taken' });
        }

        res.status(200).json({ success: true, message: 'Username is available' });

    } catch (error) {
        console.log('Error:', error);
        res.status(500).json({ success: false, message: 'An error occurred while checking username', error: error.message });
    }
};


const loginUser = async (req, res) => {
    try {
        const { username, password } = req.body;

        // Find user by username
        const findUser = await User.findOne({ username });

        // Check if user exists
        if (!findUser) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        // Compare passwords
        const isPasswordValid = await bcrypt.compare(password, findUser.password);
        if (!isPasswordValid) {
            return res.status(401).json({ success: false, message: 'Invalid password' });
        }

        // Successful login
        res.status(200).json({
            success: true,
            message: 'Login successful',
            data: { id: findUser._id, name: findUser.name, username: findUser.username, },
        });
    } catch (error) {
        // Internal server error
        res.status(500).json({ success: false, message: 'An error occurred during login', error: error.message, });
    }
};

// Get all users
const getUsers = async (req, res) => {
    try {
        const user = await User.find();
        res.status(201).json({ success: true, userList: user });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

// Get a single user by ID
const getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).populate('postList');
        if (!user) return res.status(404).json({ success: false, message: 'User not found' });

        res.status(200).json({ success: true, data: user });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

module.exports = { createUser, getUsers, getUserById, loginUser, checkUsername };