import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import React, { useState } from 'react'
import { Loader2 } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { toast } from 'sonner'

const CreateCourse = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [courseTitle, setCourseTitle] = useState('');
    const [category, setCategory] = useState('');

    const getSelectedCategory = (value) => {
        setCategory(value)
    }

    const createCourseHandler = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            const res = await axios.post(`https://coursecloud.onrender.com/api/v1/course/`, { courseTitle, category }, {
                headers: {
                    "Content-Type": "application/json"
                },
                withCredentials: true
            })
            if (res.data.success) {
                navigate('/admin/course');
                toast.success(res.data.message)
            }

        } catch (error) {
            console.log(error);
            toast.error(error.response?.data?.message || "Failed to create course");

        } finally {
            setLoading(false);
        }

    }
    return (
        <div className="min-h-screen flex justify-center items-start p-6 bg-gray-100">
            <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl p-8">
                <h1 className="text-3xl font-bold text-center mb-2">
                    Let’s Add <span className="text-blue-500">Courses</span>
                </h1>
                <p className="text-gray-600 text-center mb-8">
                    Fill in the course details below to add a new course to your platform.
                </p>

                <form className="space-y-6" onSubmit={createCourseHandler}>
                    {/* Course Title */}
                    <div>
                        <Label htmlFor="courseTitle" className="mb-2 ">Title</Label>
                        <Input
                            id="courseTitle"
                            type="text"
                            name="courseTitle"
                            value={courseTitle}
                            onChange={(e) => setCourseTitle(e.target.value)}
                            placeholder="Enter your course name"
                            className="bg-gray-50"
                        />
                    </div>

                    {/* Category */}
                    <div>
                        <Label className="mb-2">Category</Label>
                        <Select value={category} onValueChange={getSelectedCategory}>
                            <SelectTrigger className="w-full bg-gray-50">
                                <SelectValue placeholder="Select a category" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectLabel>Categories</SelectLabel>
                                    <SelectItem value="Next Js">Next Js</SelectItem>
                                    <SelectItem value="Data Science">Data Science</SelectItem>
                                    <SelectItem value="Frontend Development">Frontend Development</SelectItem>
                                    <SelectItem value="Backend Development">Backend Development</SelectItem>
                                    <SelectItem value="MernStack Development">MERN Stack Development</SelectItem>
                                    <SelectItem value="Javascript">JavaScript</SelectItem>
                                    <SelectItem value="Python">Python</SelectItem>
                                    <SelectItem value="Docker">Docker</SelectItem>
                                    <SelectItem value="MongoDB">MongoDB</SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Submit */}
                    <div className='flex gap-2 '>
                        <Button type='button' onClick={() => navigate('/admin/course')} variant="outline" className='cursor-pointer'>Cancel</Button>
                        <Button type='submit' className="bg-blue-500 hover:bg-blue-600 cursor-pointer " disabled={loading} >
                            {
                                loading ? <><Loader2 className='animate-spin mr-1 h-4 w-4 ' />Please wait</> : "Create"
                            }
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default CreateCourse
