import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import courseRoute from "./routes/course.route.js";
import userRoute from "./routes/user.route.js";
import adminRoute from "./routes/admin.route.js";
import orderRoute from "./routes/payment.route.js";
import fileUpload from 'express-fileupload';
import { v2 as cloudinary } from 'cloudinary';
import cookieParser from 'cookie-parser';
import cors from 'cors';


const app = express();
dotenv.config();

const allowedOrigins = [
  "https://course-selling-app-nine-beta.vercel.app",
  "http://localhost:5173"
];

//middleware
app.use(express.json()); //parsing data into json

app.use(fileUpload({
    useTempFiles: true,
    tempFileDir: '/tmp/'
}));


app.use(cookieParser());

app.use(cors({
    origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
    credentials: true,  //so we can handle cookies, CORS, authorization
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
}))

//end of middleware
const port = process.env.PORT || 3000;
const DB_URI = process.env.MONGO_URI;


const connectDB = async () => {
    try {
      await mongoose.connect(DB_URI);
      
      console.log("Connected to MongoDB");
    } catch (error) {
      console.error("MongoDB connection error:", error);
    }
  };
  
  connectDB();


//defining routes
app.use("/api/v1/course", courseRoute);
app.use("/api/v1/user", userRoute);
app.use("/api/v1/admin", adminRoute);
app.use("/api/v1/order", orderRoute);


// Cloudinary Configuration
cloudinary.config({ 
    cloud_name: process.env.cloud_name, 
    api_key: process.env.api_key, 
    api_secret: process.env.api_secret 
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });