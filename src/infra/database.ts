import mongoose from "mongoose";

const connectDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL!);

    console.log("MongoDB database connected");
  } catch (error) {
    console.log("MongoDB connection error:", error);
  }
};

export default connectDatabase;
