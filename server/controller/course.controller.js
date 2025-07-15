import { Course } from "../models/course.model.js";
import { v2 as cloudinary } from 'cloudinary';
import { Purchase } from "../models/user.purchase.js";
import Stripe from "stripe";
import config from "../config.js";


export const createCourse = async (req,res)=>{
    const adminId = req.adminId;
    const {title,description,price} = req.body;

    try {
        if(!title || !description || !price){
            return res.status(400).json({errors: "All fields are required"})

        }
        const {image} = req.files
        if(!req.files || Object.keys(req.files).length===0){
            return res.status(400).json({errors:"No file uploaded"});
        } 

        const allowedFormat = ['image/png', 'image/jpeg']
        if(!allowedFormat.includes(image.mimetype)){
            return res.status(400).json({errors:"Invalid File Format. Only PNG and JPG are allowed"});

        }

        //cloudinary code
        const cloudResponse = await cloudinary.uploader.upload(image.tempFilePath)
        if(!cloudResponse ||cloudResponse.error){
            return res.status(400).json({errors:"Error uploading file to cloudinary"});
        }

        const courseData = {
            title,
            description,
            price,
            image:{
                public_id: cloudResponse.public_id,
                url: cloudResponse.url
            },
            creatorId: adminId
        }

        const course = await Course.create(courseData);
        res.json({
            message: "Course created successfully",
            course
        })
        
    } catch (error) {
        console.log(error)
        res.status(500).json({error: "Error while creating course"})
    }

};

export const updateCourse = async (req, res) => {
  const adminId = req.adminId;
  const { courseId } = req.params;
  const { title, description, price } = req.body;

  try {
    const course = await Course.findOne({
      _id: courseId,
      creatorId: adminId,
    });

    if (!course) {
      return res
        .status(404)
        .json({ errors: "Course not found or not authorized" });
    }

    // If image file is uploaded
    if (req.files && req.files.image) {
      const file = req.files.image;

      const allowedFormat = ["image/png", "image/jpeg"];
      if (!allowedFormat.includes(file.mimetype)) {
        return res.status(400).json({
          errors: "Invalid file format. Only PNG and JPG are allowed",
        });
      }

      // Delete old image from Cloudinary
      if (course.image?.public_id) {
        await cloudinary.uploader.destroy(course.image.public_id);
      }

      // Upload new image to Cloudinary
      const cloud_response = await cloudinary.uploader.upload(
        file.tempFilePath
      );
      course.image = {
        public_id: cloud_response.public_id,
        url: cloud_response.url,
      };
    }

    // Update text fields
    course.title = title || course.title;
    course.description = description || course.description;
    course.price = price || course.price;

    await course.save();

    res.status(200).json({
      message: "Course updated successfully",
      course,
    });
  } catch (error) {
    console.log("Error in course updating", error);
    res.status(500).json({ errors: "Error in course updating" });
  }
};



export const deleteCourse = async(req,res)=>{
    const adminId = req.adminId;
    const {courseId} = req.params;
    try {
        const course = await Course.findOneAndDelete({
            _id:courseId,
            creatorId:adminId
        })
        if(!course){
            return res.status(404).json({errors:"Cannot delete, created by other admin"});
        }
        res.status(200).json({message:"Course deleted successfully"});
    } catch (error) {
        res.status(500).json({errors:"Error in course deleting"});  //500 Internal server error for any other unepected error and 404 course not found error
        console.log("Error in course deleting", error)
    }
};

export const getCourses = async(req,res)=>{
    try {
        const courses = await Course.find({})
        res.status(201).json({courses})
    } catch (error) {
        res.status(500).json({errors:"Error in getting courses"})
        console.log("Error while getting courses", error)
    }
};

export const courseDetails = async(req,res)=>{
    const { courseId } = req.params;
    try {
        const course = await Course.findById(courseId);
        if(!course){
            return res.status(404).json({error: "Course not found"})
        }
        res.status(200).json({ course });
    } catch (error) {
        res.status(500).json({errors:"Error while getting course details"});
        console.log("Error while fetching course details", error);
    }
};


//STRIPE

const stripe = new Stripe(config.STRIPE_SECRET_KEY)
console.log(config.STRIPE_SECRET_KEY)

export const buyCourses = async(req,res)=>{
    
    const {userId} = req;
    const {courseId} = req.params;

    try {
        const course = await Course.findById(courseId);
        if(!course){
            return res.status(404).json({errors:"Course not found"});
        }
        
        const existingPurchase = await Purchase.findOne({userId,courseId}); 
        if(existingPurchase){
            return res.status(400).json({errors:"User has already purchased this course"})
        }


        // stripe payment
        const amount = course.price
        const paymentIntent = await stripe.paymentIntents.create({
        amount: amount*100,
        currency: "usd",
        payment_method_types:["card"]
         });


        
        res.status(201).json({message:"Course purchased successfully", course, clientSecret: paymentIntent.client_secret });

    } catch (error) {
        res.status(500).json({errors: "Error in course buying"});
        console.log("Error in course buying", error);

    }
};