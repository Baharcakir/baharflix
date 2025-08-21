"use client";

import { useEffect, useState } from "react";
import { useAppSelector } from "@/store/hooks";
import axios from "axios";
import { API_BASE_URL } from "@/config/api";
import MovieCard from "@/components/MovieCard";
import  {Movie}  from "@/store/movies/movieSlice"; // Movie tipini içe aktar

interface FavoriteItem {
  movieId: number;
}

export default function FavoritesPage() {
  const { user } = useAppSelector((state) => state.auth);
  const [favorites, setFavorites] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadFavorites = async () => {
      if (!user) return;
      const uid = user.uid;

      setLoading(true);
      setError(null);
      try {
        const res = await axios.get(`${API_BASE_URL}/favorites/${uid}`);
        const favoriteIds: number[] = res.data.map((m: FavoriteItem) => m.movieId);

        const movies = await Promise.all(
          favoriteIds.map((id: number)=>
            axios.get(`${API_BASE_URL}/movies/${id}`).then((res) => res.data)
          )
        );

        setFavorites(movies);
      } catch (err) {
        console.error(err);
        setError("Failed to load favorites");
      } finally {
        setLoading(false);
      }
    };

    loadFavorites();
  }, [user]);

  if (loading) return <div className="text-white">Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;
  if (!favorites || favorites.length === 0)
    return <div className="text-white">No favorites yet.</div>;

  return (
    <div className="bg-black min-h-screen text-white p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        {/* Sol: Geri Butonu */}
        <button
          onClick={() => (window.location.href = "/movies")}
          className="flex items-center gap-2 px-3 py-1 rounded-lg bg-gray-200 hover:bg-gray-300 transition"
        >
          ← Go Back
        </button>

        {/* Orta: Başlık */}
        <h1 className="text-2xl font-bold text-center">Your Favorites</h1>

        {/* Sağ: Boş Alan */}
        <div className="w-[60px]"></div>
      </div>

      {/* Movies Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
        {favorites.map((movie) => (
          <MovieCard
            key={movie.id}
            id={movie.id}
            title={movie.title}
            image={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
          />
        ))}
      </div>
    </div>
  );
}
