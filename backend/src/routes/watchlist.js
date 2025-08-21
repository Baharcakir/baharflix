import express from "express";
import { addToWatchlist, getWatchlist, removeFromWatchlist} from "../controllers/watchlistController.js";

const router = express.Router();

// İzleme listesine film ekleme
router.post("/", addToWatchlist);

// Kullanıcının izleme listesini çekme
router.get("/:uid", getWatchlist);

// İzleme listesinden film çıkarma
router.delete("/:uid/:movieId", removeFromWatchlist);

export default router;
