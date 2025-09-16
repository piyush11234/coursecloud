import { ChartColumnBig, FolderPlus, ChevronRight } from "lucide-react";
import React, { useState } from "react";
import { NavLink } from "react-router-dom";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Toggle Button (only mobile) */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden fixed top-2/5 left-2 z-50 p-2 rounded-full bg-gray-800 text-gray-200 hover:bg-gray-700 transform -translate-y-1/2"
      >
        <ChevronRight
          size={22}
          className={`transition-transform ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {/* Sidebar */}
      <div className={`fixed md:static top-0 bottom-0 left-0  w-72 mt-16 md:mt-0 bg-gray-800 shadow-lg transform 
          ${isOpen ? "translate-x-0" : "-translate-x-full"} 
          md:translate-x-0 transition-transform duration-300 z-40`}>
        {/* Logo / Header */}
        <div className="text-center py-6 border-b border-gray-700">
          <h2 className="text-xl font-bold text-white">Admin Panel</h2>
        </div>

        {/* Nav Links */}
        <nav className="flex flex-col px-4 pt-6 space-y-2">
          <NavLink
            to="/admin/dashboard"
            className={({ isActive }) =>
              `flex items-center gap-3 p-3 rounded-lg text-gray-300 hover:bg-gray-700 transition ${
                isActive ? "bg-gray-900 text-white" : ""
              }`
            }
          >
            <ChartColumnBig size={22} />
            <span className="font-medium">Dashboard</span>
          </NavLink>

          <NavLink
            to="/admin/course"
            className={({ isActive }) =>
              `flex items-center gap-3 p-3 rounded-lg text-gray-300 hover:bg-gray-700 transition ${
                isActive ? "bg-gray-900 text-white" : ""
              }`
            }
          >
            <FolderPlus size={22} />
            <span className="font-medium">Courses</span>
          </NavLink>
        </nav>
      </div>

      {/* Overlay (for mobile only) */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-black/40 md:hidden z-30"
        />
      )}
    </>
  );
};

export default Sidebar;
