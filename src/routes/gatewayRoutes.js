import express from "express";
import {
  getUserReviewsWithGames,
  getGameReviewsWithUsers,
} from "../controllers/controller.js";

const router = express.Router();

// GET /user/:userId/reviews-with-games
// Fetch all reviews by a user, enriched with game data
router.get("/user/:userId/reviews-with-games", getUserReviewsWithGames);

// GET /games/:gameId/reviews-with-users
// Fetch all reviews for a game, enriched with author/user data/
router.get("/review/:gameId/reviews-with-user", getGameReviewsWithUsers);

export default router;
