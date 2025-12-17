import request from "supertest";
import nock from "nock";
import app from "../../src/app.js";

process.env.REVIEW_SERVICE_URL || "http://localhost:3003";
process.env.CATALOG_SERVICE_URL || "http://localhost:3002";

// testing get all reviews with games for a certain userId
describe("Gateway /user/:userId/reviews-with-games", () => {
  const USER_ID = 1;

  beforeEach(() => nock.cleanAll());

  it("returns reviews enriched with game info", async () => {
    // Mock review service
    nock(process.env.REVIEW_SERVICE_URL)
      .get(`/reviews/user/${USER_ID}`)
      .reply(200, [
        { reviewId: 1, userId: 1, gameId: 101, reviewTitle: "Great game!" },
      ]);

    // Mock game service
    nock(process.env.CATALOG_SERVICE_URL)
      .get(`/games/id/101`)
      .reply(200, { gameId: 101, title: "Cool Game" });

    const res = await request(app).get(
      `/gateway/user/${USER_ID}/reviews-with-games`
    );

    expect(res.status).toBe(200);
    expect(res.body[0]).toHaveProperty("reviewTitle", "Great game!");
    expect(res.body[0].game).toHaveProperty("title", "Cool Game");
  });

  it("returns 500 if review service fails", async () => {
    nock(process.env.REVIEW_SERVICE_URL)
      .get(`/reviews/user/${USER_ID}`)
      .reply(500);

    const res = await request(app).get(
      `/gateway/user/${USER_ID}/reviews-with-games`
    );

    expect(res.status).toBe(500);
    expect(res.body).toHaveProperty("error");
  });
});

// testing geting all reviews wiht user for a certain gameId
describe("Gateway /review/:gameId/reviews-with-user", () => {
  const GAME_ID = 1;

  beforeEach(() => nock.cleanAll());

  it("returns reviews enriched with user info", async () => {
    // Mock review service
    nock(process.env.REVIEW_SERVICE_URL)
      .get(`/reviews/game/${GAME_ID}`)
      .reply(200, [
        { reviewId: 1, userId: 1, gameId: 101, reviewTitle: "Great game!" },
      ]);

    // Mock user service
    nock(process.env.USER_SERVICE_URL)
      .get(`/auth/user/1`)
      .reply(200, { userId: 1, username: "test", phoneNumber: "1231231234" });

    // Mock likes service
    nock(process.env.LIKES_SERVICE_URL)
      .get(`/likes/review/1`)
      .reply(200, { likeId: 1, userId: 1, reviewId: 1, isLike: 0 });

    const res = await request(app).get(
      `/gateway/review/${GAME_ID}/reviews-with-user`
    );

    expect(res.status).toBe(200);
    expect(res.body[0].user).toHaveProperty("username", "test");
    expect(res.body[0]).toHaveProperty("reviewTitle", "Great game!");
  });

  it("returns 500 if review service fails", async () => {
    nock(process.env.REVIEW_SERVICE_URL)
      .get(`/reviews/game/${GAME_ID}`)
      .reply(500);

    const res = await request(app).get(
      `/gateway/review/${GAME_ID}/reviews-with-user`
    );

    expect(res.status).toBe(500);
    expect(res.body).toHaveProperty("error");
  });
});
