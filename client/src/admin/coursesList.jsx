import axios from "axios";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { BACKEND_URL } from "../utils/utils";

function OurCourses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const admin = JSON.parse(localStorage.getItem("admin"));
  const token = admin.token;

   useEffect(() => {
    if (!token) {
      navigate("/admin/login");
    } 
  }, [token, navigate]);

  // fetch courses
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get(`${BACKEND_URL}/course/courses`, {
          withCredentials: true,
        });
        console.log(response.data.courses);
        setCourses(response.data.courses);
        setLoading(false);
      } catch (error) {
        console.log("error in fetchCourses ", error);
      }
    };
    fetchCourses();
  }, []);

  // delete courses code
  const handleDelete = async (id) => {
    try {
      const response = await axios.delete(
        `${BACKEND_URL}/course/delete/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );
      toast.success(response.data.message);
      const updatedCourses = courses.filter((course) => course._id !== id);
      setCourses(updatedCourses);
    } catch (error) {
      console.log("Error in deleting course ", error);
      toast.error(error.response.data.errors || "Error in deleting course");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-black to-blue-950">
        <p className="text-white text-xl">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-4 py-8 bg-gradient-to-r from-black to-blue-950">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-center text-white mb-8">Our Courses</h1>

        <div className="flex justify-center mb-6">
          <Link
            to="/admin/dashboard"
            className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg transition duration-300"
          >
            Go to Dashboard
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {courses.map((course) => (
            <div
              key={course._id}
              className="bg-gray-800 p-4 rounded-lg shadow-md hover:scale-105 transform transition-all duration-300"
            >
              {/* Course Image */}
              <img
                src={course?.image?.url}
                alt={course.title}
                className="h-48 w-full object-cover rounded-xl"
              />

              {/* Title */}
              <h2 className="font-bold text-lg mb-2 text-orange-500 mt-4">{course.title}</h2>

              {/* Description */}
              <p className="text-gray-400 mb-4">
                {course.description.length > 150
                  ? `${course.description.slice(0, 150)}...`
                  : course.description}
              </p>

              {/* Price Section */}
              <div className="flex justify-between items-center mt-4">
                <div className="text-green-500 font-bold">
                  ${course.price}{" "}
                  
                </div>
                
              </div>

              {/* Action Buttons */}
              <div className="flex justify-between mt-6">
                <Link
                  to={`/admin/update-course/${course._id}`}
                  className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600 transition"
                >
                  Update
                </Link>
                <button
                  onClick={() => handleDelete(course._id)}
                  className="bg-red-700 text-white px-4 py-2 rounded hover:bg-red-800 transition"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* No Courses Message */}
        {courses.length === 0 && (
          <p className="text-center text-white mt-10">No courses available.</p>
        )}
      </div>
    </div>
  );
}

export default OurCourses;