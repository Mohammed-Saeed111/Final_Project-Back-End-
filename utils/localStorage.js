import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, '../public/uploads');

const initializeUploadDir = () => {
    if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true });
        console.log(' Uploads directory created:', uploadsDir);
    }
};

const saveLocalImage = (sourceFilePath, fileName) => {
    try {
        const destPath = path.join(uploadsDir, fileName);
        fs.copyFileSync(sourceFilePath, destPath);
        
        // Return the full URL that can be accessed from frontend
        const serverUrl = process.env.SERVER_URL || `http://localhost:${process.env.PORT || 4000}`;
        const urlPath = `${serverUrl}/uploads/${fileName}`;
        
        console.log(' Image URL:', urlPath);
        return urlPath;
    } catch (error) {
        console.error(' Local upload error:', error.message);
        throw error;
    }
};

export { initializeUploadDir, saveLocalImage, uploadsDir };
