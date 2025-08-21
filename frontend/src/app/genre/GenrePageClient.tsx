"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { useEffect } from "react";
import { fetchMoviesByGenreId } from "@/store/movies/movieSlice";
import MovieCard from "@/components/MovieCard";

export default function GenrePageClient() {
  const searchParams = useSearchParams();
  const genreIdParam = searchParams.get("id");
  const genreId = genreIdParam ? Number(genreIdParam) : undefined;

  const dispatch = useAppDispatch();
  const router = useRouter();
  const { moviesByGenre, loading, error, genres } = useAppSelector((state) => state.movie);

  useEffect(() => {
    if (genreId) {
      dispatch(fetchMoviesByGenreId(genreId));
    }
  }, [genreId, dispatch]);

  const genreName = genres.find((g) => g.id === genreId)?.genre || "Unknown";

  if (loading) return <div className="text-white">Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="bg-black min-h-screen text-white p-6">
      {/* Başlık ve geri butonu */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => router.push("/movies")}
          className="flex items-center gap-2 px-3 py-1 rounded-lg bg-gray-200 hover:bg-gray-300 transition"
        >
          ← Go Back
        </button>
        <h1 className="text-2xl font-bold text-center">{genreName}</h1>
        <div className="w-[60px]"></div>
      </div>

      {/* Film listesi */}
      {moviesByGenre.length === 0 ? (
        <div>No movies found for this genre.</div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 justify-items-center gap-3 sm:gap-3 lg:gap-1">
          {moviesByGenre.map((movie) => (
            <MovieCard
              key={movie.id}
              id={movie.id}
              title={movie.title}
              image={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
