import React, { useState } from 'react'
import userLogo from '../assets/user.jpg'
import { useDispatch, useSelector } from 'react-redux'
import { setUser } from '@/redux/authSlice';
import { store } from '@/redux/store';
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import axios from 'axios';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import EnrolledCourse from './EnrolledCourse';


const Profile = () => {
    const dispatch = useDispatch();
    const { user } = useSelector(store => store.auth);
    const [input, setInput] = useState({
        name: user?.name,
        description: user?.description,
        file: null
    })

    const [loading, setLoading] = useState(false)
    const [open, setOpen] = useState(false)

    const changeEventHandler = (e) => {
        const { name, value } = e.target;
        setInput((prev) => ({
            ...prev,
            [name]: value,
        }))
    }
    const changeFileHandler = (e) => {
        setInput({ ...input, file: e.target.files?.[0] })
    }
    const submitHandler = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        if (input.name) formData.append("name", input.name);
        if (input.description) formData.append("description", input.description);
        if (input.file instanceof File) formData.append("file", input.file);

        try {
            setLoading(true);
            const res = await axios.put(`http://localhost:3000/api/v1/user/profile/update`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data"
                },
                withCredentials: true
            })
            if (res.data.success) {
                setOpen(false);
                toast.success(res.data.message)
                dispatch(setUser({ user: res.data.user }));
            }
        } catch (error) {
            console.log(error);

        } finally {
            setLoading(false)
        }

    }

    return (
        <div className=' bg-gray-100 py-12 px-4 lg:px-0'>
            <div className='max-w-6xl mx-auto p-8 bg-gradient-to-r bg-white shadow-xl rounded-2xl mt-14'>
                <div className='flex flex-col items-center md:flex-row md:items-start space-y-8 md:space-y-0 md:space-x-12'>
                    {/* profile picture */}
                    <div className='w-40 h-40 rounded-full overflow-hidden border-4 border-blue-500 shadow-lg'>
                        <img src={user?.photoUrl || userLogo} alt="" className='w-full h-full object-cover' />
                    </div>
                    {/* user info  */}
                    <div className='text-center md:text-left'>
                        <h1 className='text-4xl font-bold text-blue-500'>Welcome, {user?.name.split(" ")[0] || "User"} </h1>
                        <p className='text-lg text-gray-600 mt-3'><span className='font-bold'>Email :</span> {user?.email || "Email not available"}</p>
                        <p className='text-gray-600 my-1 capitalize'><span className='font-bold'>Role :</span> {user?.role}</p>
                        <p className='text-gray-700 text-base leading-relaxed mb-3'>
                            <span className='font-bold'>Bio :</span> {user?.description || "Add Your bio"}
                        </p>


                        <Dialog open={open} onOpenChange={setOpen}>

                            <DialogTrigger asChild>
                                <Button className='bg-blue-500 hover:bg-blue-600 cursor-pointer'>
                                    Edit Profile
                                </Button>
                            </DialogTrigger>

                            <DialogContent className="sm:max-w-[425px]">
                                <DialogHeader>
                                    <DialogTitle className='text-center'>Edit profile</DialogTitle>
                                    <DialogDescription className='text-center'>
                                        Make changes to your profile here.
                                    </DialogDescription>
                                </DialogHeader>
                                <div className='grid gap-4 py-4'>
                                    <div className='grid grid-cols-4 items-center gap-4'>
                                        <Label htmlFor="name" className="text-right">Name</Label>
                                        <Input
                                            id="name"
                                            name="name"
                                            value={input.name}
                                            onChange={changeEventHandler}
                                            className="col-span-3 text-gray-500"
                                        />
                                    </div>
                                    <div className='grid grid-cols-4 items-center gap-4'>
                                        <Label htmlFor="name" className="text-right">Description</Label>
                                        <Input
                                            id="name"
                                            name="description"
                                            value={input.description}
                                            onChange={changeEventHandler}
                                            className="col-span-3 text-gray-500"
                                        />
                                    </div>
                                    <div className='grid grid-cols-4 items-center gap-4'>
                                        <Label htmlFor="name" className="text-right">
                                            Picture
                                        </Label>
                                        <Input
                                            id="file"
                                            type="file"
                                            accept="image/*"
                                            onChange={changeFileHandler}
                                            className="w-[277px]"
                                        />
                                    </div>
                                </div>
                                <DialogFooter>
                                    {
                                        loading ? <Button className="bg-blue-400 hover:bg-blue-500"><Loader2 className='mr-2 w-4 h-4 animate-spin' /> Please wait</Button> : <Button
                                            onClick={submitHandler} className="bg-blue-500 hover:bg-blue-600 cursor-pointer">Save Changes</Button>
                                    }
                                </DialogFooter>
                            </DialogContent>

                        </Dialog>

                    </div>
                </div>
            </div>
            <EnrolledCourse/>
        </div>
    )
}

export default Profile