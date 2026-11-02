import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const router = express.Router();

router.post("/register", async (req, res) => {
  try {
    const { username, password } = req.body ?? {};
    if (!username || !password) {
      return res.status(400).json({
        message: "Username and password are required",
      });
    }
    if (typeof username !== "string" || typeof password !== "string") {
      return res.status(400).json({
        message: "Username and password must be strings",
      });
    }
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(409).json({
        message: "User already exists",
      });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      username,
      password: hashedPassword,
    });
    await newUser.save();
    res.status(201).json({
      message: "User successfully registered",
      userId: newUser._id,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body ?? {};
    if (!username || !password) {
      return res.status(400).json({
        message: "Username and password are required",
      });
    }
    if (typeof username !== "string" || typeof password !== "string") {
      return res.status(400).json({
        message: "Username and password must be strings",
      });
    }
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({
        message: "Invalid username or password",
      });
    }
    const isPasswordValid = await bcrypt.compare(
      password,
      user.password,
    );
    if (!isPasswordValid) {
      return res.status(401).json({
        message: "Invalid username or password",
      });
    }
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
    );
    res.status(200).json({
      message: "Login successful",
      userId: user._id,
      token,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
});

export default router;
