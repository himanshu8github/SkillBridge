import express from "express";
import { orderData } from "../controllers/payment.controller.js";
import userMiddleware from "../middlewares/user.middleware.js";

const router = express.Router();

router.post("/", userMiddleware, orderData);

export default router;