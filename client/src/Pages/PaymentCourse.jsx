import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";

const PaymentCourse = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const res = await axios.get(
          `http://localhost:3000/api/v1/course/${courseId}`,
          { withCredentials: true }
        );
        if (res.data.success) setCourse(res.data.course);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };
    fetchCourse();
  }, [courseId]);

  // ✅ Free enrollment function
  const handleEnroll = async () => {
    try {
      const res = await axios.post(
        `http://localhost:3000/api/v1/course/${courseId}/enroll`,
        {},
        { withCredentials: true }
      );

      if (res.data.success) {
        toast.success("🎉 Enrollment successful!");
        navigate(`/courses/${courseId}`);
      } else {
        toast.error(res.data.message || "Enrollment failed!");
      }
    } catch (err) {
      console.log(err);
      toast.error(err.response?.data?.message || "Something went wrong!");
    }
  };

  if (loading) return <p className="text-center mt-20 text-gray-500">Loading...</p>;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
      <Card className="w-full max-w-lg p-6 shadow-lg rounded-lg">
        {course && (
          <>
            <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">
              {course.coursePrice === 0 ? "Free Enrollment" : "Checkout"}
            </h2>

            <div className="flex items-center space-x-4 mb-6">
              <img
                src={course.courseThumbnail}
                alt="Course Thumbnail"
                className="w-24 h-24 rounded-md object-cover"
              />
              <div>
                <h3 className="font-semibold text-lg">{course.courseTitle}</h3>
                <p className="text-gray-600">
                  {course.coursePrice === 0 ? "Free" : `₹${course.coursePrice}`}
                </p>
              </div>
            </div>

            <CardContent>
              <Button
                onClick={handleEnroll}
                className="w-full bg-green-500 hover:bg-green-600"
              >
                {course.coursePrice === 0
                  ? "Enroll For Free"
                  : `Pay ₹${course.coursePrice} & Enroll`}
              </Button>
            </CardContent>
          </>
        )}
      </Card>
    </div>
  );
};

export default PaymentCourse;
