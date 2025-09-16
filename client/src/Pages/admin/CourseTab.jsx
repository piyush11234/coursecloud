import RichTextEditor from '@/components/RichTextEditor';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import { setCourse } from '@/redux/courseSlice';
import { store } from '@/redux/store';
import axios from 'axios';
import { Loader2 } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';

const CourseTab = () => {
    const navigate = useNavigate();
    const params = useParams();
    const id = params.courseId;
    const dispatch = useDispatch();
    const { course } = useSelector(store => store.course);

    const selectCourse = Array.isArray(course) ? course.find(c => c._id === id) : null;

    const [selectedCourse, setSelectedCourse] = useState(selectCourse);
    const [loading, setLoading] = useState(false);
    const [publish, setPublish] = useState(false);

    const [input, setInput] = useState({
        courseTitle: "",
        subTitle: "",
        description: "",
        category: "",
        courseLevel: "",
        coursePrice: "",
        file: "",
        courseThumbnail: null,
    });

    const [previewThumbnail, setPreviewThumbnail] = useState(null);

    // Fetch course from server if not in Redux
    const getCourseById = async () => {
        try {
            const res = await axios.get(`https://coursecloud.onrender.com/api/v1/course/${id}`, { withCredentials: true });
            if (res.data.success) {
                setSelectedCourse(res.data.course);
            }
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        if (!selectCourse) getCourseById();
    }, [id]);

    useEffect(() => {
        if (selectedCourse) {
            setInput({
                courseTitle: selectedCourse.courseTitle || "",
                subTitle: selectedCourse.subTitle || "",
                description: selectedCourse.description || "",
                category: selectedCourse.category || "",
                courseLevel: selectedCourse.courseLevel || "",
                coursePrice: selectedCourse.coursePrice || "",
                file: "",
                courseThumbnail: null,
            });
            setPreviewThumbnail(selectedCourse.courseThumbnail || null);
        }
    }, [selectedCourse]);

    // Input change handler
    const changeEventHandler = (e) => {
        const { name, value, files } = e.target;
        if (name === "file") {
            const file = files[0];
            setInput(prev => ({ ...prev, file }));
            setPreviewThumbnail(URL.createObjectURL(file));
        } else {
            setInput(prev => ({ ...prev, [name]: value }));
        }
    };

    const selectCategory = (value) => setInput({ ...input, category: value });
    const selectCourseLevel = (value) => setInput({ ...input, courseLevel: value });

    // Thumbnail selection
    const selectThumbnail = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            setInput({ ...input, courseThumbnail: file });
            const reader = new FileReader();
            reader.onloadend = () => setPreviewThumbnail(reader.result);
            reader.readAsDataURL(file);
        }
    };

    // Update course
    const updateCourseHandler = async () => {
        const formData = new FormData();
        formData.append("courseTitle", input.courseTitle);
        formData.append("subTitle", input.subTitle);
        formData.append("description", input.description);
        formData.append("category", input.category);
        formData.append("courseLevel", input.courseLevel);
        formData.append("coursePrice", input.coursePrice);
        formData.append("file", input.file || input.courseThumbnail);

        try {
            setLoading(true);
            const res = await axios.put(`https://coursecloud.onrender.com/api/v1/course/${id}`, formData, {
                headers: { "Content-Type": "multipart/form-data" },
                withCredentials: true
            });

            if (res.data.success) {
                toast.success(res.data.message);
                navigate(`lecture`);
                dispatch(setCourse(course.map(c => c._id === id ? res.data.course : c)));
            }
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    // Publish/Unpublish
    const togglePublishUnpublish = async (action) => {
        if (!selectedCourse) return;
        try {
            const res = await axios.patch(`https://coursecloud.onrender.com/api/v1/course/${id}`, {}, {
                params: { action },
                withCredentials: true
            });
            if (res.data.success) {
                setPublish(!publish);
                toast.success(res.data.message);
            }
        } catch (error) {
            console.log(error);
        }
    };

    // Remove course
    const removeCourse = async () => {
        if (!selectedCourse) return;
        try {
            const res = await axios.delete(`https://coursecloud.onrender.com/api/v1/course/${id}`, { withCredentials: true });
            if (res.data.success) {
                toast.success(res.data.message);
                dispatch(setCourse(course.filter(c => c._id !== id)));
                navigate('/admin/course');
            }
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <Card className="shadow-lg rounded-2xl border border-gray-200">
            <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <CardTitle className="text-xl font-bold text-gray-800 text-left">
                        Basic Course Information
                    </CardTitle>
                    <CardDescription className="text-gray-500 mt-1">
                        Update your course details below. Click{" "}
                        <span className="font-medium text-gray-700">Publish</span> when done.
                    </CardDescription>
                </div>
                <div className="flex gap-3 justify-end md:justify-center">
                    <Button
                        disabled={!selectedCourse}
                        onClick={() => togglePublishUnpublish(selectedCourse?.isPublished ? "false" : "true")}
                        className="bg-gray-800 hover:bg-gray-800 cursor-pointer"
                    >
                        {selectedCourse?.isPublished ? "UnPublish" : "Publish"}
                    </Button>
                    <Button
                        variant="destructive"
                        onClick={removeCourse}
                        className="bg-red-500 hover:bg-red-600 px-5 rounded-lg"
                    >
                        Remove
                    </Button>
                </div>
            </CardHeader>

            <CardContent className="mt-4 space-y-6">
                <div className="space-y-2">
                    <Label>Title</Label>
                    <Input
                        type="text"
                        name="courseTitle"
                        value={input.courseTitle}
                        onChange={changeEventHandler}
                        placeholder="Enter your course title"
                    />
                </div>

                <div className="space-y-2">
                    <Label>Subtitle</Label>
                    <Input
                        type="text"
                        name="subTitle"
                        value={input.subTitle}
                        onChange={changeEventHandler}
                        placeholder="Enter your course subtitle"
                    />
                </div>

                <div className="space-y-2">
                    <Label>Description</Label>
                    <RichTextEditor input={input} setInput={setInput} />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                    <div className="space-y-2">
                        <Label>Category</Label>
                        <Select value={input.category} onValueChange={selectCategory}>
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select a category" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectLabel>Category</SelectLabel>
                                    <SelectItem value="Next Js">Next Js</SelectItem>
                                    <SelectItem value="Data Science">Data Science</SelectItem>
                                    <SelectItem value="Frontend Development">Frontend Development</SelectItem>
                                    <SelectItem value="Backend Development">Backend Development</SelectItem>
                                    <SelectItem value="MernStack Development">MERN Stack Development</SelectItem>
                                    <SelectItem value="Javascript">Javascript</SelectItem>
                                    <SelectItem value="Python">Python</SelectItem>
                                    <SelectItem value="Docker">Docker</SelectItem>
                                    <SelectItem value="MongoDB">MongoDB</SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label>Course Level</Label>
                        <Select value={input.courseLevel} onValueChange={selectCourseLevel}>
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select a level" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectLabel>Course Level</SelectLabel>
                                    <SelectItem value="Beginner">Beginner</SelectItem>
                                    <SelectItem value="Medium">Medium</SelectItem>
                                    <SelectItem value="Advance">Advance</SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label>Price (INR)</Label>
                        <Input
                            type="number"
                            name="coursePrice"
                            value={input.coursePrice}
                            onChange={changeEventHandler}
                            placeholder="199"
                            className="w-full"
                        />
                    </div>
                </div>

                <div>
                    <Label>Course Thumbnail</Label>
                    <Input
                        type="file"
                        onChange={selectThumbnail}
                        accept="image/*"
                        className="w-fit mt-2 cursor-pointer"
                    />
                    {previewThumbnail && (
                        <img src={previewThumbnail} alt="Thumbnail" className="w-64 my-2" />
                    )}
                </div>

                <div className="flex gap-2">
                    <Button onClick={() => navigate('/admin/course')} variant="outline" className="cursor-pointer">
                        Cancel
                    </Button>
                    <Button disabled={loading} onClick={updateCourseHandler} className="bg-blue-600 hover:bg-blue-700 cursor-pointer">
                        {loading ? (
                            <>
                                <Loader2 className="mr-2 w-4 h-4 animate-spin" />
                                Please wait
                            </>
                        ) : "Save"}
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
};

export default CourseTab;
