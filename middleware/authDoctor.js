import jwt from 'jsonwebtoken';

const authDoctor = async (req, res, next) => {
    try {
        const { dtoken } = req.headers;
        if (!dtoken) {
<<<<<<< HEAD
            return res.status(401).json({ success: false, message: 'Not authorized login again' });
=======
            return res.json({ success: false, message: 'Not authorized login again' });
>>>>>>> bfa079802a3ab0a16f9d79e8b18915ac48824e97
        }
        const tokenDecode = jwt.verify(dtoken, process.env.JWT_SECRET);
        req.body.docId = tokenDecode.id;
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

export default authDoctor;
