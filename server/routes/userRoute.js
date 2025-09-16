import express from 'express'
import { changePassword, forgotPassword, getEnrolledCourses, login, logout, register, updateProfile, verification, verifyOTP } from '../controllers/userControllers.js';
import { isAuthenticated } from '../middleware/isAuthenticated.js';
import { singleUpload } from '../middleware/multer.js';
import { userSchema, validateUser } from '../validators/userValidate.js';

const router=express.Router();

router.post('/register',validateUser(userSchema),register);
router.post('/verify',verification);
router.post('/login',login);
router.post('/logout',isAuthenticated, logout);
router.put('/profile/update',isAuthenticated,singleUpload, updateProfile);
router.post('/forgot-password',forgotPassword);
router.post('/verify-otp/:email',verifyOTP);
router.post('/change-password/:email',changePassword);

router.get("/enrolled", isAuthenticated, getEnrolledCourses);

export default router;