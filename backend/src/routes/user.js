import express from "express";
import { upsertUser } from "../controllers/userController.js";

const router = express.Router();

// Frontend login sonrası UID ile çağıracak
router.post("/", upsertUser);

export default router;