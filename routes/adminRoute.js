import express from 'express';
<<<<<<< HEAD
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
=======
import { addDoctor, loginAdmin, allDoctors, appointmentsAdmin, appointmentCancel, adminDashboard } from '../controllers/adminController.js';
import upload from '../middleware/multer.js';
import authAdmin from '../middleware/authAdmin.js';
>>>>>>> bfa079802a3ab0a16f9d79e8b18915ac48824e97
import { changeAvailability } from '../controllers/doctorController.js';

const adminRouter = express.Router();

<<<<<<< HEAD
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

=======
adminRouter.post('/login', loginAdmin);
adminRouter.post('/add-doctor', authAdmin, upload.single('image'), addDoctor);
adminRouter.post('/all-doctors', authAdmin, allDoctors);
adminRouter.post('/change-availability', authAdmin, changeAvailability);
adminRouter.get('/appointments', authAdmin, appointmentsAdmin);
adminRouter.post('/cancel-appointment', authAdmin, appointmentCancel);
>>>>>>> bfa079802a3ab0a16f9d79e8b18915ac48824e97
adminRouter.get('/dashboard', authAdmin, adminDashboard);

export default adminRouter;
