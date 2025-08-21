import mongoose from "mongoose";

const favoriteMovieSchema = new mongoose.Schema({
  uid: { type: String, required: true },
  movies: [{ movieId: { type: Number, required: true } }]
}, { timestamps: true });

const FavoriteMovie = mongoose.model("FavoriteMovie", favoriteMovieSchema);
export default FavoriteMovie;