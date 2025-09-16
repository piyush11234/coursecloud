import Hero from '@/components/Hero'
import React, { useEffect } from 'react'
import CourseCard from '@/components/CourseCard'
import { useDispatch, useSelector } from 'react-redux'
import { store } from '@/redux/store'
import axios from 'axios'
import { setCourse } from '@/redux/courseSlice'

const Home = () => {
  const dispatch =useDispatch();
  const { course } = useSelector(store => store.course);
  // console.log(course);

  useEffect(() => {
    const getAllPublishedCourses = async () => {
      try {
        const res = await axios.get(`http://localhost:3000/api/v1/course/published-courses`, { withCredentials: true });
        if (res.data.success) {
          dispatch(setCourse(res.data.courses))
        }

      } catch (error) {
        console.log(error);

      }
    }
    getAllPublishedCourses()
  }, [dispatch])
  

  return (
    <div>
      <Hero />
      <div className='py-10 p-4'>
        <h1 className='text-4xl font-bold text-center text-gray-800 mb-4'>Our Courses</h1>
        <p className='text-center text-gray-600 mb-12 px-16'>
          Explore our curated courses to boost your skills and career. Whether you're a beginner or an expert, we have something for everyone.
        </p>
        <div className='max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
          {course?.slice(0, 6).map(course => (
            <CourseCard key={course._id} course={course} />
          ))}
        </div>
      </div>
    </div>
  )
}

export default Home
