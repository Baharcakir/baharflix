"use client";

import { useState } from "react";
import { Heart, Bookmark, ChevronLeft, ChevronRight } from "lucide-react";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { addFavoriteMovie, removeFavoriteMovie, addToWatchlist, removeFromWatchlist } from "@/store/movies/movieSlice";
import Image from "next/image";
import WatchButton from "./WatchButton";

export default function Slider() {
  const [current, setCurrent] = useState(0);
  const { user } = useAppSelector((state) => state.auth);
  const { popular } = useAppSelector((state) => state.movie);
  const dispatch = useAppDispatch();

  if (!popular || popular.length === 0) return null;
  const movie = popular[current];

  const handleToggleFavorite = () => {
    if (!user) return alert("Please login!");
    if (movie.isFavorite) {
      dispatch(removeFavoriteMovie({ uid: user.uid, movieId: movie.id }));
    } else {
      dispatch(addFavoriteMovie({ uid: user.uid, movieId: movie.id }));
    }
  };

  const handleToggleWatchlist = () => {
    if (!user) return alert("Please login!");
    if (movie.isInWatchlist) {
      dispatch(removeFromWatchlist({ uid: user.uid, movieId: movie.id }));
    } else {
      dispatch(addToWatchlist({ uid: user.uid, movieId: movie.id }));
    }
  };

  const prevSlide = () => setCurrent((prev) => (prev - 1 + popular.length) % popular.length);
  const nextSlide = () => setCurrent((prev) => (prev + 1) % popular.length);

  return (
    <div className="relative w-full h-96 mb-8 flex items-center justify-between bg-gray-900 rounded-lg overflow-hidden p-4">
      <div className="w-1/2 text-white flex flex-col justify-between h-full">
        <div>
          <h1 className="text-2xl font-bold">{movie.title}</h1>
          <p className="line-clamp-5 mt-2">{movie.overview}</p>
        </div>

        <div className="flex gap-4 mt-4 items-center">
          <WatchButton movieId={Number(movie.id)} />

          <button onClick={handleToggleFavorite}>
            {movie.isFavorite ? (
              <Heart size={28} className="text-red-600 fill-red-600 cursor-pointer" />
            ) : (
              <Heart size={28} className="text-white cursor-pointer" />
            )}
          </button>

          <button onClick={handleToggleWatchlist}>
            {movie.isInWatchlist ? (
              <Bookmark size={28} className="text-yellow-500 fill-yellow-500 cursor-pointer" />
            ) : (
              <Bookmark size={28} className="text-white cursor-pointer" />
            )}
          </button>
        </div>
      </div>

      <div className="w-1/2 h-full flex justify-end">
        <Image
          src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
          alt={movie.title}
          className="h-full object-cover rounded-lg shadow-lg"
          width={384}
          height={576}
        />
      </div>

      <button
        onClick={prevSlide}
        className="absolute left-2 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75"
      >
        <ChevronLeft size={24} />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-2 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75"
      >
        <ChevronRight size={24} />
      </button>
    </div>
  );
}
