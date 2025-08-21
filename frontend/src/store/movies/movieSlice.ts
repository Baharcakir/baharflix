/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { API_BASE_URL } from "@/config/api";

export interface Movie {
  id: number;
  title: string;
  poster_path: string;
  overview: string;
  isFavorite?: boolean;
  isInWatchlist?: boolean;
}

interface GenreMovies {
  id: number;
  genre: string;
  movies: Movie[];
}

interface MovieState {
  moviesByGenre: Movie[];
  popular: Movie[];
  genres: { id: number;  genre: string; movies: Movie[] }[];
  favorites: Movie[];
  watchlist: Movie[];
  movieDetail: {
  id?: number;
  title?: string;
  overview?: string;
  runtime?: number;
  poster_path?: string;
  isFavorite?: boolean;
  isInWatchlist?: boolean;
  trailer?: { key: string; name: string; site: string; type: string };
  actors?: { id: number; name: string; profile_path?: string }[];
  } | null;
  loading: boolean;
  error: string | null;
}

const initialState: MovieState = {
  moviesByGenre: [],
  popular: [],
  genres: [],
  favorites: [],
  watchlist: [],
  movieDetail: null,
  loading: false,
  error: null,
};

// Popüler filmler
export const fetchPopularMovies = createAsyncThunk<Movie[], string | undefined>(
  "movies/fetchPopular",
  async (uid, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${API_BASE_URL}/movies/popular`, { params: { uid } });
      return res.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Genre’lara göre filmler (tüm genre listesini alıyoruz)
export const fetchMoviesByGenres = createAsyncThunk<GenreMovies[], void, { rejectValue: string }>(
  "movies/fetchByGenres",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${API_BASE_URL}/movies/genres`);
      // Backend tarafında her genre için movies dizisi de varsa direkt return
      return res.data as GenreMovies[];
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Belirli bir genre ID'sine göre filmleri çek
export const fetchMoviesByGenreId = createAsyncThunk(
  "movies/fetchByGenreId",
  async (genreId: number, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${API_BASE_URL}/movies/genre/${genreId}`);
      return res.data as Movie[];
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Belirli bir film ID'sine göre detayları çek (uid ile birlikte)
export const fetchMovieDetail = createAsyncThunk<
  any,
  { movieId: string; uid?: string },
  { rejectValue: string }
>(
  "movies/fetchMovieDetail",
  async ({ movieId, uid }, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${API_BASE_URL}/movies/${movieId}`, {
        params: { uid }, // uid varsa backend'e gönderiyoruz
      });
      return res.data; // movie detail object, içinde isFavorite ve isInWatchlist olacak
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);


export const addFavoriteMovie = createAsyncThunk<
  any,
  { uid: string; movieId: number },
  { rejectValue: string }
>(
  "movies/addFavoriteMovie",
  async ({ uid, movieId }, { rejectWithValue }) => {
    try {
      const res = await axios.post(`${API_BASE_URL}/favorites`, { uid, movieId });
      return res.data; // backend’den dönen favori doküman
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || error.message);
    }
  }
);

export const addToWatchlist = createAsyncThunk<
  any,
  { uid: string; movieId: number },
  { rejectValue: string }
>(
  "movies/addToWatchlist",
  async ({ uid, movieId }, { rejectWithValue }) => {
    try {
      const res = await axios.post(`${API_BASE_URL}/watchlist`, { uid, movieId });
      return res.data; // backend’den dönen izleme listesi dokümanı
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || error.message);
    }
  }
);

// Kullanıcının favori filmlerini çek
export const fetchFavorites = createAsyncThunk<Movie[], string, { rejectValue: string }>(
  "movies/fetchFavorites",
  async (uid, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${API_BASE_URL}/favorites/${uid}`);
      return res.data; // array of favorite movies
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || error.message);
    }
  }
);

// Kullanıcının watchlist filmlerini çek
export const fetchWatchlist = createAsyncThunk<Movie[], string, { rejectValue: string }>(
  "movies/fetchWatchlist",
  async (uid, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${API_BASE_URL}/watchlist/${uid}`);
      return res.data; // array of watchlist movies
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || error.message);
    }
  }
);

// Favorilerden çıkar
export const removeFavoriteMovie = createAsyncThunk<
  { movieId: number }, // döndürülen değer tipini belirtiyoruz
  { uid: string; movieId: number },
  { rejectValue: string }
>(
  "movies/removeFavoriteMovie",
  async ({ uid, movieId }, { rejectWithValue }) => {
    try {
      await axios.delete(`${API_BASE_URL}/favorites/${uid}/${movieId}`);
      return { movieId }; // sadece çıkarılan filmi döndürüyoruz
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) return rejectWithValue(error.response?.data?.error || error.message);
      return rejectWithValue(String(error));
    }
  }
);

// Watchlist’ten çıkar
export const removeFromWatchlist = createAsyncThunk<
  { movieId: number }, 
  { uid: string; movieId: number },
  { rejectValue: string }
