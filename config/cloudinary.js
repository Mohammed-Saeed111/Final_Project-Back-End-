import { v2 as cloudinary } from 'cloudinary';

const connectCloudinary = async () => {
    cloudinary.config({
        cloud_name: process.env.CLOUDINARY_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
<<<<<<< HEAD
        api_secret: process.env.CLOUDINARY_SECRET_KEY,
=======
        api_secret: process.env.CLOUDINARY_SECRET_KEY
>>>>>>> bfa079802a3ab0a16f9d79e8b18915ac48824e97
    });
};

export default connectCloudinary;
