import mongoose from "mongoose"

const connectDB = async() => {
    const url = process.env.MONGO_URL
    
    if (!url){
        throw new Error("Mongo DB Url is not defined!");
    }

    try {
        await mongoose.connect(url);
        console.log('Database connected');
    } catch (error) {
        console.log('Error connecting to DB:', error);
        process.exit(1); // 1 means exit with failure, 0 means 
    }
}

export default connectDB;