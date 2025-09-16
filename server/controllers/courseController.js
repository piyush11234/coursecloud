import { Course } from "../models/courseModel.js";
import { Lecture } from "../models/lectureModel.js";
import { User } from "../models/userModel.js";
import cloudinary from "../utils/cloudinary.js";
import getDataUri from "../utils/dataUri.js";


export const createCourse = async (req, res) => {
    try {
        const { courseTitle, category } = req.body;
        if (!courseTitle || !category) {
            return res.status(400).json({
                success: false,
                message: "Course title and category is required",
            })
        }

        const course = await Course.create({
            courseTitle,
            category,
            creator: req.userId
        })
        return res.status(201).json({
            success: true,
            message: "Course created successfully",
            course
        })

    } catch (error) {
        console.error("Create course error:", error);
        return res.status(500).json({
            success: false,
            message: 'Failed to create course...'
        })

    }
}

export const getPublishhedCourse = async (_, res) => {
    try {
        const courses = await Course.find({ isPublished: true }).populate({ path: "creator", select: "name photoUrl description" })
        if (!courses) {
            return res.status(404).json({
                message: "Course not found"
            })
        }
        return res.status(200).json({
            success: true,
            courses
        })

    } catch (error) {
        console.log(error)
        return res.status(500).json({
            message: "Failed to get course",
            success: false
        })
    }
}

export const getCreatorCourse = async (req, res) => {
    try {
        const userId = req.userId;
        const courses = await Course.find({ creator: userId }).populate('lectures');
        if (!courses) {
            return res.status(404).json({
                message: "Course not found",
                courses: [],
                success: false
            })
        }
        return res.status(200).json({
            success: true,
            courses
        })

    } catch (error) {
        console.log(error)
        return res.status(500).json({
            message: "Failed to get course",
            success: false
        })
    }
}


export const editCourse = async (req, res) => {
    try {
        const courseId = req.params.courseId;
        const { courseTitle, subTitle, description, category, courseLevel, coursePrice } = req.body;
        const file = req.file;

        let course = await Course.findById(courseId).populate("lectures");
        if (!course) {
            return res.status(404).json({
                success: false,
                message: 'Course not found',
            });
        }

        let updateData = {};

        if (courseTitle) updateData.courseTitle = courseTitle;
        if (subTitle) updateData.subTitle = subTitle;
        if (description) updateData.description = description;
        if (category) updateData.category = category;
        if (courseLevel) updateData.courseLevel = courseLevel;
        if (coursePrice) updateData.coursePrice = coursePrice;

        if (file) {
            const fileUri = getDataUri(file);
            const uploadedImage = await cloudinary.uploader.upload(fileUri);
            updateData.courseThumbnail = uploadedImage.secure_url;
        }

        course = await Course.findByIdAndUpdate(courseId, updateData, { new: true });

        return res.status(200).json({
            success: true,
            message: "Course updated successfully",
            course,
        });

    } catch (error) {
        console.error("Error in editCourse:", error);
        return res.status(500).json({
            success: false,
            message: 'Failed to update course information. Please try again.',
            error: error.message, // helpful in dev
        });
    }
};


export const getCourseById = async (req, res) => {
    try {
        const { courseId } = req.params;
        const course = await Course.findById(courseId)
            .populate("creator", "name photoUrl description") // ✅ populate instructor
            .populate("lectures");;
        if (!course) {
            return res.status(404).json({
                success: false,
                message: 'Course not found'
            })
        }
        return res.status(200).json({
            success: true,
            course
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            message: "Failed to get course",
            success: false
        })
    }
}

// student enrollment 

export const enrollUserInCourse = async (userId, courseId) => {
    // Add to user and course safely (no duplicates)
    await User.findByIdAndUpdate(userId, { $addToSet: { enrolledCourses: courseId } });
    await Course.findByIdAndUpdate(courseId, { $addToSet: { enrolledStudents: userId } });
};

