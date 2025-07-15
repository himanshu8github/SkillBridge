import axios from "axios";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { BACKEND_URL } from "../utils/utils";


const CourseCreate=()=> {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState("");
  const [imagePreview, setImagePreview] = useState("");

  const navigate = useNavigate();

  const changePhotoHandler = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      setImagePreview(reader.result);
      setImage(file);
    };
  };

  const handleCreateCourse = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("price", price);
    formData.append("image", image);

    const admin = JSON.parse(localStorage.getItem("admin"));
    const token = admin.token;
    if (!token) {
      navigate("/admin/login");
      return;
    }

    try {
      const response = await axios.post(
        `${BACKEND_URL}/course/create`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );
      console.log(response.data);
      toast.success(response.data.message || "Course created successfully");
      navigate("/admin/our-courses");
      setTitle("");
      setPrice("");
      setImage("");
      setDescription("");
      setImagePreview("");
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.errors);
    }
  };

  return (
   <div className="min-h-screen bg-gradient-to-r from-black to-blue-950 py-10 px-4">
  <div className="max-w-3xl mx-auto bg-gray-900 p-6 sm:p-10 border rounded-2xl shadow-xl">
    <h3 className="text-2xl sm:text-3xl font-bold text-center text-white mb-8">
      Create Course
    </h3>

    <form onSubmit={handleCreateCourse} className="space-y-6">
      {/* Title */}
      <div>
        <label className="block text-white text-base sm:text-lg font-medium mb-2">
          Title
        </label>
        <input
          type="text"
          placeholder="Enter your course title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 outline-none"
        />
      </div>

      {/* Description */}
      <div>
        <label className="block text-white text-base sm:text-lg font-medium mb-2">
          Description
        </label>
        <textarea
          placeholder="Enter your course description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 outline-none resize-none"
          rows={4}
        />
      </div>

      {/* Price */}
      <div>
        <label className="block text-white text-base sm:text-lg font-medium mb-2">
          Price ($)
        </label>
        <input
          type="number"
          placeholder="Enter your course price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 outline-none"
        />
      </div>

      {/* Course Image Preview */}
      <div>
        <label className="block text-white text-base sm:text-lg font-medium mb-2">
          Course Image
        </label>
        <div className="text-white w-full flex justify-center mb-4">
          <img
            src={imagePreview ? imagePreview : "/imgPL.webp"}
            alt="Course"
            className="max-h-64 w-full sm:w-2/3 rounded-lg object-cover"
          />
        </div>
        <input
          type="file"
          onChange={changePhotoHandler}
          accept="image/jpeg,image/jpg,image/png"
          className="w-full px-4 py-2 border bg-white border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 outline-none"
        />
        <p className="text-sm text-red-500 mt-1">
              Supported formats: JPEG, JPG, PNG (Max: 5MB)
        </p>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        className="w-full py-3 px-6 bg-blue-600 hover:bg-blue-700 text-white text-lg rounded-md font-semibold transition duration-300"
      >
        Create Course
      </button>
    </form>
  </div>
</div>

  );
}

export default CourseCreate;