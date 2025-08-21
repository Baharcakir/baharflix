import WatchlistModel from "../models/WatchlistModel.js";

// İzleme listesine film ekleme
export const addToWatchlist = async (req, res) => {
  const { uid, movieId } = req.body;

  if (!uid || !movieId) return res.status(400).json({ error: "uid ve movieId gerekli" });

  try {
    // Kullanıcı için izleme listesi dokümanı var mı?
    let watchlist = await WatchlistModel.findOne({ uid });

    if (!watchlist) {
      // Yoksa yeni oluştur
      watchlist = new WatchlistModel({ uid, movies: [{ movieId }] });
    } else {
      // Zaten varsa duplicate kontrolü
      const exists = watchlist.movies.some((m) => m.movieId === movieId);
      if (!exists) {
        watchlist.movies.push({ movieId });
      }
    }

    await watchlist.save();
    res.json(watchlist);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "İzleme listesine eklenemedi" });
  }
};

// Kullanıcının izleme listesini getirme
export const getWatchlist = async (req, res) => {
  const { uid } = req.params;
  if (!uid) return res.status(400).json({ error: "uid gerekli" });

  try {
    const watchlist = await WatchlistModel.findOne({ uid });
    res.json(watchlist?.movies || []);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "İzleme listesi getirilemedi" });
  }
};

// Watchlist film çıkarma
export const removeFromWatchlist = async (req, res) => {
  const { uid, movieId } = req.params;

  if (!uid || !movieId) return res.status(400).json({ error: "uid ve movieId gerekli" });

  try {
    const watchlist = await WatchlistModel.findOne({ uid });
    if (!watchlist) return res.status(404).json({ error: "Watchlist bulunamadı" });

    watchlist.movies = watchlist.movies.filter((m) => m.movieId !== Number(movieId));
    await watchlist.save();

    res.json(watchlist);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Film watchlistten çıkarılamadı" });
  }
};
