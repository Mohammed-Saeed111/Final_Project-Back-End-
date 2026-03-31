import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { v2 as cloudinary } from 'cloudinary';
import Razorpay from 'razorpay';
import path from 'path';
import userModel from '../models/userModel.js';
import doctorModel from '../models/doctorModel.js';
import appointmentModel from '../models/appointmentModel.js';
import { saveLocalImage } from '../utils/localStorage.js';

// Razorpay client – initialised lazily so the app boots even if keys are absent
const getRazorpay = () =>
    new Razorpay({
        key_id: process.env.RAZORPAY_KEY_ID,
        key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

// ─── POST /api/user/register ──────────────────────────────────────────────────
const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new userModel({ name, email, password: hashedPassword });
        const user = await newUser.save();

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
        res.json({ success: true, token });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// ─── POST /api/user/login ─────────────────────────────────────────────────────
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await userModel.findOne({ email });

        if (!user) {
            return res.status(401).json({ success: false, message: 'User does not exist' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
        res.json({ success: true, token });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// ─── GET /api/user/get-profile ────────────────────────────────────────────────
const getProfile = async (req, res) => {
    try {
        const userId = req.body.userId || req.userId;
        
        if (!userId) {
            return res.status(401).json({ success: false, message: 'User not authenticated' });
        }

        const userData = await userModel.findById(userId).select('-password');
        res.json({ success: true, userData });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// ─── POST /api/user/update-profile ───────────────────────────────────────────
const updateProfile = async (req, res) => {
    try {
        const userId = req.body.userId || req.userId;
        
        if (!userId) {
            return res.status(401).json({ success: false, message: 'User not authenticated' });
        }

        const { name, phone, address, dob, gender } = req.body;
        const imageFile = req.file;

        const updateData = {
            name,
            phone,
            address: typeof address === 'string' ? JSON.parse(address) : address,
            dob,
            gender,
        };

        if (imageFile) {
            let imageUrl = null;
            
            // Try Cloudinary first
            try {
                console.log('📤 Uploading image to Cloudinary:', imageFile.filename, 'Size:', imageFile.size);
                const imageUpload = await cloudinary.uploader.upload(imageFile.path, { 
                    resource_type: 'auto',
                    folder: 'prescripto/users',
                    quality: 'auto'
                });
                console.log('✅ Image uploaded to Cloudinary:', imageUpload.secure_url);
                imageUrl = imageUpload.secure_url;
            } catch (cloudinaryError) {
                console.error('❌ Cloudinary upload failed:', cloudinaryError.message);
                
                // Fallback to local storage
                try {
                    console.log('📁 Attempting fallback to local storage...');
                    const fileName = `${userId}_${Date.now()}${path.extname(imageFile.originalname)}`;
                    const localUrl = saveLocalImage(imageFile.path, fileName);
                    console.log('✅ Image saved locally:', localUrl);
                    imageUrl = localUrl;
                } catch (localError) {
                    console.error('❌ Local storage also failed:', localError.message);
                    console.log('⚠️  Proceeding with profile update without image');
                }
            }
            
            if (imageUrl) {
                updateData.image = imageUrl;
            }
        }

        await userModel.findByIdAndUpdate(userId, updateData);
        res.json({ success: true, message: 'Profile updated successfully' });

    } catch (error) {
        console.log('❌ Update profile error:', error.message);
        res.json({ success: false, message: error.message });
    }
};

// ─── POST /api/user/book-appointment ─────────────────────────────────────────
const bookAppointment = async (req, res) => {
    try {
        const userId = req.body.userId || req.userId;
        const { docId, slotDate, slotTime, docData: docDataFromClient } = req.body;
        
        if (!userId) {
            return res.status(401).json({ success: false, message: 'User not authenticated' });
        }

        let docData;
        let isStaticDoc = false;

        if (docDataFromClient) {
            docData = typeof docDataFromClient === 'string' ? JSON.parse(docDataFromClient) : docDataFromClient;
            isStaticDoc = true;
        } else {
            docData = await doctorModel.findById(docId).select('-password');
            if (!docData) return res.status(404).json({ success: false, message: 'Doctor not found' });
            if (!docData.available) return res.json({ success: false, message: 'Doctor not available' });
        }

        const userData = await userModel.findById(userId).select('-password');

        const docSnapshot = isStaticDoc ? docData : (() => {
            const snap = docData.toObject();
            delete snap.slots_booked;
            return snap;
        })();

        const newAppointment = new appointmentModel({
            userId,
            docId,
            userData,
            docData: docSnapshot,
            amount: docSnapshot.fees,
            slotTime,
            slotDate,
            date: Date.now(),
        });

        await newAppointment.save();

        // تحديث slots_booked فقط لو الداكتور موجود في الـ database
        if (!isStaticDoc) {
            let slots_booked = docData.slots_booked;
            slots_booked[slotDate] = [...(slots_booked[slotDate] || []), slotTime];
            await doctorModel.findByIdAndUpdate(docId, { slots_booked });
        }

        res.json({ success: true, message: 'Appointment booked successfully' });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// ─── GET /api/user/appointments ───────────────────────────────────────────────
const listAppointment = async (req, res) => {
    try {
        const userId = req.body.userId || req.userId;
        
        if (!userId) {
            return res.status(401).json({ success: false, message: 'User not authenticated' });
        }

        const appointments = await appointmentModel.find({ userId });
        res.json({ success: true, appointments });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// ─── POST /api/user/cancel-appointment ───────────────────────────────────────
const cancelAppointment = async (req, res) => {
    try {
        const userId = req.body.userId || req.userId;
        const { appointmentId } = req.body;
        
        if (!userId) {
            return res.status(401).json({ success: false, message: 'User not authenticated' });
        }

        const appointmentData = await appointmentModel.findById(appointmentId);

        if (!appointmentData) {
            return res.status(404).json({ success: false, message: 'Appointment not found' });
        }

        // Compare as strings to handle ObjectId vs string comparison
        if (appointmentData.userId.toString() !== userId.toString()) {
            console.log(`ID Mismatch: appointment userId=${appointmentData.userId}, authenticated userId=${userId}`);
            return res.status(403).json({ success: false, message: 'Unauthorized action' });
        }

        await appointmentModel.findByIdAndUpdate(appointmentId, { cancelled: true });

        const { docId, slotDate, slotTime } = appointmentData;
        const doctorData = await doctorModel.findById(docId);

        // Only update slots if the doctor still exists in the DB
        // (static/seed appointments may have a docId that doesn't match any DB record)
        if (doctorData) {
            let slots_booked = doctorData.slots_booked;
            slots_booked[slotDate] = (slots_booked[slotDate] || []).filter((e) => e !== slotTime);
            await doctorModel.findByIdAndUpdate(docId, { slots_booked });
        }

        res.json({ success: true, message: 'Appointment cancelled successfully' });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// ─── POST /api/user/payment-razorpay ─────────────────────────────────────────
const paymentRazorpay = async (req, res) => {
    try {
        const { appointmentId } = req.body;
        const appointmentData = await appointmentModel.findById(appointmentId);

        if (!appointmentData || appointmentData.cancelled) {
            return res.status(404).json({ success: false, message: 'Appointment cancelled or not found' });
        }

        const options = {
            amount: appointmentData.amount * 100,
            currency: process.env.CURRENCY || 'INR',
            receipt: appointmentId,
        };

        const order = await getRazorpay().orders.create(options);
        res.json({ success: true, order });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// ─── POST /api/user/verify-razorpay ──────────────────────────────────────────
const verifyRazorpay = async (req, res) => {
    try {
        const { razorpay_order_id } = req.body;
        const orderInfo = await getRazorpay().orders.fetch(razorpay_order_id);

        if (orderInfo.status === 'paid') {
            await appointmentModel.findByIdAndUpdate(orderInfo.receipt, { payment: true });
            return res.json({ success: true, message: 'Payment successful' });
        }

        res.json({ success: false, message: 'Payment not completed' });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

export {
    registerUser,
    loginUser,
    getProfile,
    updateProfile,
    bookAppointment,
    listAppointment,
    cancelAppointment,
    paymentRazorpay,
    verifyRazorpay,
};
