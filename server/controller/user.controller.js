import { User } from "../models/user.model.js";
import  bcrypt  from "bcryptjs";
import jwt from "jsonwebtoken";
import { z } from "zod";
import config from "../config.js";
import { Purchase } from "../models/user.purchase.js";
import { Course } from "../models/course.model.js";


export const signup = async (req,res)=>{
  const {firstName,lastName,email,password} = req.body;

  const userSchema = z.object({
    firstName: z.string().min(3, { message: "First name must be atleast 3 character long. " }),
    lastName: z.string().min(3, { message: "Last name must be atleast 3 character long. " }),
    email: z.string().email(),
    password: z.string().min(6, { message: "Password must be atleast 6 character long. " }),
  });

  const validatedData = userSchema.safeParse(req.body);  //this will return an array so we used map to map it to specific error
  if (!validatedData.success) {
    return res.status(400).json({ errors: validatedData.error.issues.map((err) => err.message) });
  }

  const hashedPassword = await bcrypt.hash(password,10)
  
  try {
    const existingUser = await User.findOne({email:email});
    if(existingUser){
      return res.status(400).json({errors:"User already exists"});
    }
    const newUser = new User({firstName, lastName, email, password:hashedPassword});
    await newUser.save();
    res.status(201).json({message:"Signup successful"}, newUser)
    
  } catch (error) {
    res.status(500).json({errors: "Error in signup"});
    console.log("Error in signup", error)
  }
};

export const login = async (req,res)=>{
  const {email, password} = req.body;
  try {
    const user = await User.findOne({email:email})
    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if(!user || !isPasswordCorrect){
      return res.status(403).json({errors:"Invalid credentials"});
    } 

    //jwt code
    const token = jwt.sign({id: user._id,  email: user.email, firstName: user.firstName}, config.JWT_USER_PASSWORD, {expiresIn:"1d"}) //created token

    const cookieOptions={
      expires: new Date(Date.now() + 24*60*60*1000), //1day
      httpOnly: true, // cookie cant be accessed by js directly
      secure: process.env.NODE_ENV === "production", //true for https only
      sameSite:"Strict" // will save us from CSRF Attacks
    }

    res.cookie("jwt",token, cookieOptions) //created cookie named "jwt" in which we put the value of created token


    res.status(201).json({message: "Login successfull", user, token});
  } catch (error) {
    res.status(500).json({errors:"Error in login"})
    console.log("Error in login", error);
  }
};

export const logout = (req, res) => {
  try {
   
    res.clearCookie("jwt");
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    res.status(500).json({ errors: "Error in logout" });
    console.log("Error in logout", error);
  }
};

export const purchases = async (req, res)=>{
  const userId = req.userId;
  
  try {
    const purchased = await Purchase.find({userId});

    let purchasedCourseId = [];

    for (let i=0; i<purchased.length; i++){
      purchasedCourseId.push(purchased[i].courseId);

    }
    
    const courseData = await Course.find({
      _id: {$in:purchasedCourseId}
    });

    res.status(200).json({purchased, courseData});
  } catch (error) {
    res.status(500).json({errors: "Error in puchases"});
    console.log("Error in purchase", error);
  }
};