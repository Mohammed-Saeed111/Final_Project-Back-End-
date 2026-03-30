import express from 'express';
<<<<<<< HEAD
import authDoctor from '../middleware/authDoctor.js';
import validate from '../middleware/validate.js';
import {
    loginDoctorSchema,
    appointmentActionSchema,
    updateDoctorProfileSchema,
} from '../validations/doctorValidation.js';
import {
    doctorList,
    loginDoctor,
    appointmentsDoctor,
    appointmentComplete,
    appointmentCancel,
    doctorDashboard,
    doctorProfile,
    updateDoctorProfile,
} from '../controllers/doctorController.js';

const doctorRouter = express.Router();

// ─── Public ───────────────────────────────────────────────────────────────────
doctorRouter.get('/list', doctorList);
doctorRouter.post('/login', validate(loginDoctorSchema), loginDoctor);

// ─── Protected (doctor auth required) ────────────────────────────────────────
// authDoctor runs first on all protected routes – it injects docId into req.body
doctorRouter.get('/appointments', authDoctor, appointmentsDoctor);

doctorRouter.post(
    '/complete-appointment',
    authDoctor,
    validate(appointmentActionSchema),
    appointmentComplete
);

doctorRouter.post(
    '/cancel-appointment',
    authDoctor,
    validate(appointmentActionSchema),
    appointmentCancel
);

doctorRouter.get('/dashboard', authDoctor, doctorDashboard);

doctorRouter.get('/profile', authDoctor, doctorProfile);

doctorRouter.post(
    '/update-profile',
    authDoctor,
    validate(updateDoctorProfileSchema),
    updateDoctorProfile
);
=======
import { doctorList, loginDoctor, appointmentsDoctor, appointmentComplete, appointmentCancel, doctorDashboard, doctorProfile, updateDoctorProfile } from '../controllers/doctorController.js';
import authDoctor from '../middleware/authDoctor.js';

const doctorRouter = express.Router();

doctorRouter.get('/list', doctorList);
doctorRouter.post('/login', loginDoctor);
doctorRouter.get('/appointments', authDoctor, appointmentsDoctor);
doctorRouter.post('/complete-appointment', authDoctor, appointmentComplete);
doctorRouter.post('/cancel-appointment', authDoctor, appointmentCancel);
doctorRouter.get('/dashboard', authDoctor, doctorDashboard);
doctorRouter.get('/profile', authDoctor, doctorProfile);
doctorRouter.post('/update-profile', authDoctor, updateDoctorProfile);
>>>>>>> bfa079802a3ab0a16f9d79e8b18915ac48824e97

export default doctorRouter;
