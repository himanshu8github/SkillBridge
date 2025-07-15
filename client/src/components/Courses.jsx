import React, { useEffect, useState, useRef, useLayoutEffect } from "react";
import gsap from "gsap";
import { Link, useNavigate } from "react-router-dom";
import { FaFacebook, FaInstagram, FaLinkedin } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { DiGithubBadge } from "react-icons/di";
import axios from "axios";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { BACKEND_URL } from "../utils/utils";
import toast from "react-hot-toast";

const Home = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [searchItem, setSearchItem] = useState("");
  const navigate = useNavigate();

  // Check login status from localStorage
  useEffect(() => {
    const userString = localStorage.getItem("user");
    if (userString) {
      try {
        const user = JSON.parse(userString);
        setIsLoggedIn(!!user.token);
      } catch {
        setIsLoggedIn(false);
      }
    }
  }, []);

  // Logout handler
  const handleLogout = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/user/logout`, {
        withCredentials: true,
      });
      toast.success(response.data.message);
      localStorage.removeItem("user");
      setIsLoggedIn(false);
    } catch (error) {
      toast.error("Error in logging out");
    }
  };

  // Fetch courses on mount
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get(`${BACKEND_URL}/course/courses`, {
          withCredentials: true,
        });
        setCourses(response.data.courses);
      } catch {
        console.log("Error in fetching courses");
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  // Filter courses based on search
  const filteredCourses = courses.filter((course) =>
    course.title.toLowerCase().includes(searchItem.toLowerCase()) ||
    course.description?.toLowerCase().includes(searchItem.toLowerCase())
  );

  // Slider settings
  const settings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    autoplay: true,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 2, slidesToScroll: 1 } },
      { breakpoint: 768, settings: { slidesToShow: 1, slidesToScroll: 1 } },
    ],
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-black to-blue-950 text-white">
      <div className="container mx-auto px-4">
        {/* Header */}
        <header className="flex flex-wrap items-center justify-between py-4">
          <div className="flex items-center space-x-2">
            <img src="/logo.webp" alt="SkillBridge Logo" className="h-10 w-10 rounded-full" />
            <h1 className="text-2xl text-orange-500 font-bold">SkillBridge</h1>
          </div>
          <div className="mt-2 md:mt-0 space-x-2">
            {isLoggedIn ? (
              <button
                onClick={handleLogout}
                className="bg-orange-600 px-4 py-2 text-white rounded hover:bg-orange-700"
              >
                Logout
              </button>
            ) : (
              <>
                <Link to="/login" className="bg-transparent border border-gray-500 px-4 py-2 text-white rounded hover:bg-gray-500">Login</Link>
                <Link to="/signup" className="bg-orange-500 border border-gray-500 px-4 py-2 text-white rounded hover:bg-orange-700">Signup</Link>
              </>
            )}
          </div>
        </header>

        {/* Hero Section */}
        <section className="text-center py-8">
          <h2 className="text-3xl font-bold text-orange-500">SkillBridge</h2>
          <p className="text-gray-300 mt-2">Sharpen your skills with courses crafted by industry experts.</p>
          <Link to="/courses" className="mt-4 inline-block bg-green-500 px-6 py-2 text-white rounded hover:bg-green-600">
            Explore Courses
          </Link>
        </section>

        {/* Search Bar */}
        <div className="my-6 flex justify-center">
          <input
            type="text"
            placeholder="Search courses..."
            value={searchItem}
            onChange={(e) => setSearchItem(e.target.value)}
            className="w-full max-w-xl px-4 py-2 text-black rounded-md border border-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>

        {/* Course Slider */}
        <div className="mb-10 p-3">
          {loading ? (
            <div className="flex justify-center items-center h-40">
              <div className="w-12 h-12 border-4 border-orange-500 border-dashed rounded-full animate-spin"></div>
            </div>
          ) : (
            <Slider {...settings}>
              {filteredCourses.map((course) => (
                <div key={course._id} className="p-4">
                  <div className="bg-gray-900 rounded-lg overflow-hidden shadow-md">
                    <img
                      src={course.image?.url || "https://via.placeholder.com/300x200?text=No+Image"}
                      alt={course.title}
                      className="h-48 w-full object-cover"
                    />
                    <div className="p-4 text-center">
                      <h3 className="text-lg font-semibold text-white">{course.title}</h3>
                      <button
                        onClick={() => {
                          isLoggedIn ? navigate(`/buy/${course._id}`) : navigate("/login");
                          if (!isLoggedIn) toast.error("Please login to enroll in a course.");
                        }}
                        className="mt-4 bg-orange-500 px-4 py-2 text-white rounded hover:bg-blue-600"
                      >
                        Enroll Now
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </Slider>
          )}
        </div>

        <hr className="border-gray-600" />

        {/* Footer */}
        <footer className="py-8 text-sm">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Branding and social */}
            <div className="flex flex-col items-center md:items-start">
              <div className="flex items-center space-x-2">
                <img src="/logo.webp" alt="SkillBridge Logo" className="h-10 w-10 rounded-full" />
                <h1 className="text-2xl text-orange-500 font-bold">SkillBridge</h1>
              </div>
              <p className="mt-4">Follow Us</p>
              <div className="flex space-x-4 mt-2">
                <a href=""><FaFacebook className="text-xl hover:text-blue-500" /></a>
                <a href=""><FaInstagram className="text-xl hover:text-pink-500" /></a>
                <a href=""><FaXTwitter className="text-xl hover:text-gray-300" /></a>
              </div>
            </div>

            {/* Personal links */}
            <div className="flex flex-col items-center">
              <h3 className="font-semibold">Connect with Me</h3>
              <ul className="mt-4 text-gray-400 space-y-2">
                <li>
                  <a href="https://github.com/himanshu8github" className="hover:text-white flex items-center gap-1">
                    <DiGithubBadge /> himanshu8github
                  </a>
                </li>
                <li>
                  <a href="https://www.linkedin.com/in/himanshu-choudhary-1a19ba255/" className="hover:text-white flex items-center gap-1">
                    <FaLinkedin /> himanshu-choudhary
                  </a>
                </li>
              </ul>
            </div>

            {/* Legal */}
            <div className="flex flex-col items-center">
              <h3 className="font-semibold">© 2025 SkillBridge</h3>
              <ul className="mt-4 text-gray-400 space-y-2">
                <li className="hover:text-white cursor-pointer">Terms & Conditions</li>
                <li className="hover:text-white cursor-pointer">Privacy Policy</li>
                <li className="hover:text-white cursor-pointer">Refund & Cancellation</li>
              </ul>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Home;
