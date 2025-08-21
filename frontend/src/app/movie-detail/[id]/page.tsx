"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchMovieDetail, addFavoriteMovie, removeFavoriteMovie, addToWatchlist, removeFromWatchlist} from "@/store/movies/movieSlice";
import { Heart, Bookmark} from "lucide-react";
import WatchButton from "@/components/WatchButton";
import Image from "next/image";

export default function MovieDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useAppSelector((state) => state.auth);
  const { movieDetail, loading, error } = useAppSelector((state) => state.movie);
  const movieId = Array.isArray(id) ? id[0] : id;
  const dispatch = useAppDispatch();

  const isFavorite = movieDetail?.isFavorite || false;
  const isWatchlist = movieDetail?.isInWatchlist || false;

  const handleToggleFavorite = () => {
    if (!user) return alert("Please login!");
    if (isFavorite) {
      dispatch(removeFavoriteMovie({ uid: user.uid, movieId: Number(movieId) }));
    } else {
      dispatch(addFavoriteMovie({ uid: user.uid, movieId: Number(movieId) }));
    }
  };

  const handleToggleWatchlist = () => {
    if (!user) return alert("Please login!");
    if (isWatchlist) {
      dispatch(removeFromWatchlist({ uid: user.uid, movieId: Number(movieId) }));
    } else {
      dispatch(addToWatchlist({ uid: user.uid, movieId: Number(movieId) }));
    }
  };

  useEffect(() => {
    if (movieId) {
      dispatch(fetchMovieDetail({ movieId, uid: user?.uid }));;
    }
  }, [movieId, dispatch, user?.uid]);

  if (loading) return <div className="text-white">Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;
  if (!movieDetail) return <div className="text-white">No movie found.</div>;

  return (
    <div className="bg-black min-h-screen text-white p-6">
      {/* Go Back */}
      <button
        onClick={() => router.back()}
        className="mb-4 px-3 py-1 rounded-lg bg-gray-200 hover:bg-gray-300 text-black"
      >
        ← Go Back
      </button>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Poster */}
        <Image
          src={`https://image.tmdb.org/t/p/w500${movieDetail.poster_path}`}
          alt={movieDetail?.title || "Movie Poster"}
          className="w-96 rounded-lg self-center md:self-start"
          width={384}
          height={576}
        />

        {/* Film Detayları */}
        <div className="flex-1 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold">{movieDetail.title}</h1>
          </div>

          <p className="text-gray-300">{movieDetail.overview}</p>
          <p className="text-gray-400">Duration: {movieDetail.runtime} min</p>

          {/* Fragman Butonu */}
          <div className="flex gap-4 mt-2">
            <WatchButton movieId={Number(movieId)} />

            <button onClick={handleToggleFavorite}>
              {isFavorite ? (
                <Heart size={32} className="text-red-600 fill-red-600 cursor-pointer" />
              ) : (
                <Heart size={32} className="text-white cursor-pointer" />
              )}

            </button>
          {/* Watchlist Button */}
          <button onClick={handleToggleWatchlist}>
            {isWatchlist ? (
              <Bookmark size={32} className="text-yellow-500 fill-yellow-500 cursor-pointer" />
            ) : (
              <Bookmark size={32} className="text-white cursor-pointer" />
            )}
          </button>
          </div>

          {/* Oyuncular */}
          {movieDetail.actors && movieDetail.actors.length > 0 && (
            <>
              <h2 className="text-xl font-semibold mt-6">Actors</h2>
              <div className="flex gap-4 overflow-x-auto mt-2">
                {movieDetail.actors.slice(0, 4).map((actor) => (
                  <div key={actor.id} className="w-32 flex-shrink-0">
                    <Image
                      src={`https://image.tmdb.org/t/p/w200${actor.profile_path}`}
                      alt={actor.name}
                      className="rounded-lg mb-2"
                      width={128}
                      height={192}
                    />
                    <p className="text-center">{actor.name}</p>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
