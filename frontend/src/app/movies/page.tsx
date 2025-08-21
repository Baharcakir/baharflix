"use client";

import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchPopularMovies, fetchMoviesByGenres } from "@/store/movies/movieSlice";
import Slider from "@/components/Slider";
import Link from "next/link";
import MovieCard from "@/components/MovieCard";
import { logoutUser } from "@/store/auth/authSlice";

export default function MoviesPage() {
  const dispatch = useAppDispatch();
  const { genres, loading, error } = useAppSelector((state) => state.movie);
  const { user } = useAppSelector((state) => state.auth);

  const [showGenres, setShowGenres] = useState(false);

  const handleLogout = () => {
    dispatch(logoutUser());
  };

  useEffect(() => {
    dispatch(fetchPopularMovies(user?.uid));
    dispatch(fetchMoviesByGenres());
  }, [dispatch, user?.uid]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div style={{ color: "red" }}>{error}</div>;

  // Email'den @ öncesi kısmı al
  const username = user?.email ? user.email.split("@")[0] : "Guest";

  return (
    <div className="bg-black min-h-screen text-white">
      {/* Navbar */}
      <nav className="flex justify-between items-center px-6 py-4 bg-gray-900 sticky top-0 z-50">
        <h1 className="text-xl font-bold hidden sm:block">{username}</h1>
        <div className="flex gap-4 relative">
          <Link href="/favorites" className="hover:underline">Favorites</Link>
          <Link href="/watchlist" className="hover:underline">Watchlist</Link>

          {/* Genres dropdown */}
          <div className="relative">
            <button
              className="hover:underline"
              onClick={() => setShowGenres((prev) => !prev)}
            >
              Genres
            </button>
            {showGenres && (
              <div className="absolute mt-2 bg-gray-800 rounded shadow-lg p-2 max-h-60 overflow-y-auto">
                {genres.map((g) => (
                  <Link
                    key={g.id}
                    href={`/genre?id=${g.id}&name=${g.genre}`}
                    className="block px-4 py-2 hover:bg-gray-700 rounded"
                    onClick={() => setShowGenres(false)}
                  >
                    {g.genre}
                  </Link>
                ))}
              </div>
            )}
          </div>

          <Link href="/login" className="hover:underline" onClick={handleLogout}>
            Logout
          </Link>
        </div>
      </nav>

      {/* Popüler film slider */}
      <div className="px-6 py-8 overflow-x-auto overflow-y-auto">
        <Slider />

        {/* Genre listesi */}
        {genres.map((g) => (
          <div key={g.id} className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">{g.genre}</h2>
              <Link
                href={`/genre?id=${g.id}&name=${g.genre}`}
                className="hover:underline"
              >
                See more
              </Link>
            </div>
            <div className="flex gap-4 overflow-x-auto overflow-y-hidden">
              {(g.movies || []).map((m) => (
                <MovieCard
                  key={m.id}
                  id={m.id}
                  title={m.title}
                  image={`https://image.tmdb.org/t/p/w500${m.poster_path}`}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
