import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import axios from 'axios'
import { ArrowLeft, Lock, PlayCircle } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'

const CourseDetails = () => {
    const navigate = useNavigate()
    const params = useParams()
    const courseId = params.courseId
    const { course } = useSelector(store => store.course)

    const [selectedCourse, setSelectedCourse] = useState(null)
    const [courseLecture, setCourseLecture] = useState([])
    const [activeLecture, setActiveLecture] = useState(null)
    const [loading, setLoading] = useState(true)

    //enroll course
    const handleEnroll = () => {
        navigate(`/payment/${selectedCourse._id}`);
    };


    // Fetch course data
    // useEffect(() => {
    //     const fetchCourse = async () => {
    //         try {
    //             let courseData = course?.find(course => course._id === courseId)
    //             if (!courseData) {
    //                 const res = await axios.get(`https://coursecloud.onrender.com/api/v1/course/${courseId}`, { withCredentials: true })
    //                 if (res.data.success) courseData = res.data.course
    //             }
    //             setSelectedCourse(courseData)
    //             setLoading(false)
    //         } catch (err) {
    //             console.log(err)
    //             setLoading(false)
    //         }
    //     }
    //     fetchCourse()
    // }, [course, courseId])


    useEffect(() => {
        const fetchCourse = async () => {
            try {
                let courseData = course?.find(course => course._id === courseId)
                if (!courseData) {
                    const res = await axios.get(
                        `https://coursecloud.onrender.com/api/v1/course/${courseId}`,
                        { withCredentials: true }
                    )
                    if (res.data.success) courseData = res.data.course
                }

                // ✅ Add isEnrolled flag from backend
                const enrolledRes = await axios.get(
                    `https://coursecloud.onrender.com/api/v1/course/${courseId}/check-enrollment`,
                    { withCredentials: true }
                )

                setSelectedCourse({ ...courseData, isEnrolled: enrolledRes.data.isEnrolled })
                setLoading(false)
            } catch (err) {
                console.log(err)
                setLoading(false)
            }
        }
        fetchCourse()
    }, [course, courseId])


    // Fetch lectures
    useEffect(() => {
        const fetchLectures = async () => {
            try {
                const res = await axios.get(`https://coursecloud.onrender.com/api/v1/course/${courseId}/lecture`, { withCredentials: true })
                if (res.data.success) {
                    setCourseLecture(res.data.lectures || [])
                    setActiveLecture(res.data.lectures?.[0] || null) // First lecture as default
                }
            } catch (err) {
                console.log(err)
            }
        }
        fetchLectures()
    }, [courseId])

    if (loading) return <p className="text-center mt-20 text-gray-500">Loading course...</p>
    if (!selectedCourse) return <p className="text-center mt-20 text-red-500">Course not found!</p>

    return (
        <div className='bg-gray-100 md:p-10'>
            <Card className="max-w-7xl rounded-md mx-auto bg-white shadow-md pt-5 mt-14">
                {/* Header */}
                <div className='px-4 py-1'>
                    <div className='flex justify-between items-center'>
                        <div className='flex gap-2 items-center'>
                            <Button size="icon" variant="outline" className="rounded-full cursor-pointer" onClick={() => navigate('/')}>
                                <ArrowLeft size={16} />
                            </Button>
                            <h1 className='md:text-2xl font-bold text-gray-800'>{selectedCourse?.courseTitle}</h1>
                        </div>
                        <div className='flex space-x-4'>
                            <div className='flex space-x-4'>
                                {!selectedCourse?.isEnrolled && (
                                    <Button onClick={handleEnroll} className="bg-blue-500 hover:bg-blue-600 cursor-pointer">
                                        Enroll Now
                                    </Button>
                                )}
                            </div>

                            {/* <Button onClick={handleEnroll} className="bg-blue-500 hover:bg-blue-600 cursor-pointer">Enroll Now</Button> */}
                        </div>
                    </div>
                </div>

                {/* Course Overview */}
                <div className='p-6'>
                    <div className='flex flex-col lg:flex-row lg:space-x-8'>
                        <img src={selectedCourse?.courseThumbnail} alt="Thumbnail" className='w-full lg:w-1/3 rounded-md mb-4 lg:mb-0' />
                        <div>
                            <p className='text-gray-800 mb-4 font-semibold capitalize text-left'>{selectedCourse?.subTitle}</p>
                            <p className='mb-4 text-gray-700 text-left' dangerouslySetInnerHTML={{ __html: selectedCourse?.description }} />
                            <p className="text-gray-800 font-semibold text-start">⭐⭐⭐⭐⭐ (4.8) | 1,200 reviews</p>
                            <div className='mt-1'>
                                <p className="text-2xl font-bold text-gray-800 text-start">₹{selectedCourse?.coursePrice}</p>
                                <p className="text-gray-500 line-through text-start">₹{selectedCourse?.coursePrice + 200}</p>
                            </div>
                            <ul className="mt-4 space-y-2">
                                <li className="text-gray-600 text-start">✔ 20+ hours of video content</li>
                                <li className="text-gray-600 text-start">✔ Lifetime access to course materials</li>
                                <li className="text-gray-600 text-start">✔ Certificate of completion</li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Course Details */}
                <div className="p-6">
                    {/* <h2 className="text-xl font-bold text-gray-800 mb-4 text-start">What You'll Learn</h2>
                    <ul className="list-disc pl-5 space-y-2 text-gray-700 text-start">
                        <li>Build dynamic web applications with PHP and MySQL</li>
                        <li>Deploy websites on Apache/Nginx servers</li>
                        <li>Understand REST APIs and database integration using PHP</li>
                    </ul> */}

                    <h2 className="text-xl font-bold text-gray-800 mt-6 mb-4 text-start">Requirements</h2>
                    <p className="text-gray-700 text-start">Basic programming knowledge is helpful but not required.</p>

                    <h2 className="text-xl font-bold text-gray-800 mt-6 mb-4 text-start">Who This Course is For</h2>
                    <p className="text-gray-700 text-start">Beginners, aspiring developers, and professionals looking to upgrade skills.</p>
                </div>

                {/* Course Lectures */}
                {
                    courseLecture?.length > 0 && (
                        <div className='flex flex-col md:flex-row justify-between gap-10 p-6'>
                            {/* Lecture list */}
                            <div className='flex-1'>
                                <h2 className='text-xl font-bold text-gray-800 text-start'>Course Curriculum</h2>
                                <p className='text-gray-700 italic my-2 text-left'>{courseLecture.length} Lectures</p>
                                <div className='space-y-4'>
                                    {courseLecture.map((lecture, index) => (
                                        <div
                                            key={index}
                                            className={`flex items-center gap-3 p-4 rounded-md cursor-pointer ${activeLecture?._id === lecture._id ? 'bg-blue-100' : 'bg-gray-200'}`}
                                            onClick={() => setActiveLecture(lecture)}
                                        >
                                            <span>
                                                {selectedCourse?.isEnrolled || activeLecture.isPreviewFree  ? <PlayCircle size={20} /> : <Lock size={20} />}
                                            </span>
                                            <p>{lecture.lectureTitle}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Video Player */}
                            <div className='w-full lg:w-1/3'>
                                <Card>
                                    <CardContent className="p-4 flex flex-col">
                                        <div className='w-full aspect-video mb-4'>

                              

                                            {activeLecture ? (
                                                // ✅ Check enrollment OR free preview
                                                selectedCourse?.isEnrolled || activeLecture.isPreviewFree ? (
                                                    <video
                                                        width="100%"
                                                        height="auto"
                                                        controls
                                                        src={activeLecture.videoUrl}
                                                    />
                                                ) : (
                                                    <div className="flex flex-col items-center justify-center h-full bg-gray-200 rounded-md p-6">
                                                        <Lock className="w-6 h-6 text-gray-600 mb-2" />
                                                        <p className="text-gray-600">This lecture is locked. Enroll to watch.</p>
                                                    </div>
                                                )
                                            ) : (
                                                <p className="text-center text-gray-500">Select a lecture to watch</p>
                                            )}


                                        </div>

                                        <h1>{activeLecture?.lectureTitle || "Lecture Title"}</h1>
                                        <Separator className="my-2" />
                                        <p>Click on a lecture tab to access video related to that lecture</p>
                                    </CardContent>
                                    {/* <CardFooter className="flex p-4">
                                        <Button>Continue Course</Button>
                                    </CardFooter> */}
                                </Card>
                            </div>

                        </div>
                    )
                }

                {/* Instructor Section */}
                {selectedCourse?.creator && (
                    <div className='p-6'>
                        <h2 className='text-xl font-bold text-gray-800 mb-4 text-left'>Instructor</h2>
                        <div className='flex items-center space-x-4'>
                            <img
                                src={selectedCourse?.creator?.photoUrl}
                                alt="instructor"
                                className='w-16 h-16 rounded-full'
                            />
                            <div>
                                <h3 className='text-lg font-bold text-gray-800 text-left'>{selectedCourse.creator.name}</h3>
                                <p className='text-gray-600'>{selectedCourse.creator.description}</p>
                            </div>
                        </div>
                    </div>
                )}

            </Card>
        </div>
    )
}

export default CourseDetails
