import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import courseRoute from "./routes/course.route.js";
import userRoute from "./routes/user.route.js";
import adminRoute from "./routes/admin.route.js";
import PaymentRoute from "./routes/payment.route.js";
import fileUpload from 'express-fileupload';
import { v2 as cloudinary } from 'cloudinary';
import cookieParser from 'cookie-parser';
import cors from 'cors';


const app = express();
dotenv.config();

