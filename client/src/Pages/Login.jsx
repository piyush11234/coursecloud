import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setUser } from "@/redux/authSlice";
import { Eye, EyeOff } from "lucide-react";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [input, setInput] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInput(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setIsLoading(true);
      const res = await axios.post(
        "https://coursecloud.onrender.com/api/v1/user/login",
        input,
        { headers: { "Content-Type": "application/json" }, withCredentials: true }
      );

      if (res.data.success) {
        // Update Redux state safely
        dispatch(setUser({
          user: res.data.user || null,
          accessToken: res.data.accessToken || null,
          refreshToken: res.data.refreshToken || null,
        }));

        // Optionally store accessToken in localStorage for API calls
        if (res.data.accessToken) {
          localStorage.setItem("accessToken", res.data.accessToken);
        }

        navigate('/');
        toast.success(res.data.message);
      } else {
        toast.error(res.data.message || "Something went wrong");
      }
    } catch (error) {
      console.error("Login error:", error.response?.data?.message || error.message);
      toast.error(error.response?.data?.message || "Login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-gray-100 p-4">
      <div className="bg-white shadow-xl rounded-2xl p-8 max-w-md w-full border border-gray-200">
        <h1 className="text-3xl font-extrabold text-center bg-gradient-to-r from-blue-500 to-indigo-600 bg-clip-text text-transparent">
          Welcome Back
        </h1>
        <p className="text-center text-gray-600 mt-2 mb-8">
          Access your account and continue learning 🌟
        </p>

        <form onSubmit={handleSubmit}>
          <div className="mb-5">
            <Label htmlFor="email">Email</Label>
            <Input
              type="email"
              id="email"
              name="email"
              value={input.email}
              onChange={handleChange}
              placeholder="Enter your email"
              className="mt-2 focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div className="mb-5 ">
            <div className="flex justify-between items-center mb-1">
              <Label htmlFor="password">Password</Label>
              <Link
                className="text-sm font-medium text-blue-600 hover:text-blue-700 hover:underline transition"
                to="/forgot-password"
              >
                Forgot your password?
              </Link>
            </div>
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                value={input.password}
                onChange={handleChange}
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

          <Button
            type="submit"
            className="cursor-pointer w-full bg-blue-500 hover:bg-blue-600 text-lg py-5 transition-all duration-200"
            disabled={isLoading}
          >
            {isLoading ? "Logging in..." : "Login"}
          </Button>
        </form>

        <div className="flex items-center my-6">
          <hr className="flex-grow border-gray-300" />
          <span className="mx-3 text-gray-500">OR</span>
          <hr className="flex-grow border-gray-300" />
        </div>

        <p className="text-center mt-6 text-gray-700">
          Don't have an account?{" "}
          <Link to="/signup" className="text-blue-500 hover:underline font-medium">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
