import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup } from "@/components/ui/radio-group";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";
import { Eye, EyeOff } from "lucide-react";

const Signup = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [user, setUser] = useState({
    name: '',
    email: '',
    password: '',
    role: 'student'
  });
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prev) => ({
      ...prev,
      [name]: value
    }))
  }


  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      const res = await axios.post(`https://coursecloud.onrender.com/api/v1/user/register`, user, {
        headers: {
          "Content-Type": "application/json"
        },
        withCredentials: true
      })
      if (res.data.success) {
        navigate('/verify');
        toast.success(res.data.message);
      } else {
        toast.error("Something went wrong");
      }
    } catch (error) {
      console.error("Error during signup:", error.response?.data?.message);
      toast.error(error.response?.data?.message || "Signup failed. Please try again.");

    } finally {
      setIsLoading(false);
    }

  }
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-gray-100 p-4">
      <div className="bg-white shadow-xl rounded-2xl p-8 max-w-md w-full border border-gray-200">
        {/* Heading */}
        <h1 className="text-3xl font-extrabold text-center bg-gradient-to-r from-blue-500 to-indigo-600 bg-clip-text text-transparent">
          Create Your Account
        </h1>
        <p className="text-center text-gray-600 mt-2 mb-8">
          Join us today! It's quick and easy 🚀
        </p>
        <form onSubmit={handleSubmit}>
          {/* Full Name */}
          <div className="mb-5">
            <Label htmlFor="name">Full Name</Label>
            <Input
              type="text"
              id="name"
              name='name'
              value={user.name}
              onChange={handleChange}
              required
              placeholder="Enter your full name"
              className="mt-2 focus:ring-2 focus:ring-blue-400"
            />
          </div>

          {/* Email */}
          <div className="mb-5">
            <Label htmlFor="email">Email</Label>
            <Input
              type="email"
              id="email"
              name='email'
              value={user.email}
              onChange={handleChange}
              required
              placeholder="Enter your email"
              className="mt-2 focus:ring-2 focus:ring-blue-400"
            />
          </div>

          {/* Password */}
          <div className="mb-5">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                id="password"
                name='password'
                value={user.password}
                onChange={handleChange}
                required
                placeholder="Enter your password"
                className="mt-2 focus:ring-2 focus:ring-blue-400"
              />
              <Button type='button'
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => setShowPassword(!showPassword)}
                disabled={isLoading}
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4 text-gray-500" />
                ) : (
                  <Eye className="w-4 h-4 text-gray-500" />
                )}
              </Button>
            </div>

          </div>

          {/* Role Selection */}
          <div className="mb-6">
            <Label>Role</Label>
            <RadioGroup className="flex gap-4 mt-2 peer ">
              <div className="flex items-center space-x-2">
                <Input
                  type="radio"
                  id="role1"
                  name="role"
                  value="student"
                  checked={user.role === 'student'}
                  onChange={handleChange}
                />
                <Label htmlFor="role1">Student</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Input
                  type="radio"
                  id="role2"
                  name="role"
                  value="instructor"
                  checked={user.role === 'instructor'}
                  onChange={handleChange}
                />
                <Label htmlFor="role2">Instructor</Label>
              </div>
            </RadioGroup>
          </div>

          {/* Button */}
          <Button type='submit' className="w-full bg-blue-500 hover:bg-blue-600 text-lg py-5 transition-all duration-200">
            Sign Up
          </Button>
        </form>

        {/* Already have account */}
        <p className="text-center mt-6 text-gray-700">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-500 hover:underline font-medium">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
