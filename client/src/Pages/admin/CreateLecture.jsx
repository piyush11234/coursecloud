import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { setLecture } from '@/redux/lectureSlice';
import axios from 'axios';
import { Edit, Loader2 } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';

const CreateLecture = () => {
  const params = useParams();
  const [loading, setLoading] = useState(false);
  const [lectureTitle, setLectureTitle] = useState('');
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { lecture } = useSelector((store) => store.lecture);

  // ✅ Fetch lectures function
  const getLectures = async () => {
    try {
      const res = await axios.get(
        `https://coursecloud.onrender.com/api/v1/course/${params?.courseId}/lecture`,
        { withCredentials: true }
      );
      console.log("Lecture API Response:", res.data); // Debug
      if (res.data.success) {
        dispatch(setLecture(res.data.lectures));
      }
    } catch (error) {
      console.log(error);
      toast.error('Failed to fetch lectures');
    }
  };

  // ✅ Create lecture function
  const createLectureHandler = async () => {
    try {
      setLoading(true);
      const res = await axios.post(
        `https://coursecloud.onrender.com/api/v1/course/${params?.courseId}/lecture`,
        { lectureTitle },
        {
          headers: {
            'Content-Type': 'application/json',
          },
          withCredentials: true,
        }
      );

      if (res.data.success) {
        toast.success(res.data.message);
        setLectureTitle('');
        await getLectures(); // ✅ Auto refresh after creation
      } else {
        toast.error('Something went wrong');
      }
    } catch (error) {
      console.log(error);
      toast.error('Failed to create lecture');
    } finally {
      setLoading(false);
    }
  };

  // ✅ Run only when courseId changes
  useEffect(() => {
    getLectures();
  }, [params.courseId]);

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-10">
      <div className="bg-white rounded-xl shadow-md p-6 md:p-10">
        {/* Heading */}
        <h1 className="text-3xl font-bold mb-3 text-gray-800">
          Let’s Add <span className="text-blue-600">Lectures</span>
        </h1>

        {/* Subtext */}
        <p className="text-gray-600 text-base md:text-lg leading-relaxed max-w-2xl mx-auto text-center">
          Start building your course by adding lectures one by one.
          You can include videos, PDFs, notes, or any resources that
          help learners understand the concept better.
        </p>

        {/* Input Section */}
        <div className="mt-8 space-y-4">
          <div>
            <Label className="text-gray-700">Lecture Title</Label>
            <Input
              type="text"
              value={lectureTitle}
              onChange={(e) => setLectureTitle(e.target.value)}
              placeholder="Enter lecture name"
              className="bg-white mt-2 w-full border-gray-300 focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Buttons */}
        <div className="flex flex-col md:flex-row gap-3 mt-6">
          <Button
            onClick={() => navigate(`/admin/course/${params.courseId}`)}
            variant="outline"
            className="w-full md:w-auto cursor-pointer"
          >
            Back to Course
          </Button>
          <Button
            disabled={loading}
            onClick={createLectureHandler}
            className="cursor-pointer w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Please wait
              </>
            ) : (
              'Create Lecture'
            )}
          </Button>
        </div>

        {/* Lecture List */}
        <div className="mt-10">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">
            Existing Lectures
          </h2>
          {lecture?.length > 0 ? (
            <div className="space-y-3">
              {lecture.map((lec, index) => (
                <div
                  key={lec._id}
                  className="flex items-center justify-between bg-gray-50 hover:bg-gray-100 transition rounded-lg px-5 py-3 shadow-sm border"
                >
                  <div className="flex items-center gap-3">
                    <span className="bg-blue-100 text-blue-700 text-sm font-semibold px-3 py-1 rounded-full">
                      {index + 1}
                    </span>
                    <h1 className="font-medium text-gray-800">
                      {lec.lectureTitle}
                    </h1>
                  </div>
                  <Edit
                    onClick={() => navigate(`${lec._id}`)}
                    size={20}
                    className="cursor-pointer text-gray-600 hover:text-blue-600 transition"
                  />
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 italic">No lectures added yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreateLecture;
