export const getUserReviewsWithGames = async (req, res) => {
  const { userId } = req.params;

  if (!userId) {
    return res.status(400).json({ error: "Missing userId parameter" });
  }

  try {
    // Fetch reviews
    const reviewRes = await fetch(
      `${process.env.REVIEW_SERVICE_URL}/reviews/user/${userId}`
    );
    if (!reviewRes.ok) {
      return res
        .status(reviewRes.status)
        .json({ error: "Failed to fetch reviews" });
    }
    const reviews = await reviewRes.json();

    // Enrich with game data
    const enrichedReviews = await Promise.all(
      reviews.map(async (review) => {
        try {
          const gameRes = await fetch(
            `${process.env.CATALOG_SERVICE_URL}/games/id/${review.gameId}`
          );
          const game = gameRes.ok ? await gameRes.json() : null;
          return { ...review, game };
        } catch {
          return { ...review, game: null }; // fallback if game fetch fails
        }
      })
    );

    res.status(200).json(enrichedReviews);
  } catch (err) {
    console.error("Gateway error:", err);
    res.status(500).json({ error: "Something went wrong in gateway" });
  }
};

export const getGameReviewsWithUsers = async (req, res) => {
  const { gameId } = req.params;

  if (!gameId) {
    return res.status(400).json({ error: "Missing gameId parameter" });
  }

  try {
    const reviewRes = await fetch(
      `${process.env.REVIEW_SERVICE_URL}/reviews/game/${gameId}`
    );

    if (!reviewRes.ok) {
      return res
        .status(reviewRes.status)
        .json({ error: "Failed to fetch reviews" });
    }
    const reviews = await reviewRes.json();

    const enrichedReviews = await Promise.all(
      reviews.map(async (review) => {
        try {
          const userRes = await fetch(
            `${process.env.USER_SERVICE_URL}/auth/user/${review.userId}`
          );
          const likesRes = await fetch(
            `${process.env.LIKES_SERVICE_URL}/likes/review/${review.reviewId}`
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

    res.status(200).json(enrichedReviews);
  } catch (err) {
    console.error("Gateway error:", err);
    res.status(500).json({ error: "Something went wrong in gateway" });
  }
};
