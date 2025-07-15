import axios from "axios";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaDiscourse, FaDownload } from "react-icons/fa";
import { IoLogIn, IoLogOut } from "react-icons/io5";
import { RiHome2Fill } from "react-icons/ri";
import { HiMenu, HiX } from "react-icons/hi"; 
import { Link, useNavigate } from "react-router-dom";
import { BACKEND_URL } from "../utils/utils";
import { motion } from "framer-motion";


const Purchases=()=> {
  const [purchases, setPurchase] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); 

  const [token, setToken] = useState(null);
const navigate = useNavigate();

useEffect(() => {
  const storedUser = JSON.parse(localStorage.getItem("user"));
  const savedToken = storedUser?.token;

  if (!savedToken) {
    console.log("No token found, redirecting...");
    navigate("/login");
    return;
  }

  console.log("Token found:", savedToken);
  setToken(savedToken);
  setIsLoggedIn(true);

  // Fetch purchases after setting token
  const fetchPurchases = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/user/purchases`, {
        headers: {
          Authorization: `Bearer ${savedToken}`,
        },
        withCredentials: true,
      });
      console.log("Purchase data:", response.data.courseData);
      setPurchase(response.data.courseData);
      setErrorMessage(""); // Clear error message if success
    } catch (error) {
      console.error("Error fetching purchases:", error);
      setErrorMessage("Failed to fetch purchased data");
    }
  };

  fetchPurchases();
}, [navigate]);


  // Logout
  const handleLogout = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/user/logout`, {
        withCredentials: true,
      });
      toast.success(response.data.message);
      localStorage.removeItem("user");
      navigate("/login");
      setIsLoggedIn(false);
    } catch (error) {
      console.log("Error in logging out ", error);
      toast.error(error.response.data.errors || "Error in logging out");
    }
  };

  // Toggle sidebar visibility
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-r from-black to-blue-950 text-white">
  {/* Sidebar */}
  <div
    className={`fixed inset-y-0 left-0 transform ${
      isSidebarOpen ? "translate-x-0" : "-translate-x-full"
    } md:translate-x-0 transition-transform duration-300 ease-in-out w-64 z-50 bg-gradient-to-r from-black to-blue-950 border-r border-white`}
  >
    {/* Close Icon (mobile only) */}
    <div className="md:hidden flex justify-end p-4">
      <button onClick={toggleSidebar}>
        <HiX className="text-white text-2xl" />
      </button>
    </div>
    <nav className="mt-8 px-5">
      <ul>
        <li className="mb-4 hover:text-red-500">
          <Link to="/" className="flex items-center">
            <RiHome2Fill className="mr-2" /> Home
          </Link>
        </li>
        <li className="mb-4 hover:text-red-500">
          <Link to="/courses" className="flex items-center">
            <FaDiscourse className="mr-2" /> Courses
          </Link>
        </li>
        <li className="mb-4 text-blue-400">
          <a href="#" className="flex items-center">
            <FaDownload className="mr-2" /> Purchases
          </a>
        </li>
        
        <li>
          {isLoggedIn ? (
            <button onClick={handleLogout} className="flex items-center hover:text-red-500">
              <IoLogOut className="mr-2" /> Logout
            </button>
          ) : (
            <Link to="/login" className="flex items-center">
              <IoLogIn className="mr-2" /> Login
            </Link>
          )}
        </li>
      </ul>
    </nav>
  </div>


  {!isSidebarOpen && (
  <button
    className="fixed top-4 left-4 z-50 md:hidden"
    onClick={toggleSidebar}
  >
    <HiMenu className="text-white text-2xl" />
  </button>
)}

  {/* Main Content */}
  <div
    className={`flex-1 p-8 transition-all duration-300 ${
      isSidebarOpen ? "ml-64" : "ml-0"
    } md:ml-64`}
  >
    <h2 className="text-orange-500 text-2xl font-semibold mt-6 mb-6">My Purchases</h2>

    {errorMessage && (
      <div className="text-red-400 text-center mb-4">{errorMessage}</div>
    )}

    {purchases.length > 0 ? (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {purchases.map((purchase, index) => (
          <div
            key={index}
            className="bg-gray-800 text-black rounded-xl shadow-lg p-6 hover:scale-105 transform transition-all duration-300"
          >
            <img
              className="rounded-md w-full h-48 object-cover"
              src={purchase.image?.url || "https://via.placeholder.com/200"}
              alt={purchase.title}
            />
            <div className="mt-4">
              <h3 className="text-lg font-bold text-orange-500">{purchase.title}</h3>
              <p className="text-gray-400 text-sm">
                {purchase.description.length > 100
                  ? `${purchase.description.slice(0, 100)}...`
                  : purchase.description}
              </p>
              <span className="text-green-600 font-semibold text-sm block mt-2">
                ${purchase.price} only
              </span>
            </div>
          </div>
        ))}
      </div>
    ) : (
      <p className="text-gray-300">You have no purchases yet.</p>
    )}
  </div>
</div>
  );
}

export default Purchases;