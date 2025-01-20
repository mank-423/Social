const mongoose = require('mongoose');

const connectDB = async (url) => {
    try {
        await mongoose.connect(url);
        console.log("Database connected!")
    } catch (error) {
        console.log('Error:', error);
    }
}

module.exports = { connectDB }