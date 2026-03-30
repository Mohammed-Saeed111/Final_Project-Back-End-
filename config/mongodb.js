import mongoose from 'mongoose';

const connectDB = async () => {
    mongoose.connection.on('connected', () => {
        console.log('Database connected');
    });
<<<<<<< HEAD
    await mongoose.connect(`${process.env.MONGODB_URI}`);   
=======
    await mongoose.connect(`${process.env.MONGODB_URI}/prescripto`);
>>>>>>> bfa079802a3ab0a16f9d79e8b18915ac48824e97
};

export default connectDB;
