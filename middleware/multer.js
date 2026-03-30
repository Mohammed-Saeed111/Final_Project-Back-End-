import multer from 'multer';
import os from 'os';

const storage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, os.tmpdir());
    },
    filename: function (req, file, callback) {
        callback(null, Date.now() + '_' + file.originalname);
    }
});
const upload = multer({ storage });
export default upload;
