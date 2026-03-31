import express from 'express';
import upload from '../middleware/multer.js';
import authAdmin from '../middleware/authAdmin.js';
import validate from '../middleware/validate.js';
import {
    loginAdminSchema,
    addDoctorSchema,
    cancelAppointmentAdminSchema,
    changeAvailabilitySchema,
} from '../validations/adminValidation.js';
import {
    loginAdmin,
    addDoctor,
    allDoctors,
    appointmentsAdmin,
    appointmentCancel,
    adminDashboard,
} from '../controllers/adminController.js';
import { changeAvailability } from '../controllers/doctorController.js';

const adminRouter = express.Router();

// ─── Public ───────────────────────────────────────────────────────────────────
adminRouter.post('/login', validate(loginAdminSchema), loginAdmin);

// ─── Protected (admin auth required) ─────────────────────────────────────────
// multer MUST run before validate() on multipart routes so req.body is populated
adminRouter.post(
    '/add-doctor',
    authAdmin,
    upload.single('image'),
    (req, res, next) => {
        // File presence guard – kept here so the image check stays close to the upload
        if (!req.file) {
            return res.status(400).json({ success: false, message: 'Doctor image is required.' });
        }
        next();
    },
    validate(addDoctorSchema),
    addDoctor
);

adminRouter.get('/all-doctors', authAdmin, allDoctors);

adminRouter.post('/change-availability', authAdmin, validate(changeAvailabilitySchema), changeAvailability);

adminRouter.get('/appointments', authAdmin, appointmentsAdmin);

adminRouter.post('/cancel-appointment', authAdmin, validate(cancelAppointmentAdminSchema), appointmentCancel);
adminRouter.get('/dashboard', authAdmin, adminDashboard);

export default adminRouter;
