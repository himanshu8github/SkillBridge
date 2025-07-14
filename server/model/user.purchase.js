import mongoose from "mongoose";

const purchaseSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Types.ObjectId,  //References the _id of a user (from User collection)
    ref: "User",  //Tells Mongoose to link this field to the User model
  },
  courseId: {
    type: mongoose.Types.ObjectId,
    ref: "Course",
  },
});

export const Purchase = mongoose.model("Purchase", purchaseSchema);