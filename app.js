import express from "express";
import "dotenv/config";

import authRouter from "./routes/auth.js";
import postRouter from "./routes/posts.js";
import connectDB from "./db/index.js";

const app = express();
const PORT = process.env.PORT || 3333;

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Сервер работает!");
});

app.use("/auth", authRouter);
app.use("/posts", postRouter);

async function startServer() {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`Сервер запущен: http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Ошибка запуска сервера:", error);
  }
}

startServer();
