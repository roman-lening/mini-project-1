import express from "express";
import mongoose from "mongoose";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", authMiddleware, async (req, res) => {
  try {
    const postsCollection = mongoose.connection.collection("posts");
    const post = req.body ?? {};
    if (typeof post !== "object" || Array.isArray(post) || Object.keys(post).length === 0) {
      return res.status(400).json({ message: "Post data is required" });
    }
    const result = await postsCollection.insertOne({
      ...post,
      createdAt: new Date(),
    });
    res.status(201).json({
      message: "Post successfully created",
      postId: result.insertedId,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.get("/", async (req, res) => {
  try {
    const postsCollection = mongoose.connection.collection("posts");
    const posts = await postsCollection.find().toArray();
    res.status(200).json(posts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
