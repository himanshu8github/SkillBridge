import express from "express";
import { signup, login, logout } from "../controller/user.controller.js";
import userMiddleware from "../middleware/user.middleware.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.get("/logout", logout);


export default router;