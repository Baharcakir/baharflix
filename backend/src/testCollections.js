import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "./models/UserModel.js";
import Watchlist from "./models/WatchlistModel.js";
import FavoriteMovie from "./models/FavoritesModel.js";

dotenv.config();

const MONGO_URI = process.env.MONGO_URI;

const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("MongoDB connected successfully");
  } catch (err) {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  }
};

const createTestData = async () => {
  try {
    // 1. Test user
    const user = await User.create({
      uid: "abcde123",
      email: "test@example.com",
      displayName: "Test User",
    });
    console.log("Test user created:", user);

    const movieIds = [1234821, 1087192];

    // 2. Watchlist
    const watchlist = await Watchlist.create({
      user: user._id,
      movies: movieIds,
    });
    console.log("Watchlist created:", watchlist);

    // 3. Favorite Movies
    const favorites = await FavoriteMovie.create({
      user: user._id,
      movies: movieIds,
    });
    console.log("Favorite movies created:", favorites);
  } catch (err) {
    console.error("Error creating test data:", err);
  } finally {
    mongoose.connection.close();
  }
};

connectDB().then(createTestData);