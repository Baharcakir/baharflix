import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const MONGO_URI = process.env.MONGO_URI;
    if (!MONGO_URI) throw new Error("MongoDB URI is not defined in .env");

    await mongoose.connect(MONGO_URI); // artık useNewUrlParser ve useUnifiedTopology gerek yok
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1); // bağlantı başarısızsa uygulamayı durdur
  }
};

export default connectDB;
