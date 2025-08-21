"use client";

import { useCallback } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchMovieTrailer } from "@/store/movies/movieSlice";

interface WatchButtonProps {
  movieId: number;
  className?: string;
}

const WatchButton: React.FC<WatchButtonProps> = ({ movieId, className }) => {
  const dispatch = useAppDispatch();
  const { movieDetail, loading } = useAppSelector((state) => state.movie);

  const handleClick = useCallback(async () => {
    try {
      // Eğer trailer yoksa fetch et
      if (!movieDetail?.trailer && !loading) {
        // thunk'unuz unwrap() destekliyorsa hata yakalama kolay olur
        await dispatch(fetchMovieTrailer(movieId)).unwrap();
      }

      const trailer = movieDetail?.trailer;
      if ((trailer?.site ?? "YouTube") === "YouTube") {
        const key = trailer?.key ?? ( (await (dispatch(fetchMovieTrailer(movieId)).unwrap())).key );
        window.open(`https://www.youtube.com/watch?v=${key}`, "_blank");
      } else {
        alert("Trailer bulunamadı!");
      }
    } catch (err) {
      console.error("Trailer fetch hatası:", err);
      alert("Fragman yüklenemiyor.");
    }
  }, [dispatch, movieId, movieDetail?.trailer, loading]);

  return (
    <button
      onClick={handleClick}
      className={`px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md transition ${className}`}
      disabled={loading}
    >
      {loading ? "Loading..." : "Watch Trailer"}
    </button>
  );
};

export default WatchButton;
