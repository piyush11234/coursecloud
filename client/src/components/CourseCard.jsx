import React from 'react'
import { Card } from './ui/card'
import { Button } from './ui/button'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'

const CourseCard = ({ course }) => {
  const navigate = useNavigate();
  const { user } = useSelector(state => state.auth);

  return (
    <Card className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300">
      {/* Image Section */}
      <div className="relative overflow-hidden">
        <img
          src={course?.courseThumbnail || course?.image}
          alt={course?.courseTitle || course?.title}
          className="w-full h-56 object-cover transform hover:scale-105 transition-transform duration-500"
        />
      </div>

      {/* Text Content */}
      <div className="p-1 flex flex-col justify-between h-full">
        <h2 className="text-xl font-bold text-gray-800  line-clamp-1">
          {course?.courseTitle || course?.title}
        </h2>
        <p className="text-gray-600 text-sm  line-clamp-3">
          {course?.subTitle || course?.description}
        </p>

        {/* CTA Button */}
        <Button
          onClick={() => navigate(user ? `/courses/${course._id}` : "/login")}
          className="cursor-pointer w-full bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
        >
          Learn More 🚀
        </Button>
      </div>
    </Card>
  )
}

export default CourseCard
