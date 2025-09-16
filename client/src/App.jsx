import React from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Home from './Pages/Home'
import Courses from './Pages/Courses'

import Signup from './Pages/Signup'
import Login from './Pages/Login'

import Navbar from './components/Navbar'
import Footer from './components/Footer'

import Verify from './Pages/Verify'
import VerifyEmail from './Pages/VerifyEmail'

import Profile from './Pages/Profile'

import Admin from './Pages/admin/Admin'
import Dashboard from './Pages/admin/Dashboard'
import Course from './Pages/admin/Course'
import CreateCourse from './Pages/admin/CreateCourse'
import UpdateCourse from './Pages/admin/UpdateCourse'
import CreateLecture from './Pages/admin/CreateLecture'
import EditLecture from './Pages/admin/EditLecture'
import CourseDetails from './Pages/CourseDetails'

import Setting from './Pages/Setting'

import ForgotPassword from './Pages/ForgotPassword'
import VerifyOtp from './Pages/VerifyOtp'
import PaymentCourse from './Pages/PaymentCourse'
import ChangePassword from './Pages/ChangePassword'
import PaymentCourse from './Pages/PaymentCourse'

const router = createBrowserRouter([
  {
    path: '/',
    element: <><Navbar /><Home /><Footer/></>
  },
  {
    path: '/courses',
    element: <><Navbar/><Courses /><Footer/></>
  },
  {
    path: '/signup',
    element: <><Navbar/><Signup /><Footer/></>
  },
  {
    path: '/verify',
    element: <VerifyEmail />
  },
  {
    path: '/verify/:token',
    element: <Verify />
  },
  {
    path: '/login',
    element: <><Navbar/><Login /><Footer/></>
  },
  {
    path: '/forgot-password',
    element: <ForgotPassword />
  },
  {
    path: '/verify-otp/:email',
    element: <VerifyOtp />
  },
  {
    path: '/change-password/:email',
    element: <ChangePassword />
  },
  {
    path: '/profile',
    element: <><Navbar/><Profile /><Footer/></>
  },
  {
    path: '/courses/:courseId',
    element: <><Navbar/><CourseDetails /><Footer/></>
  },
  {
    path: '/setting',
    element: <><Navbar/><Setting/><Footer/></>
  },
  {
    path: '/payment/:courseId',
    element: <><Navbar/><PaymentCourse/><Footer/></>
  },
  {
    path: '/admin',
    element: <><Navbar/><Admin /></>,
    children:[
      {
        path:'dashboard',
        element:<Dashboard/>
      },
      {
        path:'course',
        element:<Course/>
      },
      {
        path:'course/create',
        element:<CreateCourse/>
      },
      {
        path:'course/:courseId',
        element:<UpdateCourse/>
      },
      {
        path:'course/:courseId/lecture',
        element:<CreateLecture/>
      },
      {
        path:'course/:courseId/lecture/:lectureId',
        element:<EditLecture/>
      },
    ]
  },
])

const App = () => {
  return (
    <div className='text-center text-2xl'>
      <RouterProvider router={router} />
      
    </div>
  )
}

export default App