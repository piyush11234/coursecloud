import express from 'express'
import { isAuthenticated } from '../middleware/isAuthenticated.js';
import { checkEnrollment, confirmEnrollment, createCourse, createLecture, editCourse, editLecture, enrollCourse, getAllCoursesWithStudents, getCourseById, getCourseLecture, getCreatorCourse, getPublishhedCourse, removeLecture, togglePublishedCourse } from '../controllers/courseController.js';
import { singleUpload } from '../middleware/multer.js';

const router =express.Router();

// admin route
router.get("/admin/all-courses",isAuthenticated, getAllCoursesWithStudents);

router.post('/',isAuthenticated,createCourse);
router.get('/published-courses',getPublishhedCourse);
router.get('/',isAuthenticated,getCreatorCourse);
router.put('/:courseId',isAuthenticated, singleUpload ,editCourse);
router.get('/:courseId',isAuthenticated,getCourseById);
router.patch('/:courseId',togglePublishedCourse);

//course enroll route
router.post('/:courseId/enroll',isAuthenticated,enrollCourse);
router.post("/:courseId/confirm-enroll", isAuthenticated, confirmEnrollment);
router.get("/:courseId/check-enrollment", isAuthenticated, checkEnrollment)




//lecture routes
router.post('/:courseId/lecture',isAuthenticated,createLecture);
router.get('/:courseId/lecture',isAuthenticated,getCourseLecture);
router.put('/:courseId/lecture/:lectureId',isAuthenticated,editLecture);
router.delete('/lecture/:lectureId',isAuthenticated,removeLecture);
export default router;