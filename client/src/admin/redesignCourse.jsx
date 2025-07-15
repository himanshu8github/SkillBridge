import axios from "axios";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import { BACKEND_URL } from "../utils/utils";

function UpdateCourse() {
  const { id } = useParams();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState("");
  const [imagePreview, setImagePreview] = useState("");
  const [loading, setLoading] = useState(true);
  const [newImageSelected, setNewImageSelected] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        const { data } = await axios.get(`${BACKEND_URL}/course/${id}`, {
          withCredentials: true,
        });
        setTitle(data.course.title);
        setDescription(data.course.description);
        setPrice(data.course.price);
        setImage(data.course.image?.url || "");
        setImagePreview(data.course.image?.url || "");
        setLoading(false);
      } catch (error) {
        console.log(error);
        toast.error("Failed to fetch course data");
        setLoading(false);
      }
    };
    fetchCourseData();
  }, [id]);

  const changePhotoHandler = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      setImagePreview(reader.result);
      setImage(file);
      setNewImageSelected(true);
    };
  };

  const handleUpdateCourse = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("price", Number(price)); // Make sure price is numeric

    // Append image only if it's a new file
    if (image && typeof image !== "string") {
      formData.append("image", image);
    } 

    const admin = JSON.parse(localStorage.getItem("admin"));
    const token = admin?.token;

    if (!token) {
      toast.error("Please login to admin");
      return;
    }

    try {
      const response = await axios.put(
        `${BACKEND_URL}/course/update/${id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );
      toast.success(response.data.message || "Course updated successfully");
      navigate("/admin/our-courses");
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.errors || "Update failed");
    }
  };

  if (loading) {
    return <p className="text-center text-gray-500">Loading...</p>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-black to-blue-950 py-10 px-4">
      <div className="max-w-3xl mx-auto bg-gray-900 p-6 sm:p-10 border rounded-2xl shadow-xl">
        <h3 className="text-2xl sm:text-3xl font-bold text-center text-white mb-8">
          Update Course
        </h3>

        <form onSubmit={handleUpdateCourse} className="space-y-6">
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
              required
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
              required
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
              min="0"
              step="0.01"
              required
            />
          </div>

          {/* Image Preview */}
          <div>
            <label className="block text-white text-base sm:text-lg font-medium mb-2">
              Course Image
            </label>
            <div className="text-white w-full flex justify-center mb-4">
              <img
                src={imagePreview || "/imgPL.webp"}
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
              Leave empty to keep current image. Supported formats: JPEG, JPG, PNG (Max: 5MB)
            </p>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-3 px-6 bg-blue-600 hover:bg-blue-700 text-white text-lg rounded-md font-semibold transition duration-300"
          >
            Update Course
          </button>
        </form>
      </div>
    </div>
  );
}

export default UpdateCourse;