import { Button } from "@/components/ui/button";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const EnrolledCourse = () => {
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const navigate=useNavigate();

  useEffect(() => {
    const fetchEnrolledCourses = async () => {
      try {
        const res = await axios.get("http://localhost:3000/api/v1/user/enrolled", {
          withCredentials: true,
        });
        if (res.data.success) setEnrolledCourses(res.data.courses);
      } catch (err) {
        console.log(err);
      }
    };
    fetchEnrolledCourses();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">My Enrolled Courses</h2>
      {enrolledCourses.length === 0 ? (
        <p>No courses enrolled yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:ml-38 ml-0">
          {enrolledCourses.map(course => (
            <div key={course._id} className="border p-4 rounded-md">
              <img src={course.courseThumbnail} alt={course.courseTitle} className="rounded-md mb-2" />
              <h3 className="font-semibold">{course.courseTitle}</h3>
              <Button className='bg-blue-500 hover:bg-blue-600 cursor-pointer mt-2' onClick={()=>navigate(`/courses/${course._id}`)}>Go to course</Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default EnrolledCourse;
