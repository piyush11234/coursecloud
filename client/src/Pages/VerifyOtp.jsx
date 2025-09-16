import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import axios from 'axios'
import { CheckCircle, Loader2, RotateCcw } from 'lucide-react'
import React, { useEffect, useRef, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'

const VerifyOTP = () => {
  const [isVerified, setIsVerified] = useState(false)
  const [error, setError] = useState("")
  const [successMessage, setSuccessMessage] = useState("")
  const [otp, setOtp] = useState(["", "", "", "", "", ""])
  const [isLoading, setIsLoading] = useState(false)
  const inputRefs = useRef([])
  const { email } = useParams()
  const navigate = useNavigate()

  // handle OTP change
  const handleChange = (index, value) => {
    if (value.length > 1) return
    setError("") // clear error on typing
    const updatedOtp = [...otp]
    updatedOtp[index] = value
    setOtp(updatedOtp)
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  // verify OTP
  const handleVerify = async () => {
    const finalOtp = otp.join("")
    if (finalOtp.length !== 6) {
      setError("Please enter all 6 digits")
      return
    }

    try {
      setIsLoading(true)
      const res = await axios.post(`https://coursecloud.onrender.com/api/v1/user/verify-otp/${email}`, {
        otp: finalOtp,
      })
      setSuccessMessage(res.data.message)
      setIsVerified(true)

      // redirect after short delay
      setTimeout(() => {
        navigate(`/change-password/${email}`)
      }, 2000)
    } catch (error) {
      setError(error.response?.data?.message || "Something went wrong")
    } finally {
      setIsLoading(false)
    }
  }

  // clear OTP
  const clearOtp = () => {
    setOtp(["", "", "", "", "", ""])
    setError("")
    inputRefs.current[0]?.focus()
  }

  // auto-focus first input
  useEffect(() => {
    inputRefs.current[0]?.focus()
  }, [])

  return (
    <div className='min-h-screen bg-green-100 flex flex-col'>
      <div className='flex-1 flex items-center justify-center p-4'>
        <div className='w-full max-w-md space-y-6'>
          <div className='text-center space-y-2'>
            <h1 className='text-3xl font-bold tracking-tight text-green-600'>Verify your email</h1>
            <p className='text-muted-foreground'>
              We've sent a 6-digit verification code to <span className='font-medium'>{email}</span>
            </p>
          </div>

          <Card className='shadow-lg'>
            <CardHeader className='space-y-1'>
              <CardTitle className='text-2xl text-center text-green-600'>Enter verification code</CardTitle>
              <CardDescription className='text-center'>
                {isVerified
                  ? "Code verified successfully! Redirecting..."
                  : "Enter the 6-digit code sent to your email"}
              </CardDescription>
            </CardHeader>

            <CardContent className='space-y-6'>
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {successMessage && (
                <p className='text-green-500 text-sm mb-3 text-center'>{successMessage}</p>
              )}

              {isVerified ? (
                <div className="py-8 px-6 flex flex-col items-center justify-center text-center space-y-5 bg-white rounded-2xl shadow-md max-w-md mx-auto">
                  {/* Success Icon */}
                  <div className="bg-gradient-to-r from-green-500 to-emerald-400 rounded-full p-4 shadow-md animate-bounce">
                    <CheckCircle className="h-8 w-8 text-white" />
                  </div>

                  <div className="space-y-2">
                    <h3 className="font-semibold text-xl text-gray-900">Verification Successful 🎉</h3>
                    <p className="text-sm text-gray-500 leading-relaxed">
                      Your email has been verified. You’ll be redirected shortly to reset your password.
                    </p>
                  </div>

                  <div className="flex items-center space-x-2 bg-gray-100 px-4 py-2 rounded-full">
                    <Loader2 className="h-4 w-4 animate-spin text-green-600" />
                    <span className="text-sm text-gray-600">Redirecting...</span>
                  </div>
                </div>
              ) : (
                <>
                  {/* OTP input */}
                  <div className="flex gap-3 mb-6 justify-center">
                    {otp.map((digit, index) => (
                      <Input
                        key={index}
                        type="text"
                        onChange={(e) => handleChange(index, e.target.value)}
                        maxLength={1}
                        ref={(el) => (inputRefs.current[index] = el)}
                        value={digit}
                        className="w-12 h-12 text-center text-xl font-bold rounded-lg border-2 border-gray-300 focus:border-green-600 focus:ring-2 focus:ring-green-200 transition-all"
                      />
                    ))}
                  </div>

                  {/* Action buttons */}
                  <div className="space-y-3">
                    <Button
                      onClick={handleVerify}
                      disabled={isLoading || otp.some((digit) => digit === "")}
                      className="bg-green-600 hover:bg-green-700 w-full rounded-lg shadow-md"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Verifying
                        </>
                      ) : (
                        "Verify Code"
                      )}
                    </Button>

                    <Button
                      onClick={clearOtp}
                      variant="outline"
                      className="w-full rounded-lg border-gray-300 hover:bg-gray-100"
                      disabled={isLoading || isVerified}
                    >
                      <RotateCcw className="mr-2 h-4 w-4" />
                      Clear
                    </Button>
                  </div>
                </>
              )}
            </CardContent>

            <CardFooter className='flex justify-center'>
              <p className='text-sm text-muted-foreground'>
                Wrong email?{" "}
                <Link to={'/forgot-password'} className='text-green-600 hover:underline font-medium'>
                  Go back
                </Link>
              </p>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default VerifyOTP
