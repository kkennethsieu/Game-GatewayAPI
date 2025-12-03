import express from "express";
import cors from "cors";

const app = express();
app.use(express.json());

// const USER_SERVICE = "http://localhost:3000";
// const REVIEW_SERVICE = "http://localhost:4000";
// const GAME_SERVICE = "http://localhost:8000";
// const LIKES_SERVICE = "http://host.docker.internal:7060";

const LIKES_SERVICE = "http://likes-service:7060";
const USER_SERVICE = "http://user-service:3000";
const REVIEW_SERVICE = "http://reviews-service:4000";
const GAME_SERVICE = "http://catalog-service:8000";

app.use(
  cors({
    origin: ["http://localhost:5173"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// --- Routes ---
// cache example
const cache = new Map();

app.get("/", (req, res) => {
  res.json("Gateway service is running");
});
// Endpoint: GET /user/:userId/reviews-with-games
app.get("/user/:userId/reviews-with-games", async (req, res) => {
  const { userId } = req.params;
  console.log("Fetching reviews for user:", userId);

  try {
    const reviewRes = await fetch(`${REVIEW_SERVICE}/reviews/user/${userId}`);
    const reviews = await reviewRes.json();

    const enrichedReviews = await Promise.all(
      reviews.map(async (review) => {
        const { gameId } = review;

        const gameRes = await fetch(`${GAME_SERVICE}/games/id/${gameId}`);
        const game = await gameRes.json();

        return { ...review, game };
      })
    );

    res.json(enrichedReviews);
  } catch (err) {
    console.error("Gateway error:", err);
    res.status(500).json({ error: "Something went wrong in gateway" });
  }
});

// Endpoint: GET /review/:reviewId/reviews-with-user
app.get("/review/:gameId/reviews-with-user", async (req, res) => {
  const { gameId } = req.params;

  try {
    const reviewRes = await fetch(`${REVIEW_SERVICE}/reviews/game/${gameId}`);
    const reviews = await reviewRes.json();

    const enrichedReviews = await Promise.all(
      reviews.map(async (review) => {
        try {
          const userRes = await fetch(
            `${USER_SERVICE}/auth/user/${review.userId}`
          );
          const likesRes = await fetch(
            `${LIKES_SERVICE}/likes/review/${review.reviewId}`
          );
          const user = await userRes.json();
          const likesCount = await likesRes.json();
          return { ...review, user, likesCount };
        } catch {
          // If user fetch fails, return review with null user
          return { ...review, user: null };
        }
      })
    );

    res.json(enrichedReviews);
  } catch (err) {
    console.error("Gateway error:", err);
    res.status(500).json({ error: "Something went wrong in gateway" });
  }
});

app.listen(9000, () => console.log("Gateway running on 9000"));

// NEED TO FETCH ALL REVIEWS FOR A CERTAIN GAME ID
// NEED TO INCLUDE EACH AUTHOR FOR EACH REVIEW
