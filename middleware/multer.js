import multer from 'multer';
<<<<<<< HEAD
import os from 'os';

const storage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, os.tmpdir());
    },
    filename: function (req, file, callback) {
        callback(null, Date.now() + '_' + file.originalname);
=======

const storage = multer.diskStorage({
    filename: function (req, file, callback) {
        callback(null, file.originalname);
>>>>>>> bfa079802a3ab0a16f9d79e8b18915ac48824e97
    }
});
const upload = multer({ storage });
export default upload;
