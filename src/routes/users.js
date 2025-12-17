import express from "express";
import fetch from "node-fetch";

const router = express.Router();

router.use("/", async (req, res) => {
  try {
    const response = await fetch(
      `${process.env.USER_SERVICE_URL}${req.originalUrl.replace(
        "/api/users",
        ""
      )}`,
      {
        method: req.method,
        headers: {
          ...req.headers,
          host: undefined,
        },
        body:
          req.method === "GET" || req.method === "HEAD"
            ? undefined
            : JSON.stringify(req.body),
      }
    );

    // forward status
    res.status(response.status);

    // forward cookies
    const setCookie = response.headers.get("set-cookie");
    if (setCookie) {
      res.setHeader("set-cookie", setCookie);
    }

    // forward body
    const data = await response.text();
    res.send(data);
  } catch (err) {
    console.error("User-service proxy error:", err);
    res.status(502).json({ error: "User service unavailable" });
  }
});

export const usersRouter = router;
