import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import doctorModel from '../models/doctorModel.js';
import appointmentModel from '../models/appointmentModel.js';

// ─── GET /api/doctor/list ─────────────────────────────────────────────────────
const doctorList = async (req, res) => {
    try {
        const doctors = await doctorModel.find({}).select(['-password', '-email']);
        res.json({ success: true, doctors });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// ─── POST /api/doctor/login ───────────────────────────────────────────────────
const loginDoctor = async (req, res) => {
    try {
        const { email, password } = req.body;
        const doctor = await doctorModel.findOne({ email });

        if (!doctor) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, doctor.password);
        if (!isMatch) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

        const token = jwt.sign({ id: doctor._id }, process.env.JWT_SECRET);
        res.json({ success: true, token });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// ─── GET /api/doctor/appointments ────────────────────────────────────────────
const appointmentsDoctor = async (req, res) => {
    try {
        const { docId } = req.body;
        const appointments = await appointmentModel.find({ docId });
        res.json({ success: true, appointments });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// ─── POST /api/doctor/complete-appointment ────────────────────────────────────
const appointmentComplete = async (req, res) => {
    try {
        const { docId, appointmentId } = req.body;
        const appointmentData = await appointmentModel.findById(appointmentId);

        if (!appointmentData || appointmentData.docId.toString() !== docId.toString()) {
            console.log(`ID Mismatch: appointment docId=${appointmentData?.docId}, authenticated docId=${docId}`);
            return res.status(403).json({ success: false, message: 'Action not permitted' });
        }

        await appointmentModel.findByIdAndUpdate(appointmentId, { isCompleted: true });
        res.json({ success: true, message: 'Appointment marked as completed' });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// ─── POST /api/doctor/cancel-appointment ─────────────────────────────────────
const appointmentCancel = async (req, res) => {
    try {
        const { docId, appointmentId } = req.body;
        const appointmentData = await appointmentModel.findById(appointmentId);

        if (!appointmentData || appointmentData.docId.toString() !== docId.toString()) {
            console.log(`ID Mismatch: appointment docId=${appointmentData?.docId}, authenticated docId=${docId}`);
            return res.status(403).json({ success: false, message: 'Action not permitted' });
        }

        await appointmentModel.findByIdAndUpdate(appointmentId, { cancelled: true });
        res.json({ success: true, message: 'Appointment cancelled successfully' });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// ─── GET /api/doctor/dashboard ────────────────────────────────────────────────
const doctorDashboard = async (req, res) => {
    try {
        const { docId } = req.body;
        const appointments = await appointmentModel.find({ docId });

        const earnings = appointments.reduce((sum, item) => {
            return item.isCompleted || item.payment ? sum + item.amount : sum;
        }, 0);

        const uniquePatients = [...new Set(appointments.map((item) => item.userId))];

        const dashData = {
            earnings,
            appointments: appointments.length,
            patients: uniquePatients.length,
            latestAppointments: [...appointments].reverse().slice(0, 5),
        };

        res.json({ success: true, dashData });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// ─── GET /api/doctor/profile ──────────────────────────────────────────────────
const doctorProfile = async (req, res) => {
    try {
        const { docId } = req.body;
        const profileData = await doctorModel.findById(docId).select('-password');
        res.json({ success: true, profileData });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// ─── POST /api/doctor/update-profile ─────────────────────────────────────────
const updateDoctorProfile = async (req, res) => {
    try {
        const { docId, fees, address, available } = req.body;
        await doctorModel.findByIdAndUpdate(docId, { fees, address, available });
        res.json({ success: true, message: 'Profile updated successfully' });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// ─── POST /api/admin/change-availability ─────────────────────────────────────
const changeAvailability = async (req, res) => {
    try {
        const { docId } = req.body;
        const docData = await doctorModel.findById(docId);

        if (!docData) {
            return res.status(404).json({ success: false, message: 'Doctor not found' });
        }

        await doctorModel.findByIdAndUpdate(docId, { available: !docData.available });
        res.json({ success: true, message: 'Availability updated successfully' });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

export {
    doctorList,
    loginDoctor,
    appointmentsDoctor,
    appointmentComplete,
    appointmentCancel,
    doctorDashboard,
    doctorProfile,
    updateDoctorProfile,
    changeAvailability,
};
