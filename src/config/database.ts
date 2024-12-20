import mongoose from 'mongoose';

async function MongoDB(): Promise<void> {
    try {
        console.log("CONNECTING TO DATABASE...");
        await mongoose.connect(process.env.DATABASE_URL as string);
        console.log("DATABASE CONNECTED");
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
    }
}

export default MongoDB;