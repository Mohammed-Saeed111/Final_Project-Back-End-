import express from 'express';
<<<<<<< HEAD
import upload from '../middleware/multer.js';
import authUser from '../middleware/authUser.js';
import validate from '../middleware/validate.js';
import {
    registerUserSchema,
    loginUserSchema,
    bookAppointmentSchema,
    cancelAppointmentUserSchema,
    updateUserProfileSchema,
    paymentSchema,
    verifyRazorpaySchema,
} from '../validations/userValidation.js';
import {
    registerUser,
    loginUser,
    getProfile,
    updateProfile,
    bookAppointment,
    listAppointment,
    cancelAppointment,
    paymentRazorpay,
    verifyRazorpay,
} from '../controllers/userController.js';

const userRouter = express.Router();

// ─── Public ───────────────────────────────────────────────────────────────────
userRouter.post('/register', validate(registerUserSchema), registerUser);
userRouter.post('/login', validate(loginUserSchema), loginUser);

// ─── Protected (user auth required) ──────────────────────────────────────────
userRouter.get('/get-profile', authUser, getProfile);

// multer MUST run before validate() on multipart routes so req.body is populated
userRouter.post(
    '/update-profile',
    upload.single('image'),
    authUser,
    validate(updateUserProfileSchema),
    updateProfile
);

userRouter.post('/book-appointment', authUser, validate(bookAppointmentSchema), bookAppointment);

userRouter.get('/appointments', authUser, listAppointment);

userRouter.post('/cancel-appointment', authUser, validate(cancelAppointmentUserSchema), cancelAppointment);

// ─── Payments ─────────────────────────────────────────────────────────────────
userRouter.post('/payment-razorpay', authUser, validate(paymentSchema), paymentRazorpay);
userRouter.post('/verify-razorpay', authUser, validate(verifyRazorpaySchema), verifyRazorpay);

// ─── Test Cloudinary Connection ───────────────────────────────────────────────
userRouter.get('/test-cloudinary', async (req, res) => {
    try {
        const { v2: cloudinary } = await import('cloudinary');
        const result = await cloudinary.v2.api.resources({ max_results: 1 });
        res.json({ 
            success: true, 
            message: 'Cloudinary credentials OK',
            cloudName: process.env.CLOUDINARY_NAME,
            totalResources: result.total_count
        });
    } catch (error) {
        console.error('Cloudinary test error:', error);
        res.status(400).json({ 
            success: false, 
            message: `Cloudinary test failed: ${error.message}`
        });
    }
});
=======
import { registerUser, loginUser, getProfile, updateProfile, bookAppointment, listAppointment, cancelAppointment, paymentRazorpay, verifyRazorpay } from '../controllers/userController.js';
import authUser from '../middleware/authUser.js';
import upload from '../middleware/multer.js';

const userRouter = express.Router();

userRouter.post('/register', registerUser);
userRouter.post('/login', loginUser);
userRouter.get('/get-profile', authUser, getProfile);
userRouter.post('/update-profile', upload.single('image'), authUser, updateProfile);
userRouter.post('/book-appointment', authUser, bookAppointment);
userRouter.get('/appointments', authUser, listAppointment);
userRouter.post('/cancel-appointment', authUser, cancelAppointment);
userRouter.post('/payment-razorpay', authUser, paymentRazorpay);
userRouter.post('/verify-razorpay', authUser, verifyRazorpay);
>>>>>>> bfa079802a3ab0a16f9d79e8b18915ac48824e97

export default userRouter;
