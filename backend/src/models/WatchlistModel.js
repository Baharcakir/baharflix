import mongoose from "mongoose";

const watchlistSchema = new mongoose.Schema({
  uid: { type: String, required: true },
  movies: [{ movieId: { type: Number, required: true } }]
}, { timestamps: true });

const Watchlist = mongoose.model("Watchlist", watchlistSchema);
export default Watchlist;