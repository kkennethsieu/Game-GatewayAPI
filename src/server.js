import app from "./app.js";

const PORT = process.env.PORT || 8000;

app.listen(PORT, "0.0.0.0", () =>
  console.log(`Gateway running on port: ${PORT}`)
);
