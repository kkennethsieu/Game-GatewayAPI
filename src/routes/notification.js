import express from "express";
import fetch from "node-fetch";

const router = express.Router();

router.use("/", async (req, res) => {
  try {
    const response = await fetch(
      `${process.env.NOTIFICATION_SERVICE_URL}${req.originalUrl.replace(
        "/api/notification",
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

    res.status(response.status);

    const setCookie = response.headers.get("set-cookie");
    if (setCookie) {
      res.setHeader("set-cookie", setCookie);
    }

    const data = await response.text();
    res.send(data);
  } catch (err) {
    console.error("Notification proxy error:", err);
    res.status(502).json({ error: "Notification service unavailable" });
  }
});

export const notificationRouter = router;
