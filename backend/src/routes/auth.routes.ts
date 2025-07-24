import express from "express";
import { login, logout, signUp } from "../controllers/auth.controller";

const router = express.Router();

// Sign up
router.get("/signup", signUp);

// Login
router.get("/login", login);

// Logout
router.get("/logout", logout);

export default router;
