import express from "express";
import { addFavorite, getFavorites, removeFavorite } from "../controllers/favoritesController.js";

const router = express.Router();

// Favorilere film ekleme
router.post("/", addFavorite);

// Kullanıcının favorilerini çekme
router.get("/:uid", getFavorites);

// Favorilerden film çıkarma
router.delete("/:uid/:movieId", removeFavorite);

export default router;
