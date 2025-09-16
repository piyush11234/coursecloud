import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { setLecture } from '@/redux/lectureSlice'
import { store } from '@/redux/store'
import axios from 'axios'
import { Loader2, UploadCloud } from 'lucide-react'
import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'sonner'

const LectureTab = () => {
  const { lectureId, courseId } = useParams()
  const { lecture } = useSelector(store => store.lecture)
  const selectedLecture = lecture.find(l => l._id === lectureId)

  const [lectureTitle, setLectureTitle] = useState(selectedLecture?.lectureTitle || "")
  const [isFree, setIsFree] = useState(selectedLecture?.isPreviewFree || false)
  const [videoPreview, setVideoPreview] = useState(selectedLecture?.videoUrl || null)
  const [uploadVideoInfo, setUploadVideoInfo] = useState(null)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [mediaProgress, setMediaProgress] = useState(false)
  const [loading, setLoading] = useState(false)
  const [removeLoading, setRemoveLoading] = useState(false)

  const navigate = useNavigate()
  const dispatch = useDispatch()

  // ----------------- Video Upload -----------------
  const handleFileChange = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    const formData = new FormData()
    formData.append('file', file)
    setVideoPreview(URL.createObjectURL(file))
    setMediaProgress(true)

    try {
      const res = await axios.post(
        "http://localhost:3000/api/v1/media/upload-video",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          onUploadProgress: ({ loaded, total }) => setUploadProgress(Math.round((loaded * 100) / total))
        }
      )

      if (res.data.success) {
        const { url, publicId } = res.data.data
        setUploadVideoInfo({ videoUrl: url, publicId })
        setVideoPreview(url)
        toast.success(res.data.message)
      }

    } catch (error) {
      console.error(error)
      toast.error("Video upload failed")
    } finally {
      setMediaProgress(false)
    }
  }

  // ----------------- Edit Lecture -----------------
  const editLectureHandler = async (e) => {
    e.preventDefault()
    const data = {
      lectureTitle,
      isPreviewFree: isFree,
      ...(uploadVideoInfo && { videoInfo: uploadVideoInfo }) // only send if new video uploaded
    }

    try {
      setLoading(true)
      const res = await axios.put(
        `http://localhost:3000/api/v1/course/${courseId}/lecture/${lectureId}`,
        data,
        { headers: { "Content-Type": "application/json" }, withCredentials: true }
      )

      if (res.data.success) {
        dispatch(
          setLecture(
            lecture.map(l => l._id === res.data.lecture._id ? res.data.lecture : l)
          )
        )
        toast.success(res.data.message)
      }
    } catch (error) {
      console.error(error)
      toast.error("Failed to edit lecture")
    } finally {
      setLoading(false)
    }
  }

  // ----------------- Remove Lecture -----------------
  const removeLectureHandler = async (e) => {
    e.preventDefault()
    try {
      setRemoveLoading(true)
      const res = await axios.delete(
        `http://localhost:3000/api/v1/course/lecture/${lectureId}`,
        { withCredentials: true }
      )
      if (res.data.success) {
        toast.success(res.data.message)
        navigate(`/admin/course/${courseId}/lecture`)
      } else toast.error(res.data.message)
    } catch (error) {
      console.error(error)
      toast.error("Failed to delete lecture")
    } finally {
      setRemoveLoading(false)
    }
  }

  return (
    <Card className="shadow-lg rounded-xl border border-gray-200">
      <CardHeader className="flex justify-between items-center border-b pb-4">
        <div>
          <CardTitle className="text-xl font-bold text-gray-800 text-left">Edit Lecture</CardTitle>
          <CardDescription className="text-gray-500">Make changes and click save when done.</CardDescription>
        </div>
        <Button
          onClick={removeLectureHandler}
          disabled={removeLoading}
          variant="destructive"
          className="cursor-pointer"
        >
          {removeLoading ? <><Loader2 className="mr-1 w-4 h-4 animate-spin" /> Please wait</> : "Remove Lecture"}
        </Button>
      </CardHeader>

      <CardContent className="space-y-6 mt-4">
        {/* Title */}
        <div>
          <Label className="text-gray-700">Title</Label>
          <Input
            type="text"
            value={lectureTitle}
            onChange={e => setLectureTitle(e.target.value)}
            placeholder="Enter lecture title"
            className="bg-white mt-2"
          />
        </div>

        {/* Video Upload */}
        <div>
          <Label className="text-gray-700">Video <span className="text-red-500">*</span></Label>
          <label
            htmlFor="videoUpload"
            className="flex flex-col items-center justify-center mt-3 border-2 border-dashed border-gray-300 rounded-lg p-6 cursor-pointer hover:bg-gray-50 transition"
          >
            <UploadCloud className="w-10 h-10 text-gray-500 mb-2" />
            <span className="text-sm font-medium text-gray-700">Upload Video</span>
            <p className="text-xs text-gray-500 mt-1">MP4, MOV, or AVI formats (max 500MB)</p>
            <Input
              id="videoUpload"
              type="file"
              accept="video/*"
              onChange={handleFileChange}
              className="hidden"
            />
          </label>

          {videoPreview && (
            <div className="mt-4 flex justify-center">
              <video
                src={videoPreview}
                controls
                className="w-full max-w-md max-h-64 rounded-md shadow-md object-contain"
              />
            </div>
          )}
        </div>

        {/* Free Preview Toggle */}
        <div className="flex items-center space-x-2">
          <Switch checked={isFree} onCheckedChange={setIsFree} className="bg-gray-800 cursor-pointer" />
          <Label className="text-gray-700">Is this video FREE?</Label>
        </div>

        {/* Upload Progress */}
        {mediaProgress && (
          <div className="my-4">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
            <p className="text-sm text-gray-600 mt-1">{uploadProgress}% uploaded</p>
          </div>
        )}

        {/* Update Button */}
        <div className="pt-2">
          <Button
            disabled={loading}
            onClick={editLectureHandler}
            className="cursor-pointer w-full bg-gray-800 hover:bg-gray-900"
          >
            {loading ? <><Loader2 className="mr-1 w-4 h-4 animate-spin" /> Please wait</> : "Update Lecture"}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

export default LectureTab
