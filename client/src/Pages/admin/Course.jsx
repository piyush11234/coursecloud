import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setCourse } from "@/redux/courseSlice";
import { Edit } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const Course = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { course } = useSelector((store) => store.course);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getCreatorCourse = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`https://coursecloud.onrender.com/api/v1/course/`, {
          withCredentials: true,
        });
        if (res.data.success) {
          dispatch(setCourse(res.data.courses));
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    getCreatorCourse();
  }, [dispatch]);

  return (
    <div className="p-4 md:p-10 md:mt-0 mt-10 w-full min-h-screen bg-gray-50">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">My Courses</h1>
        <Button
          onClick={() => navigate("create")}
          className="bg-blue-500 hover:bg-blue-600 cursor-pointer"
        >
          + Create Course
        </Button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-md p-4">
        {loading ? (
          <div className="flex justify-center items-center py-10 text-gray-500">
            Loading courses...
          </div>
        ) : course?.length === 0 ? (
          <div className="flex flex-col justify-center items-center py-12 text-gray-500">
            <p className="text-lg mb-4">No courses found</p>
            <Button
              onClick={() => navigate("create")}
              className="bg-blue-500 hover:bg-blue-600"
            >
              + Create Your First Course
            </Button>
          </div>
        ) : (
          <Table>
            <TableCaption>A list of your recent courses.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[300px]">Course</TableHead>
                <TableHead className="text-right">Price</TableHead>
                <TableHead className="text-center">Status</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {course?.map((course) => (
                <TableRow key={course._id} className="hover:bg-gray-50">
                  <TableCell className="flex items-center gap-3">
                    <img
                      src={course?.courseThumbnail || "/placeholder.png"}
                      alt="Thumbnail"
                      className="w-12 h-12 rounded-md object-cover border"
                    />
                    <span className="font-semibold text-gray-800 text-sm sm:text-base md:text-lg lg:text-xl truncate">
                      {course.courseTitle}
                    </span>

                  </TableCell>
                  <TableCell className="font-medium text-right text-gray-700">
                    {course.coursePrice ? `₹${course.coursePrice}` : "NA"}
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge
                      className={`px-3 py-1 rounded-full text-xs font-medium ${course.isPublished
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                        }`}
                    >
                      {course.isPublished ? "Published" : "Draft"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      onClick={() => navigate(`/admin/course/${course._id}`)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
};

export default Course;
