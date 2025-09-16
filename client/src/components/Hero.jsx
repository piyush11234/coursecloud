import React from 'react'
import { Button } from './ui/button'
import { Award, Search, User } from 'lucide-react'
import heroImg from '../assets/HeroImg2.png'
import CountUp from 'react-countup'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { store } from '@/redux/store'

const Hero = () => {
  const { user } = useSelector(store => store.auth);
  return (
    <div className="bg-slate-800 pt-16">
      <div className="mx-auto max-w-7xl lg:h-[700px] flex md:flex-row flex-col gap-10 items-center px-6 md:px-12">
        {/* text section */}
        <div className="flex-1 text-center md:text-left space-y-7 px-4 md:px-0">
          <h1 className="text-4xl mt-10 md:mt-0 md:text-6xl font-extrabold text-gray-200 leading-tight">
            Explore our <span className="text-blue-500">100+</span>
            <br /> Online Courses for All
          </h1>

          <p className="mt-6 text-lg md:text-xl text-gray-400 max-w-2xl">
            Learn from top instructors anytime, anywhere. From technology to
            business, explore courses that boost your career and skills.
          </p>
          {/* <div className='inline-flex relative '>
                        <input type="text"
                            placeholder='Search courses...'
                            className=' rounded-lg rounded-r-lg bg-gray-200 w-[350px] md:w-[450px] text-gray-800 p-4 pr-40 placeholder:text-gray-500  '
                        />
                        <Button className='px-4 h-full py-[14px] flex gap-1 items-center bg-blue-500 hover:bg-blue-600 font-semibold absolute right-0 text-white rounded-r-lg text-xl'>Search<Search width={20} height={20} className='w-14 h-14' /></Button>
                    </div> */}

          <div className="mt-8 flex flex-col md:flex-row gap-4 justify-center md:justify-start">
            <Link to="/courses">
              <Button className="bg-blue-600 hover:bg-blue-700 text-lg px-6 py-3">
                Browse Courses
              </Button>
            </Link>

            <Button variant="outline" className="text-lg px-6 py-3">
              {
                user ? <Link to='/profile'>Profile</Link> : <Link to='/signup'>Get Started</Link>
              }

            </Button>

          </div>

          {/* highlights/stats */}
          {/* <div className="mt-10 flex flex-col md:flex-row gap-8 text-gray-300 justify-center md:justify-start">
            <div>
              <h2 className="text-3xl font-bold text-white">50k+</h2>
              <p className="text-sm">Students Enrolled</p>
            </div>
            <div>
              <h2 className="text-3xl font-bold text-white">200+</h2>
              <p className="text-sm">Expert Instructors</p>
            </div>
            <div>
              <h2 className="text-3xl font-bold text-white">24/7</h2>
              <p className="text-sm">Learning Access</p>
            </div>
          </div> */}
        </div>

        {/* image section (optional) */}
        <div className='flex md:h-[700px] items-end relative px-4 md:px-0'>
          <img src={heroImg} alt="" className='w-[750px] shadow-blue-500 drop-shadow-lg' />
          <div className='bg-slate-200 hidden md:flex gap-3 items-center rounded-md absolute top-[35%] right-0 px-4 py-2'>
            <div className='rounded-full bg-blue-400 p-2 text-white'>
              <User />
            </div>
            <div>
              <h2 className='font-bold text-2xl'><CountUp end={500} />+</h2>
              <p className='italic text-sm text-gray-600 leading-none'>Active Students</p>
            </div>
          </div>

          <div className='bg-slate-200 hidden md:flex gap-3 items-center rounded-md absolute top-[15%] left-8 px-4 py-2'>
            <div className='rounded-full bg-blue-400 p-2 text-white'>
              <Award />
            </div>
            <div>
              <h2 className='font-bold text-2xl'><CountUp end={100} />+</h2>
              <p className='italic text-sm text-gray-600 leading-none'>Certified Students</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Hero
