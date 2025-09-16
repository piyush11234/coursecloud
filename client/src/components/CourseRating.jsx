import React, { useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const CourseRating = () => {
  const { courseId } = useParams();
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [review, setReview] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async () => {
    if (!rating) {
      setMessage("Please select a rating before submitting.");
      return;
    }
    setLoading(true);
    try {
      const res = await axios.post(
        `https://coursecloud.onrender.com/api/v1/course/${courseId}/rate`,
        { rating, review },
        { withCredentials: true }
      );
      if (res.data.success) {
        setMessage("Thank you for your rating!");
        setRating(0);
        setReview("");
      }
    } catch (err) {
      setMessage("Failed to submit rating. Try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <Card className="max-w-lg w-full shadow-md">
        <CardHeader>
          <CardTitle className="text-xl font-bold">Rate This Course</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Star rating */}
          <div className="flex space-x-2 mb-4">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                size={28}
                className={`cursor-pointer ${
                  star <= (hover || rating)
                    ? "text-yellow-500 fill-yellow-500"
                    : "text-gray-300"
                }`}
                onClick={() => setRating(star)}
                onMouseEnter={() => setHover(star)}
                onMouseLeave={() => setHover(0)}
              />
            ))}
          </div>

          {/* Review input */}
          <textarea
            className="w-full p-2 border rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows="4"
            placeholder="Write your feedback..."
            value={review}
            onChange={(e) => setReview(e.target.value)}
          />

          {/* Submit button */}
          <Button
            className="w-full bg-blue-500 hover:bg-blue-600"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? "Submitting..." : "Submit Rating"}
          </Button>

          {message && (
            <p className="mt-3 text-center text-sm text-gray-600">{message}</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CourseRating;
