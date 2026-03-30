import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import connectDB from './config/mongodb.js';
import connectCloudinary from './config/cloudinary.js';
import { initializeUploadDir } from './utils/localStorage.js';
import adminRouter from './routes/adminRoute.js';
import doctorRouter from './routes/doctorRoute.js';
import userRouter from './routes/userRoute.js';

// fix SSL certificate issue with Cloudinary on local dev
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

// ─── App Config ───────────────────────────────────────────────────────────────
const app = express();
const port = process.env.PORT || 4000;

connectDB();
connectCloudinary();
initializeUploadDir();

// ─── Core Middleware ──────────────────────────────────────────────────────────
app.use(express.json());
app.use(express.static('public')); // Serve static files (uploaded images)

const allowedOrigins = [
    'http://localhost:5173',
    'http://localhost:5174',
    process.env.FRONTEND_URL,
].filter(Boolean); // remove undefined/empty entries

app.use(cors({
    origin: (origin, callback) => {
        // allow REST clients (Postman, server-to-server) and whitelisted browser origins
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error(`CORS: origin ${origin} is not allowed`));
        }
    },
    credentials: true,
}));

// ─── API Routes ───────────────────────────────────────────────────────────────
app.use('/api/admin', adminRouter);
app.use('/api/doctor', doctorRouter);
app.use('/api/user', userRouter);

// ─── Health Check ─────────────────────────────────────────────────────────────
app.get('/', (req, res) => {
    res.json({ success: true, message: 'API is running' });
});

// ─── Global Error Handler ─────────────────────────────────────────────────────
// Catches any error forwarded by asyncHandler's next(err)
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(err.status || 500).json({
        success: false,
        message: err.message || 'Internal Server Error',
    });
});

// ─── Start Server ─────────────────────────────────────────────────────────────
app.listen(port, () => {
    console.log(`Server started on PORT ${port}`);
});
