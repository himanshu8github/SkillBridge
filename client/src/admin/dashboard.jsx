import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../../public/logo.webp";
import toast from "react-hot-toast";
import axios from "axios";
import { BACKEND_URL } from "../utils/utils";
import { HiMenu, HiX, HiHome, HiBookOpen, HiPlus, HiLogout } from "react-icons/hi";

const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [adminFirstName, setAdminFirstName] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const adminData = JSON.parse(localStorage.getItem("admin"));
    if (adminData?.admin?.firstName) {
      setAdminFirstName(adminData.admin.firstName);
    } else {
      setAdminFirstName("Admin");
    }
  }, []);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  const handleLogout = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/admin/logout`, {
        withCredentials: true,
      });
      toast.success(response.data.message);
      localStorage.removeItem("admin");
      navigate("/admin/login");
    } catch (error) {
      console.log("Error in logging out", error);
      toast.error(error.response?.data?.errors || "Error in logging out");
    }
  };

  return (
    <div className="flex h-screen bg-gradient-to-r from-black to-blue-950 text-white">
      {/* Sidebar */}
      <div
        className={`fixed z-50 inset-y-0 left-0 w-64 bg-gradient-to-b from-black to-blue-950 border-r p-5 transition-transform duration-300 ease-in-out transform ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 md:static md:block shadow-xl`}
      >
        <div className="flex flex-col items-center mb-10">
          {/* <img src={logo} alt="Admin" className="rounded-full h-20 w-20 shadow-md" /> */}
          <h2 className="text-lg font-semibold mt-4 text-center">
            {adminFirstName}
          </h2>
        </div>
        <nav className="flex flex-col space-y-4">
          <Link to="/admin/our-courses">
            <button className="w-full flex items-center gap-2 bg-green-600 hover:bg-green-500 py-2 px-4 rounded transition shadow">
              <HiBookOpen /> Our Courses
            </button>
          </Link>
          <Link to="/admin/create-course">
            <button className="w-full flex items-center gap-2 bg-orange-500 hover:bg-orange-400 py-2 px-4 rounded transition shadow">
              <HiPlus /> Create Course
            </button>
          </Link>
          <Link to="/">
            <button className="w-full flex items-center gap-2 bg-red-500 hover:bg-red-400 py-2 px-4 rounded transition shadow">
              <HiHome /> Home
            </button>
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 bg-yellow-500 hover:bg-yellow-400 py-2 px-4 rounded transition shadow"
          >
            <HiLogout /> Logout
          </button>
        </nav>

        {/* Close icon for mobile */}
        <button
          className="absolute top-4 right-4 md:hidden text-white"
          onClick={toggleSidebar}
        >
          <HiX className="text-2xl" />
        </button>
      </div>

      {/* Toggle Hamburger */}
      {!sidebarOpen && (
        <button
          className="fixed top-4 left-4 z-40 md:hidden text-white"
          onClick={toggleSidebar}
        >
          <HiMenu className="text-2xl" />
        </button>
      )}

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center p-8 bg-gray-950 focus:outline-none focus:ring-0 select-none">
        <div className="text-center max-w-xl px-6 py-8 bg-gray-900 rounded-3xl shadow-lg focus:outline-none focus:ring-0 select-none">
          <h1 className="text-3xl md:text-4xl font-bold text-cyan-300 mb-4 focus:outline-none focus:ring-0 select-none">
            Welcome {adminFirstName}
          </h1>
          <p className="text-gray-400 text-lg focus:outline-none focus:ring-0 select-none">
            Manage your courses, create new ones, and monitor your platform's activity right from here.
          </p>
        </div>
      </main>
      </div>
  );
};

export default Dashboard;