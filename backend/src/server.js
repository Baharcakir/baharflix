import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import userRoutes from "./routes/user.js";
import favoriteRoutes from "./routes/favorites.js";
import watchlistRoutes from './routes/watchlist.js';
import movieRoutes from './routes/movies.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT;

app.use(cors({
  origin: "http://localhost:3000", // Frontend portunu yazın
  methods: ["GET", "POST", "DELETE"]
}));
app.use(express.json());
app.use("/api/users", userRoutes);
app.use("/api/favorites", favoriteRoutes);
app.use("/api/watchlist", watchlistRoutes);
app.use("/api/movies", movieRoutes);

connectDB();

app.listen(PORT, () => console.log(`Server ${PORT} portunda çalışıyor`));
