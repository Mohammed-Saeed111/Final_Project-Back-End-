<<<<<<< HEAD
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import doctorModel from '../models/doctorModel.js';
import appointmentModel from '../models/appointmentModel.js';

// ─── GET /api/doctor/list ─────────────────────────────────────────────────────
const doctorList = async (req, res) => {
    try {
        const doctors = await doctorModel.find({}).select(['-password', '-email']);
        res.json({ success: true, doctors });

=======
import doctorModel from '../models/doctorModel.js';
import appointmentModel from '../models/appointmentModel.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const changeAvailability = async (req, res) => {
    try {
        const { docId } = req.body;
        const docData = await doctorModel.findById(docId);
        await doctorModel.findByIdAndUpdate(docId, { available: !docData.available });
        res.json({ success: true, message: 'Availability changed' });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

const doctorList = async (req, res) => {
    try {
        const doctors = await doctorModel.find({}).select(['-password', '-email']);
        res.json({ success: true, doctors });
>>>>>>> bfa079802a3ab0a16f9d79e8b18915ac48824e97
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

<<<<<<< HEAD
// ─── POST /api/doctor/login ───────────────────────────────────────────────────
=======
>>>>>>> bfa079802a3ab0a16f9d79e8b18915ac48824e97
const loginDoctor = async (req, res) => {
    try {
        const { email, password } = req.body;
        const doctor = await doctorModel.findOne({ email });

        if (!doctor) {
<<<<<<< HEAD
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, doctor.password);
        if (!isMatch) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

        const token = jwt.sign({ id: doctor._id }, process.env.JWT_SECRET);
        res.json({ success: true, token });

=======
            return res.json({ success: false, message: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, doctor.password);
        if (isMatch) {
            const token = jwt.sign({ id: doctor._id }, process.env.JWT_SECRET);
            res.json({ success: true, token });
        } else {
            res.json({ success: false, message: 'Invalid credentials' });
        }
>>>>>>> bfa079802a3ab0a16f9d79e8b18915ac48824e97
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

<<<<<<< HEAD
// ─── GET /api/doctor/appointments ────────────────────────────────────────────
=======
>>>>>>> bfa079802a3ab0a16f9d79e8b18915ac48824e97
const appointmentsDoctor = async (req, res) => {
    try {
        const { docId } = req.body;
        const appointments = await appointmentModel.find({ docId });
        res.json({ success: true, appointments });
<<<<<<< HEAD

=======
>>>>>>> bfa079802a3ab0a16f9d79e8b18915ac48824e97
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

<<<<<<< HEAD
// ─── POST /api/doctor/complete-appointment ────────────────────────────────────
=======
>>>>>>> bfa079802a3ab0a16f9d79e8b18915ac48824e97
const appointmentComplete = async (req, res) => {
    try {
        const { docId, appointmentId } = req.body;
        const appointmentData = await appointmentModel.findById(appointmentId);

<<<<<<< HEAD
        if (!appointmentData || appointmentData.docId.toString() !== docId.toString()) {
            console.log(`ID Mismatch: appointment docId=${appointmentData?.docId}, authenticated docId=${docId}`);
            return res.status(403).json({ success: false, message: 'Action not permitted' });
        }

        await appointmentModel.findByIdAndUpdate(appointmentId, { isCompleted: true });
        res.json({ success: true, message: 'Appointment marked as completed' });

=======
        if (appointmentData && appointmentData.docId === docId) {
            await appointmentModel.findByIdAndUpdate(appointmentId, { isCompleted: true });
            return res.json({ success: true, message: 'Appointment completed' });
        } else {
            return res.json({ success: false, message: 'Mark failed' });
        }
>>>>>>> bfa079802a3ab0a16f9d79e8b18915ac48824e97
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

<<<<<<< HEAD
// ─── POST /api/doctor/cancel-appointment ─────────────────────────────────────
=======
>>>>>>> bfa079802a3ab0a16f9d79e8b18915ac48824e97
const appointmentCancel = async (req, res) => {
    try {
        const { docId, appointmentId } = req.body;
        const appointmentData = await appointmentModel.findById(appointmentId);

<<<<<<< HEAD
        if (!appointmentData || appointmentData.docId.toString() !== docId.toString()) {
            console.log(`ID Mismatch: appointment docId=${appointmentData?.docId}, authenticated docId=${docId}`);
            return res.status(403).json({ success: false, message: 'Action not permitted' });
        }

        await appointmentModel.findByIdAndUpdate(appointmentId, { cancelled: true });
        res.json({ success: true, message: 'Appointment cancelled successfully' });

=======
        if (appointmentData && appointmentData.docId === docId) {
            await appointmentModel.findByIdAndUpdate(appointmentId, { cancelled: true });
            return res.json({ success: true, message: 'Appointment cancelled' });
        } else {
            return res.json({ success: false, message: 'Cancellation failed' });
        }
>>>>>>> bfa079802a3ab0a16f9d79e8b18915ac48824e97
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

<<<<<<< HEAD
// ─── GET /api/doctor/dashboard ────────────────────────────────────────────────
=======
>>>>>>> bfa079802a3ab0a16f9d79e8b18915ac48824e97
const doctorDashboard = async (req, res) => {
    try {
        const { docId } = req.body;
        const appointments = await appointmentModel.find({ docId });

<<<<<<< HEAD
        const earnings = appointments.reduce((sum, item) => {
            return item.isCompleted || item.payment ? sum + item.amount : sum;
        }, 0);

        const uniquePatients = [...new Set(appointments.map((item) => item.userId))];
=======
        let earnings = 0;
        appointments.map((item) => {
            if (item.isCompleted || item.payment) {
                earnings += item.amount;
            }
        });

        let patients = [];
        appointments.map((item) => {
            if (!patients.includes(item.userId)) {
                patients.push(item.userId);
            }
        });
>>>>>>> bfa079802a3ab0a16f9d79e8b18915ac48824e97

        const dashData = {
            earnings,
            appointments: appointments.length,
<<<<<<< HEAD
            patients: uniquePatients.length,
            latestAppointments: [...appointments].reverse().slice(0, 5),
        };

        res.json({ success: true, dashData });

=======
            patients: patients.length,
            latestAppointments: appointments.reverse().slice(0, 5)
        };

        res.json({ success: true, dashData });
>>>>>>> bfa079802a3ab0a16f9d79e8b18915ac48824e97
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

<<<<<<< HEAD
// ─── GET /api/doctor/profile ──────────────────────────────────────────────────
=======
>>>>>>> bfa079802a3ab0a16f9d79e8b18915ac48824e97
const doctorProfile = async (req, res) => {
    try {
        const { docId } = req.body;
        const profileData = await doctorModel.findById(docId).select('-password');
        res.json({ success: true, profileData });
<<<<<<< HEAD

=======
>>>>>>> bfa079802a3ab0a16f9d79e8b18915ac48824e97
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

<<<<<<< HEAD
// ─── POST /api/doctor/update-profile ─────────────────────────────────────────
=======
>>>>>>> bfa079802a3ab0a16f9d79e8b18915ac48824e97
const updateDoctorProfile = async (req, res) => {
    try {
        const { docId, fees, address, available } = req.body;
        await doctorModel.findByIdAndUpdate(docId, { fees, address, available });
<<<<<<< HEAD
        res.json({ success: true, message: 'Profile updated successfully' });

=======
        res.json({ success: true, message: 'Profile updated' });
>>>>>>> bfa079802a3ab0a16f9d79e8b18915ac48824e97
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

<<<<<<< HEAD
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
=======
export { changeAvailability, doctorList, loginDoctor, appointmentsDoctor, appointmentComplete, appointmentCancel, doctorDashboard, doctorProfile, updateDoctorProfile };
>>>>>>> bfa079802a3ab0a16f9d79e8b18915ac48824e97
