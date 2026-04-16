import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connection successfully");
  } catch (error) {
    console.log(`Error while connecting to db`);
    process.exit(1);
  }
};

export default connectDB;
