# 🌐 Game Review API Gateway

**API Gateway microservice for the Game Review Platform**  
Routes requests to the appropriate microservices (User, Review, Game Catalog, Likes) and enriches responses with related data.

---

## 🔹 Project Overview

This service acts as a **single entry point** for the frontend to interact with multiple backend services. It fetches, combines, and returns data from the following microservices:

- **User Service** – fetch user info
- **Review Service** – fetch reviews
- **Game Catalog Service** – fetch game details
- **Likes Service** – fetch like/dislike counts

**Tech Stack:**  
Node.js, Express, CORS, Docker

---

## 🌐 Base URL

```
http://localhost:8000
```

---

## 💻 Running Locally

### 1. Install dependencies

```bash
npm install
```

### 2. Run the server

```bash
npm run dev   # if using nodemon
# or
node index.js

```

## 🔹 Environment Variables

You can set service URLs via environment variables, or use the defaults:

```javascript
const LIKES_SERVICE = process.env.LIKES_SERVICE || "http://likes-service:7060";
const USER_SERVICE = process.env.USER_SERVICE || "http://user-service:3000";
const REVIEW_SERVICE =
  process.env.REVIEW_SERVICE || "http://reviews-service:4000";
const GAME_SERVICE = process.env.GAME_SERVICE || "http://catalog-service:8000";
```

## 🔹 API Endpoints

### 1. GET /

    Description: Health check endpoint

    Response Example:

    "Gateway service is running"

### 2. GET /user/:userId/reviews-with-games

    Description: Fetch all reviews by a user and include game details

    Response Example:

```json
[
  {
    "reviewId": 1,
    "userId": 3,
    "gameId": 5,
    "rating": 4,
    "comment": "Great game!",
    "game": {
      "gameId": 5,
      "title": "Game Title",
      "genre": "Action",
      "releaseYear": 2024
    }
  }
]
```

### 3. GET /review/:gameId/reviews-with-user

    Description: Fetch all reviews for a specific game and include author info and like/dislike counts

    Response Example:

```json
[
  {
    "reviewId": 10,
    "userId": 3,
    "gameId": 5,
    "rating": 5,
    "comment": "Amazing!",
    "user": {
      "userId": 3,
      "username": "gamer123"
    },
    "likesCount": {
      "totalLikes": 12,
      "totalDislikes": 1
    }
  }
]
```

## ⚠️ Notes

CORS is configured to allow requests from http://localhost:5173 (frontend).

Cache Example: A simple in-memory cache (Map) is included.

Ensure all microservices are accessible at the URLs configured in the service constants or via Docker network.

## 🐳 Docker

When running inside Docker, the gateway uses service names for internal communication:

```javascript
const USER_SERVICE = process.env.USER_SERVICE || "http://localhost:3001";
const REVIEW_SERVICE = process.env.REVIEW_SERVICE || "http://localhost:3002";
const GAME_SERVICE = process.env.GAME_SERVICE || "http://localhost:3003";
const LIKES_SERVICE = process.env.LIKES_SERVICE || "http://localhost:3004";
```

The gateway service should be included in the same Docker network as all other microservices.

## 🔹 Example Request from Frontend

```javascript
const response = await fetch("http://localhost:8000/user/3/reviews-with-games");
const reviews = await response.json();
console.log(reviews);
```
