const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { connectDB } = require('./config/db');
const userRoutes = require('./Routes/userRoutes');
const postRoutes = require('./Routes/postRoutes');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 8000;
const url = process.env.MONGODB_URL;

app.use('/user', userRoutes);
app.use('/post', postRoutes);

app.listen(PORT, ()=>{
    console.log(`Server is runing on port ${PORT}`);
    connectDB(url);
})

