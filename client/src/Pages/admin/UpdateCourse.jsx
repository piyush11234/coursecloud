import { Button } from "@/components/ui/button";
import React from "react";
import { Link } from "react-router-dom";
import CourseTab from "./CourseTab";

const UpdateCourse = () => {
  return (
    <div className="md:p-10 p-4 min-h-screen bg-gray-50 mt-8 md:mt-0">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-3">
        <h1 className="font-bold text-2xl text-gray-800">
          Update <span className="text-blue-600">Course Details</span>
        </h1>
        <Link to="lecture">
          <Button className="bg-blue-500 hover:bg-blue-600 text-white cursor-pointer">
            Go to Lectures Page
          </Button>
        </Link>
      </div>

      {/* Info Card */}
      {/* <div className="bg-white shadow-md rounded-xl p-6 mb-6">
        <p className="text-gray-600 text-base leading-relaxed">
          Add or update detailed information about your course below. Make sure
          to provide a clear course title, category, pricing, and any additional
          resources so that students can easily understand the course content.
        </p>
      </div> */}

      {/* Tabs Section */}
      <div >
        <CourseTab />
      </div>
    </div>
  );
};

export default UpdateCourse;
