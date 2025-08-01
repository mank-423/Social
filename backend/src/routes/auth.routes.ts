import express from "express";
import { checkAuth, login, logout, signUp, updateProfile } from "../controllers/auth.controller";
import { protectRoute } from "../middleware/auth.middleware";

const router = express.Router();

// Sign up
router.post("/signup", signUp);

// Login
router.post("/login", login);

// Logout
router.post("/logout", logout);

// update profile
router.post("/update-profile", protectRoute ,updateProfile);

// Check authenticated
router.get("/check", protectRoute, checkAuth);

export default router;
