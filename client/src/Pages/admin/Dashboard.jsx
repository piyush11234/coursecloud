import React, { useEffect, useState } from "react";
import axios from "axios";

const Dashboard = () => {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await axios.get("https://coursecloud.onrender.com/api/v1/course/admin/all-courses", {
          withCredentials: true,
        });
        if (res.data.success) {
          setCourses(res.data.courses);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchCourses();
  }, []);

  return (
    <div className="p-6 min-h-screen bg-gray-50">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">📊 Admin Dashboard</h1>

      <section>
        <h2 className="text-xl font-bold text-gray-700 mb-4">📚 Courses & Enrolled Students</h2>
        {courses.length === 0 ? (
          <p className="text-gray-600">No courses available.</p>
        ) : (
          <div className="space-y-6">
            {courses.map((course) => (
              <div
                key={course._id}
                className="bg-white shadow-md rounded-xl p-6 border"
              >
                {/* Course Info */}
                <div className="flex items-center gap-4 mb-4">
                  <img
                    src={course.courseThumbnail}
                    alt={course.courseTitle}
                    className="w-24 h-16 object-cover rounded-lg"
                  />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {course.courseTitle}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {course.enrolledStudents.length} Students Enrolled
                    </p>
                  </div>
                </div>

                {/* Student Table */}
                {course.enrolledStudents.length > 0 ? (
                  <table className="w-full border-collapse text-sm">
                    <thead>
                      <tr className="bg-gray-100 text-gray-700">
                        <th className="border px-3 py-2 text-left">#</th>
                        <th className="border px-3 py-2 text-left">Name</th>
                        <th className="border px-3 py-2 text-left">Email</th>
                      </tr>
                    </thead>
                    <tbody>
                      {course.enrolledStudents.map((student, idx) => (
                        <tr key={student._id} className="hover:bg-gray-50">
                          <td className="border px-3 py-2">{idx + 1}</td>
                          <td className="border px-3 py-2">{student.name}</td>
                          <td className="border px-3 py-2">{student.email}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <p className="text-gray-500">No students enrolled yet.</p>
                )}
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Dashboard;
