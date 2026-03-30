import jwt from 'jsonwebtoken';

const authUser = async (req, res, next) => {
    try {
        const { token } = req.headers;
        if (!token) {
<<<<<<< HEAD
            return res.status(401).json({ success: false, message: 'Not authorized login again' });
        }
        const tokenDecode = jwt.verify(token, process.env.JWT_SECRET);
        req.body.userId = tokenDecode.id;
        req.userId = tokenDecode.id;
        next();
    } catch (error) {
        console.log(error);
        res.status(401).json({ success: false, message: error.message });
=======
            return res.json({ success: false, message: 'Not authorized login again' });
        }
        const tokenDecode = jwt.verify(token, process.env.JWT_SECRET);
        req.body.userId = tokenDecode.id;
        next();
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
>>>>>>> bfa079802a3ab0a16f9d79e8b18915ac48824e97
    }
};

export default authUser;
