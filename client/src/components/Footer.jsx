import React from "react";
import { Link } from "react-router-dom";
import { Facebook, Twitter, Instagram, Linkedin } from "lucide-react";
import { useSelector } from "react-redux";
import { store } from "@/redux/store";

const Footer = () => {
  const {user}=useSelector(store=>store.auth)
  return (
    <footer className="bg-gray-900 text-gray-100 mt-10">
      <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Logo & Description */}
        <div className="space-y-3">
          <h1 className="text-2xl font-bold">CourseCloud</h1>
          <p className="text-gray-400 text-sm">
            Learn from the best instructors and enhance your skills with our courses.
          </p>
        </div>

        {/* Quick Links */}
        <div className="space-y-2">
          <h2 className="font-semibold text-lg">Quick Links</h2>
          <ul className="space-y-1">
            <li>
              <Link to="/" className="hover:text-blue-400 transition">Home</Link>
            </li>
            <li>
              <Link to="/courses" className="hover:text-blue-400 transition">Courses</Link>
            </li>
            {user ? (
              <li>
                <Link to="/profile" className="hover:text-blue-400 transition">Profile</Link>
              </li>
            ) : (
              <li>
                <Link to="/signup" className="hover:text-blue-400 transition">Get Started</Link>
              </li>
            )}
          </ul>
        </div>

        {/* Social Icons */}
        <div className="space-y-3">
          <h2 className="font-semibold text-lg">Follow Us</h2>
          <div className="flex space-x-3 mt-2 md:ml-32 ml-32">
            <a href="https://www.facebook.com/piyush.shakya.7311" className="hover:text-blue-500">
              <Facebook size={20} />
            </a>
            <a href="https://x.com/shakya_piyush" className="hover:text-blue-400">
              <Twitter size={20} />
            </a>
            <a href="https://www.instagram.com/p.iyush.522/" className="hover:text-pink-500">
              <Instagram size={20} />
            </a>
            <a href="https://www.linkedin.com/in/piyush-shakya-a555852a2/" className="hover:text-blue-600">
              <Linkedin size={20} />
            </a>
          </div>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="border-t border-gray-700 mt-6 py-4 text-center text-gray-500 text-sm">
        © {new Date().getFullYear()} CourseCloud. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
