import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { store } from '@/redux/store';
import axios from 'axios';
import { CheckCircle, Loader2, LogIn } from 'lucide-react';
import React, { useState } from 'react'
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const ForgotPassword = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [email, setEmail] = useState('');
    const [isSubmitted, setIsSubmitted] = useState(false);
    const navigate = useNavigate();
    const { user } = useSelector(store => store.auth);

    const handleForgotPassword = async (e) => {
        e.preventDefault();
        try {
            setIsLoading(true);
            const res = await axios.post(`https://coursecloud.onrender.com/api/v1/user/forgot-password`, { email });
            if (res.data.success) {
                navigate(`/verify-otp/${email}`);
                toast.success(res.data.message);
                setEmail('');
            }

        } catch (error) {
            console.log(error);
        } finally {
            setIsLoading(false);
        }

    }
    return (
        <div className='relative w-full h-[760px] bg-gradient-to-br from-green-50 via-green-100 to-green-200 overflow-hidden'>
            <div className='min-h-screen flex flex-col'>
                {/* main content  */}
                <div className='flex-1 flex items-center justify-center p-4'>
                    <div className='w-full max-w-md space-y-6'>
                        <div className='text-center space-y-2'>
                            <h1 className='text-3xl font-bold tracking-tight text-green-600'>Reset Your password</h1>
                            <p className='text-muted-foreground'>Enter your email address and we'll send you instructions to reset your password</p>
                        </div>
                        <Card className="bg-white/90 backdrop-blur-md shadow-lg rounded-2xl">
                            <CardHeader className='space-y-1'>
                                {
                                    user ? <CardTitle className='text-2xl text-center text-green-600'>Reset Password</CardTitle> :
                                        <CardTitle className='text-2xl text-center text-green-600'>Forgot Password</CardTitle>
                                }
                                <CardDescription className='text-center'>
                                    {
                                        isSubmitted ? "Check your email for reset instructions"
                                            : "Enter your email address to recieve a password reset link"
                                    }
                                </CardDescription>
                            </CardHeader>
                            <CardContent className='space-y-4'>
                                {
                                    error && (
                                        <Alert variant='destructive'>
                                            <AlertDescription>{error}</AlertDescription>
                                        </Alert>
                                    )
                                }
                                {
                                    isSubmitted ? (
                                        <div className='py-6 flex flex-col items-center justify-center text-center space-y-4'>
                                            <div className="py-6 flex flex-col items-center space-y-4 animate-fade-in">
                                                <CheckCircle className="h-10 w-10 text-green-600 animate-bounce" />
                                            </div>
                                            <div className='space-y-2'>
                                                <h3 className='font-medium text-lg'>Check your inbox</h3>
                                                <p className='text-muted-foreground'>We've sent a password reset link to <span className='font-medium text-foreground'>{email}</span></p>
                                                <p>
                                                    If you don't see the email, check your spam folder or{" "}
                                                    <button
                                                        className='text-primary hover:underline font-medium'
                                                        onClick={() => setIsSubmitted(false)}>
                                                        try again
                                                    </button>
                                                </p>
                                            </div>
                                        </div>
                                    ) : (
                                        <form onSubmit={handleForgotPassword} className='space-y-4'>
                                            <div className='space-y-2 relative text-gray-800'>
                                                <Label>Email</Label>
                                                <Input
                                                    className="focus:ring-2 focus:ring-green-500 focus:border-green-500 transition"
                                                    type='email'
                                                    placeholder="Enter your email address"
                                                    value={email}
                                                    onChange={(e) => setEmail(e.target.value)}
                                                    required
                                                    disabled={isLoading}
                                                />
                                            </div>
                                            <Button type='submit' className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700 transition-all duration-200 shadow-md rounded-lg">
                                                {
                                                    isLoading ? (
                                                        <>
                                                            <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                                                            Sending reset link..
                                                        </>
                                                    ) : ("Send reset link")
                                                }
                                            </Button>
                                        </form>
                                    )
                                }
                            </CardContent>
                            <CardFooter className='flex justify-center'>
                                {
                                    user ? <p>
                                        Don't want to reset your password?{" "}
                                        <Link to={'/setting'} className="text-green-600 hover:text-green-700 font-medium underline underline-offset-2">Go back to Setting</Link>
                                    </p> :
                                        <p>
                                            Remember your password?{" "}
                                            <Link to={'/login'} className="text-green-600 hover:text-green-700 font-medium underline underline-offset-2">Sign in</Link>
                                        </p>
                                }
                            </CardFooter>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ForgotPassword