>(
  "movies/removeFromWatchlist",
  async ({ uid, movieId }, { rejectWithValue }) => {
    try {
      await axios.delete(`${API_BASE_URL}/watchlist/${uid}/${movieId}`);
      return { movieId };
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) return rejectWithValue(error.response?.data?.error || error.message);
      return rejectWithValue(String(error));
    }
  }
);

export const fetchMovieTrailer = createAsyncThunk<
  { key: string; name: string; site: string; type: string },
  number,
  { rejectValue: string }
>(
  "movies/fetchTrailer",
  async (movieId, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${API_BASE_URL}/movies/${movieId}/trailer`);
      return res.data; // { key, name, site, type }
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.error || err.message);
    }
  }
);


const movieSlice = createSlice({
  name: "movies",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Popüler filmler
      .addCase(fetchPopularMovies.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPopularMovies.fulfilled, (state, action: PayloadAction<Movie[]>) => {
        state.loading = false;
        state.popular = action.payload.map((m) => ({
          ...m,
          isFavorite: state.favorites.some(f => f.id === m.id),
          isInWatchlist: state.watchlist.some(w => w.id === m.id),
        })).slice(0, 10);
      })
      .addCase(fetchPopularMovies.rejected, (state) => {
        state.loading = false;
        //state.error = action.payload ?? "Popüler filmler yüklenemedi";
      })

      // Genre filmleri
      .addCase(fetchMoviesByGenres.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMoviesByGenres.fulfilled, (state, action: PayloadAction<GenreMovies[]>) => {
        state.loading = false;
        state.genres = action.payload;
      })
      .addCase(fetchMoviesByGenres.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Genre filmleri yüklenemedi";
      })

      // Belirli bir genre için filmler
      .addCase(fetchMoviesByGenreId.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMoviesByGenreId.fulfilled, (state, action: PayloadAction<Movie[]>) => {
        state.loading = false;
        state.moviesByGenre = action.payload;
      })
      .addCase(fetchMoviesByGenreId.rejected, (state) => {
        state.loading = false;
        //state.error = action.payload ?? "Genre filmleri yüklenemedi";
      })
      .addCase(fetchMovieDetail.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMovieDetail.fulfilled, (state, action: PayloadAction<MovieState["movieDetail"]>) => {
        state.loading = false;
        state.movieDetail = action.payload;
      })
      .addCase(fetchMovieDetail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || "Failed to load movie detail";
      })
      .addCase(addFavoriteMovie.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addFavoriteMovie.fulfilled, (state) => {
        state.loading = false;
        // Eğer movieDetail var ve eklenen film aynıysa favorilere ekleyebiliriz
        if (state.movieDetail) {
          state.movieDetail = {
            ...state.movieDetail,
            isFavorite: true, // opsiyonel, UI için işaret
          };
        }
      })
      .addCase(addFavoriteMovie.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Failed to add favorite";
      })
      .addCase(addToWatchlist.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addToWatchlist.fulfilled, (state) => {
        state.loading = false;
        // Eğer movieDetail var ve eklenen film aynıysa izleme listesine ekleyebiliriz
        if (state.movieDetail) {
          state.movieDetail = {
            ...state.movieDetail,
            isInWatchlist: true, // opsiyonel, UI için işaret
          };
        }
      })
      .addCase(addToWatchlist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Failed to add to watchlist";
      })
      .addCase(fetchFavorites.fulfilled, (state, action: PayloadAction<Movie[]>) => {
        state.favorites = action.payload;
      })
      .addCase(fetchWatchlist.fulfilled, (state, action: PayloadAction<Movie[]>) => {
        state.watchlist = action.payload;
      })
            // Favorilerden çıkarma
      .addCase(removeFavoriteMovie.fulfilled, (state, action) => {
        state.loading = false;

        // movieDetail aynı filmse işaret kaldır
        if (state.movieDetail && state.movieDetail.id === action.payload.movieId) {
          state.movieDetail.isFavorite = false;
        }

        // favoriler listesinden çıkar
        state.favorites = state.favorites.filter(m => m.id !== action.payload.movieId);
      })
      .addCase(removeFavoriteMovie.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Failed to remove favorite";
      })

      // Watchlist’ten çıkarma
      .addCase(removeFromWatchlist.fulfilled, (state, action) => {
        state.loading = false;
        if (state.movieDetail && state.movieDetail.id === action.payload.movieId) {
          state.movieDetail.isInWatchlist = false;
        }
        state.watchlist = state.watchlist.filter(m => m.id !== action.payload.movieId);
      })
      .addCase(removeFromWatchlist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Failed to remove from watchlist";
      })
      .addCase(fetchMovieTrailer.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMovieTrailer.fulfilled, (state, action: PayloadAction<{ key: string; name: string; site: string; type: string }>) => {
        state.loading = false;
        // Trailer bilgisini movieDetail içine de ekleyebiliriz
        if (state.movieDetail) {
          state.movieDetail = {
            ...state.movieDetail,
            trailer: action.payload,
          };
        }
      })
      .addCase(fetchMovieTrailer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Failed to fetch trailer";
      });
  },
});

export default movieSlice.reducer;