export const enrollCourse = async (req, res) => {
    try {
        const { courseId } = req.params;
        const userId = req.userId; // from auth middleware

        // check if course exists
        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({ success: false, message: "Course not found" });
        }

        // check if already enrolled
        if (course.enrolledStudents.includes(userId)) {
            return res.status(400).json({ success: false, message: "Already enrolled" });
        }

        // push user to course
        course.enrolledStudents.push(userId);
        await course.save();

        // optional: also store enrolledCourses in User model
        await User.findByIdAndUpdate(userId, { $addToSet: { enrolledCourses: courseId } });

        return res.status(200).json({
            success: true,
            message: "Successfully enrolled",
            course,
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ success: false, message: "Enrollment failed" });
    }
};

export const checkEnrollment = async (req, res) => {
    try {
        const { courseId } = req.params
        const userId = req.userId

        const user = await User.findById(userId)
        if (!user) return res.status(404).json({ success: false, isEnrolled: false })

        const isEnrolled = user.enrolledCourses.includes(courseId)
        return res.status(200).json({ success: true, isEnrolled })
    } catch (err) {
        console.error(err)
        return res.status(500).json({ success: false, isEnrolled: false })
    }
}


// Get all courses with enrolled student details
export const getAllCoursesWithStudents = async (req, res) => {
  try {
    const courses = await Course.find()
      .populate("enrolledStudents", "name email photoUrl") // only return needed fields
      .exec();

    if (!courses || courses.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No courses found"
      });
    }

    return res.status(200).json({
      success: true,
      courses
    });
  } catch (err) {
    console.error("Error fetching courses with students:", err);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch courses"
    });
  }
};







// Simulating Payment Success (later integrate Razorpay/Stripe/PayPal)
export const confirmEnrollment = async (req, res) => {
    try {
        const { courseId } = req.params;
        const userId = req.userId;

        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({ success: false, message: "Course not found" });
        }

        // Check if already enrolled
        if (course.enrolledStudents.includes(userId)) {
            return res.status(400).json({ success: false, message: "Already enrolled" });
        }

        // ✅ Add user to course and course to user
        await User.findByIdAndUpdate(userId, { $addToSet: { enrolledCourses: courseId } });
        await Course.findByIdAndUpdate(courseId, { $addToSet: { enrolledStudents: userId } });

        return res.status(200).json({
            success: true,
            message: "Enrollment successful!",
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ success: false, message: "Enrollment failed" });
    }
};





// Lecture controllers

// export const createLecture = async (req, res) => {
//     try {
//         const { lectureTitle } = req.body;
//         const { courseId } = req.params;

//         if (!lectureTitle || !courseId) {
//             return res.status(400).json({
//                 message: "Lecture title is required"
//             })
//         }
//         const lecture = await Lecture.create({ lectureTitle });
//         const course = await Course.findById(courseId);
//         if (course) {
//             course.lectures.push(lecture._id);
//             await course.save()
//         }
//         return res.status(201).json({
//             success: true,
//             lecture,
//             message: "Lecture created successfully"
//         })
//     } catch (error) {
//         console.log(error);
//         return res.status(500).json({
//             message: "Failed to create Lecture"
//         })

//     }
// }

export const createLecture = async (req, res) => {
    try {
        const { lectureTitle } = req.body;
        const { courseId } = req.params;

        if (!lectureTitle || !courseId) {
            return res.status(400).json({
                success: false,
                message: "Lecture title and Course ID are required",
            });
        }

        // Create lecture with default values
        const lecture = await Lecture.create({
            lectureTitle,
            videoUrl: "",
            publicId: "",
            isPreviewFree: false,
        });

        // Attach lecture to course
        const course = await Course.findById(courseId);
        if (course) {
            course.lectures.push(lecture._id);
            await course.save();
        }

        return res.status(201).json({
            success: true,
            lecture,
            message: "Lecture created successfully",
        });
    } catch (error) {
        console.error("Create lecture error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to create lecture",
            error: error.message,
        });
    }
};





