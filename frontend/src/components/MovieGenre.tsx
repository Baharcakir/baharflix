import MovieCard from "./MovieCard";

type MovieGenreProps = {
  genre: string;
  movies: {
    id: number;
    title: string;
    poster_path: string | null;
  }[];
};

const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";

export default function MovieGenre({ genre, movies }: MovieGenreProps) {
  if (!movies || movies.length === 0) return null;

  return (
    <div className="my-6">
      <h2 className="text-xl font-bold mb-2">{genre}</h2>
      <div className="flex gap-4 overflow-x-hidden">
      {movies.map((movie) => (
        <MovieCard
          key={movie.id}
          id={movie.id} // <- burayı ekledik
          title={movie.title}
          image={movie.poster_path ? `${IMAGE_BASE_URL}${movie.poster_path}` : "/images/fallback.jpg"}
        />
      ))}
      </div>
    </div>
  );
}
