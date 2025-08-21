import FavoriteModel from "../models/FavoritesModel.js";
import WatchlistModel from "../models/WatchlistModel.js";
import axios from "axios";

const TMDB_BASE_URL = "https://api.themoviedb.org/3";

// Popüler filmler
export const getPopularMovies = async (req, res) => {
  const { uid } = req.query;
  const TMDB_API_KEY = process.env.TMDB_API_KEY;

  if (!TMDB_API_KEY)
    return res.status(500).json({ error: "TMDB_API_KEY env değeri bulunamadı!" });

  try {
    const response = await axios.get(`${TMDB_BASE_URL}/movie/popular`, {
      params: { api_key: TMDB_API_KEY, language: "en-US", page: 1 },
    });

    let popularMovies = response.data.results.slice(0, 10);

    if (uid) {
      // Kullanıcının favori ve watchlist dokümanlarını al
      const userFavorites = await FavoriteModel.findOne({ uid });
      const userWatchlist = await WatchlistModel.findOne({ uid });

      // Filmlere user bilgilerini ekle
      popularMovies = popularMovies.map((movie) => ({
        ...movie,
        isFavorite: userFavorites?.movies?.some(f => f.movieId === movie.id) || false,
        isInWatchlist: userWatchlist?.movies?.some(w => w.movieId === movie.id) || false,
      }));
    } else {
      // Eğer uid yoksa false olarak set et
      popularMovies = popularMovies.map((movie) => ({
        ...movie,
        isFavorite: false,
        isInWatchlist: false,
      }));
    }

    res.json(popularMovies);
  } catch (err) {
    console.error("TMDb API Hatası:", err.response?.data || err.message);
    res.status(500).json({ error: "Failed to fetch popular movies" });
  }
};

// Belirli bir genre filmleri
export const getMoviesByGenre = async (req, res) => {
  const TMDB_API_KEY = process.env.TMDB_API_KEY;
  if (!TMDB_API_KEY) return res.status(500).json({ error: "TMDB_API_KEY env değeri bulunamadı!" });

  const { genreName } = req.params;
  try {
    const response = await axios.get(`${TMDB_BASE_URL}/discover/movie`, {
      params: { api_key: TMDB_API_KEY, language: "en-US", sort_by: "popularity.desc", with_genres: genreName },
    });
    res.json(response.data.results);
  } catch (err) {
    console.error("TMDb Genre API Hatası:", err.response?.data || err.message);
    res.status(500).json({ error: "Failed to fetch movies by genre" });
  }
};

// Genre listesi + her bir genre için filmler
export const getGenresWithMovies = async (req, res) => {
  const TMDB_API_KEY = process.env.TMDB_API_KEY;
  if (!TMDB_API_KEY)
    return res.status(500).json({ error: "TMDB_API_KEY env değeri bulunamadı!" });

  try {
    const genresRes = await axios.get(`${TMDB_BASE_URL}/genre/movie/list`, {
      params: { api_key: TMDB_API_KEY, language: "en-US" },
    });
    const genres = genresRes.data.genres;

    const genresWithMovies = await Promise.all(
      genres.map(async (genre) => {
        const moviesRes = await axios.get(`${TMDB_BASE_URL}/discover/movie`, {
          params: {
            api_key: TMDB_API_KEY,
            language: "en-US",
            sort_by: "popularity.desc",
            with_genres: genre.id,
            page: 1,
          },
        });

        return {
          id: genre.id, // <-- ID'yi ekledik
          genre: genre.name,
          movies: moviesRes.data.results.slice(0, 10),
        };
      })
    );

    res.json(genresWithMovies);
  } catch (err) {
    console.error("TMDb Genre API Hatası:", err.response?.data || err.message);
    res.status(500).json({ error: "Failed to fetch genres with movies" });
  }
};

// Film detayları + favori/watchlist kontrolü
export const getMovieDetail = async (req, res) => {
  const TMDB_API_KEY = process.env.TMDB_API_KEY;
  if (!TMDB_API_KEY) return res.status(500).json({ error: "TMDB_API_KEY env değeri bulunamadı!" });

  const { id } = req.params;
  const { uid } = req.query;

  try {
    const movieRes = await axios.get(`${TMDB_BASE_URL}/movie/${id}`, {
      params: { api_key: TMDB_API_KEY, language: "en-US" },
    });

    const creditsRes = await axios.get(`${TMDB_BASE_URL}/movie/${id}/credits`, {
      params: { api_key: TMDB_API_KEY },
    });

    const actors = creditsRes.data.cast.map(actor => ({
      id: actor.id,
      name: actor.name,
      profile_path: actor.profile_path,
    }));

    let isFavorite = false;
    let isInWatchlist = false;

    if (uid) {
      const fav = await FavoriteModel.findOne({ uid });
      if (fav?.movies.some(m => m.movieId === Number(id))) isFavorite = true;

      const watch = await WatchlistModel.findOne({ uid });
      if (watch?.movies.some(m => m.movieId === Number(id))) isInWatchlist = true;
    }

    res.json({
      id: movieRes.data.id,
      title: movieRes.data.title,
      overview: movieRes.data.overview,
      runtime: movieRes.data.runtime,
      poster_path: movieRes.data.poster_path,
      actors,
      isFavorite,
      isInWatchlist,
    });
  } catch (err) {
    console.error("TMDb Movie Detail API Error:", err.response?.data || err.message);
    res.status(500).json({ error: "Failed to fetch movie details" });
  }
};

// Videoları bu endpoint ile çekiyoruz
export const getMovieTrailer = async (req, res) => {
  const TMDB_API_KEY = process.env.TMDB_API_KEY;
  if (!TMDB_API_KEY) return res.status(500).json({ error: "TMDB_API_KEY not found" });

  const { id } = req.params;

  try {
    const response = await axios.get(`${TMDB_BASE_URL}/movie/${id}/videos`, {
      params: { api_key: TMDB_API_KEY, language: "en-US" },
    });

    // Youtube trailer'i bul (type: Trailer, site: YouTube)
    const trailer = response.data.results.find(
      (vid) => vid.type === "Trailer" && vid.site === "YouTube"
    );

    if (!trailer) return res.status(404).json({ error: "Trailer not found" });

    res.json({
      id: trailer.id,
      key: trailer.key, // Youtube video key
      name: trailer.name,
      site: trailer.site,
      type: trailer.type,
    });
  } catch (err) {
    console.error("TMDb Trailer API Error:", err.response?.data || err.message);
    res.status(500).json({ error: "Failed to fetch trailer" });
  }
};