export const getCourseLecture = async (req, res) => {
    try {
        const { courseId } = req.params;
        const course = await Course.findById(courseId).populate('lectures');
        if (!course) {
            return res.status(404).json({
                message: "course not found"
            })
        }
        return res.status(200).json({
            success: true,
            lectures: course.lectures
        })

    } catch (error) {
        console.error("Get lectures error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to get lectures",
            error: error.message,
        });
    }
}

export const editLecture = async (req, res) => {
    try {


        const { lectureTitle, videoInfo, isPreviewFree } = req.body;
        const { courseId, lectureId } = req.params;

        const lecture = await Lecture.findById(lectureId);
        if (!lecture) {
            console.log("Lecture not found in DB!");
            return res.status(404).json({ success: false, message: "Lecture not found!" });
        }

        // update lecture
        if (lectureTitle) lecture.lectureTitle = lectureTitle;
        if (videoInfo?.videoUrl) lecture.videoUrl = videoInfo.videoUrl;
        if (videoInfo?.publicId) lecture.publicId = videoInfo.publicId;
        lecture.isPreviewFree = isPreviewFree;

        await lecture.save();
        console.log("Lecture updated:", lecture);

        const course = await Course.findById(courseId);
        if (!course) {
            console.log("Course not found in DB!");
        } else if (!course.lectures.includes(lecture._id)) {
            course.lectures.push(lecture._id);
            await course.save();
            console.log("Course updated with lecture:", course);
        }

        return res.status(200).json({
            success: true,
            lecture,
            message: "Lecture updated successfully"
        });

    } catch (error) {
        console.error("Edit lecture error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to edit lecture",
            error: error.message,
        });
    }
};


// export const editLecture = async (req, res) => {
//     try {
//         const { lectureTitle, videoUrl, publicId, isPreviewFree } = req.body;
//         const { lectureId } = req.params;

//         const lecture = await Lecture.findById(lectureId);
//         if (!lecture) {
//             return res.status(404).json({ success: false, message: "Lecture not found" });
//         }

//         if (lectureTitle !== undefined) lecture.lectureTitle = lectureTitle;
//         if (videoUrl !== undefined) lecture.videoUrl = videoUrl;
//         if (publicId !== undefined) lecture.publicId = publicId;
//         if (isPreviewFree !== undefined) lecture.isPreviewFree = isPreviewFree;

//         await lecture.save();

//         return res.status(200).json({
//             success: true,
//             lecture,
//             message: "Lecture updated successfully",
//         });
//     } catch (error) {
//         console.log(error);
//         return res.status(500).json({ success: false, message: "Failed to update lecture" });
//     }
// };




export const removeLecture = async (req, res) => {
    try {
        const { lectureId } = req.params;
        const lecture = await Lecture.findByIdAndDelete(lectureId);
        if (!lecture) {
            return res.status(404).json({
                success: false,
                message: "Lecture not found"
            })
        }
        //Remove the lecture refference from the associated course
        await Course.updateOne(
            { lectures: lectureId }, //find the course that contains the lecture
            { $pull: { lectures: lectureId } } // Remove the lectures id from the lectures array
        );
        return res.status(200).json({
            success: true,
            message: "Lecture removed successfully"
        })
    } catch (error) {
        console.error("Remove lecture error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to remove lecture",
            error: error.message,
        });
    }
}

export const togglePublishedCourse = async (req, res) => {
    try {
        const { courseId } = req.params;
        const { publish } = req.query;
        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({
                success: false,
                message: 'Course not found'
            })
        }
        course.isPublished = !course.isPublished;
        await course.save();
        const statusMessage = course.isPublished ? 'Published' : 'Unpublished';
        return res.status(200).json({
            success: true,
            message: `Course is ${statusMessage}`
        })
    } catch (error) {
        console.error("Status update error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to update status",
            error: error.message,
        });
    }
}