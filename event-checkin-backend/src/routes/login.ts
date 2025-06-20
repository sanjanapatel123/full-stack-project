import express from "express";
import { generateToken } from "../auth";

const router = express.Router();

router.post("/login", (req, res) => {
  const { email, name } = req.body;

  if (!email || !name) {
    return res.status(400).json({ error: "Email and name are required" });
  }

  const user = {
    id: email.split("@")[0], // Simple ID (or use uuid later)
    name,
    email,
  };

  const token = generateToken(user);

  return res.json({ token });
});

export default router;
