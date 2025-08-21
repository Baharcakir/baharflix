import express from "express";
import { getPopularMovies, getMoviesByGenre, getGenresWithMovies, getMovieDetail, getMovieTrailer } from "../controllers/movieController.js";

const router = express.Router();

router.get("/popular", getPopularMovies);
router.get("/genres", getGenresWithMovies);
router.get("/genre/:genreName", getMoviesByGenre);
router.get("/:id", getMovieDetail);
router.get("/:id/trailer", getMovieTrailer);

export default router;
