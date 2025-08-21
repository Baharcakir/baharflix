import FavoriteModel from "../models/FavoritesModel.js";

// Favorilere film ekleme
export const addFavorite = async (req, res) => {
  const { uid, movieId } = req.body;

  if (!uid || !movieId) return res.status(400).json({ error: "uid ve movieId gerekli" });

  try {
    // Kullanıcı için favori dokümanı var mı?
    let fav = await FavoriteModel.findOne({ uid });

    if (!fav) {
      // Yoksa yeni oluştur
      fav = new FavoriteModel({ uid, movies: [{ movieId }] });
    } else {
      // Zaten varsa duplicate kontrolü
      const exists = fav.movies.some((m) => m.movieId === movieId);
      if (!exists) {
        fav.movies.push({ movieId });
      }
    }

    await fav.save();
    res.json(fav);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Favorilere eklenemedi" });
  }
};

export const getFavorites = async (req, res) => {
  const { uid } = req.params;
  if (!uid) return res.status(400).json({ error: "uid gerekli" });

  try {
    const fav = await FavoriteModel.findOne({ uid });
    res.json(fav?.movies || []);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Favoriler getirilemedi" });
  }
};

// Kullanıcının favori sayfası için full detaylı liste (opsiyonel, UI için)
export const getFavoritesWithDetails = async (req, res) => {
  const { uid } = req.params;
  if (!uid) return res.status(400).json({ error: "uid gerekli" });

  try {
    const fav = await FavoriteModel.findOne({ uid });
    if (!fav || fav.movies.length === 0) return res.json([]);

    // Örnek: filmlerin detaylarını TMDB veya kendi movies koleksiyonundan alabilirsin
    // Burada sadece id’leri döndürüyoruz
    res.json(fav.movies);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Favoriler getirilemedi" });
  }
};

// Favorilerden film çıkarma
export const removeFavorite = async (req, res) => {
  const { uid, movieId } = req.params;

  if (!uid || !movieId) return res.status(400).json({ error: "uid ve movieId gerekli" });

  try {
    const fav = await FavoriteModel.findOne({ uid });
    if (!fav) return res.status(404).json({ error: "Favori bulunamadı" });

    fav.movies = fav.movies.filter((m) => m.movieId !== Number(movieId));
    await fav.save();

    res.json(fav);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Film favorilerden çıkarılamadı" });
  }
};
