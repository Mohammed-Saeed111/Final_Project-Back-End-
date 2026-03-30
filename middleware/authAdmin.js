import jwt from 'jsonwebtoken';

const authAdmin = async (req, res, next) => {
    try {
        const { atoken } = req.headers;
        if (!atoken) {
<<<<<<< HEAD
            return res.status(401).json({ success: false, message: 'Not authorized login again' });
=======
            return res.json({ success: false, message: 'Not authorized login again' });
>>>>>>> bfa079802a3ab0a16f9d79e8b18915ac48824e97
        }
        const tokenDecode = jwt.verify(atoken, process.env.JWT_SECRET);
        
        if (tokenDecode !== process.env.ADMIN_EMAIL + process.env.ADMIN_PASSWORD) {
<<<<<<< HEAD
            return res.status(401).json({ success: false, message: 'Not authorized login again' });
=======
            return res.json({ success: false, message: 'Not authorized login again' });
>>>>>>> bfa079802a3ab0a16f9d79e8b18915ac48824e97
        }
        next();
    } catch (error) {
        console.log(error);
<<<<<<< HEAD
        res.status(401).json({ success: false, message: error.message });
=======
        res.json({ success: false, message: error.message });
>>>>>>> bfa079802a3ab0a16f9d79e8b18915ac48824e97
    }
};

export default authAdmin;
