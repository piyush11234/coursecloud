import { GraduationCap, LogOut, Menu, Settings, User, X } from "lucide-react";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { logout } from "@/redux/authSlice";
import { toast } from "sonner";
import userLogo from "../assets/user.jpg";
import logo from "../assets/logo.png";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "./ui/dropdown-menu";

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((store) => store.auth);
  const [menuOpen, setMenuOpen] = useState(false);

  const logoutHandler = async () => {
    try {
      const res = await axios.post(
        "http://localhost:3000/api/v1/user/logout",
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
          withCredentials: true,
        }
      );

      dispatch(logout());
      localStorage.removeItem("accessToken");
      navigate("/");
      toast.success(res.data.message);
    } catch (err) {
      console.error("Logout failed:", err.response?.data || err.message);
      toast.error(err.response?.data?.message || "Logout failed");
    }
  };

  return (
    <nav className="bg-gray-900 text-gray-100 fixed top-0 w-full z-50 shadow-md">
      <div className="flex items-center justify-between px-4 md:px-8 py-3">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <img
            src={logo}
            alt="e-Learning"
            className="w-10 h-10 object-cover rounded-full"
          />
          <h1 className="text-2xl md:text-3xl font-bold">CourseCloud</h1>
        </Link>

        {/* Desktop Menu */}
        <ul className="hidden md:flex items-center gap-6 text-lg">
          <li>
            <Link to="/" className="hover:text-blue-400 transition">
              Home
            </Link>
          </li>
          <li>
            <Link to="/courses" className="hover:text-blue-400 transition">
              Courses
            </Link>
          </li>

          {!user ? (
            <>
              <Link to="/login">
                <Button className="bg-blue-600 hover:bg-blue-700 cursor-pointer">Login</Button>
              </Link>
              <Link to="/signup">
                <Button variant="secondary" className="bg-gray-600 hover:bg-gray-700 text-white cursor-pointer">
                  Sign Up
                </Button>
              </Link>
            </>
          ) : (
            <>
              {user.role === "instructor" && (
                <Link to="/admin/dashboard">
                  <li className="cursor-pointer hover:text-blue-400 transition">
                    Admin
                  </li>
                </Link>
              )}

              <div className="relative group">


                <DropdownMenu>
                  {/* Avatar trigger */}
                  <DropdownMenuTrigger asChild>
                    <Avatar className="cursor-pointer hover:scale-105 transition-transform">
                      <AvatarImage src={user?.photoUrl || userLogo} alt="User" />
                      <AvatarFallback>
                        {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
                      </AvatarFallback>
                    </Avatar>
                  </DropdownMenuTrigger>

                  {/* Dropdown Content */}
                  <DropdownMenuContent
                    align="end"
                    className="w-48 shadow-lg border rounded-md"
                  >
                    <DropdownMenuLabel className="text-sm font-medium px-3 py-2">
                      {user?.name || "My Account"}
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />

                    {/* Profile */}
                    <DropdownMenuItem asChild>
                      <Link
                        to="/profile"
                        className="flex items-center gap-2 px-3 py-2 w-full hover:bg-gray-100 rounded-md"
                      >
                        <User className="w-4 h-4" />
                        Profile
                      </Link>
                    </DropdownMenuItem>

                    {/* Settings (optional) */}
                    <DropdownMenuItem asChild>
                      <Link
                        to="/setting"
                        className="flex items-center gap-2 px-3 py-2 w-full hover:bg-gray-100 rounded-md"
                      >
                        <Settings className="w-4 h-4" />
                        Settings
                      </Link>
                    </DropdownMenuItem>

                    {/* Logout */}
                    <DropdownMenuItem asChild>
                      <button
                        onClick={logoutHandler}
                        className="flex items-center gap-2 px-3 py-2 w-full text-red-500 hover:bg-red-50 rounded-md"
                      >
                        <LogOut className="w-4 h-4" />
                        Logout
                      </button>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>


                {/* Dropdown on hover */}
                {/* <div className="absolute right-0 mt-2 w-40 bg-white text-gray-800 rounded-lg shadow-lg hidden group-hover:block">
                  <Link to="/profile" className="flex text-left px-4 py-2 hover:bg-gray-100">
                    <User />Profile </Link>
                  <button onClick={logoutHandler}
                    className=" flex cursor-pointer w-full text-left px-4 py-2 hover:bg-gray-100 text-red-500">
                    <LogOut /> Logout
                  </button>
                </div> */}
              </div>
            </>
          )}
        </ul>

        {/* Mobile Hamburger */}
        <button
          className="md:hidden text-gray-100"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-gray-800 text-gray-100 px-6 py-4 space-y-4">
          <Link
            to="/"
            className="block hover:text-blue-400 transition"
            onClick={() => setMenuOpen(false)}
          >
            Home
          </Link>
          <Link
            to="/courses"
            className="block hover:text-blue-400 transition"
            onClick={() => setMenuOpen(false)}
          >
            Courses
          </Link>

          {!user ? (
            <>
              <Link to="/login">
                <Button className="w-full bg-blue-600 hover:bg-blue-700">
                  Login
                </Button>
              </Link>
              <Link to="/signup">
                <Button className="w-full bg-gray-600 hover:bg-gray-700 mt-2">
                  Sign Up
                </Button>
              </Link>
            </>
          ) : (
            <>
              {user.role === "instructor" && (
                <Link
                  to="/admin/dashboard"
                  className="block hover:text-blue-400 transition"
                  onClick={() => setMenuOpen(false)}
                >
                  Admin
                </Link>
              )}
              <Link
                to="/profile"
                className="block hover:text-blue-400 transition"
                onClick={() => setMenuOpen(false)}
              >
                Profile
              </Link>
              <Button
                onClick={() => {
                  logoutHandler();
                  setMenuOpen(false);
                }}
                className="w-full bg-red-500 hover:bg-red-600 mt-2" >
                <LogOut />Logout
              </Button>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
