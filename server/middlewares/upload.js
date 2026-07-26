import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from '../config/cloudinary.js';

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'LicenseHubDocs',
    public_id: (req, file) => {
      const name = file.originalname
        .split('.')[0]
        .replace(/[^a-zA-Z0-9-_]/g, '-');

      return `${name}-${Date.now()}`;
    },
  },
});

const upload = multer({
  storage, 
  limits: { 
    fileSize: 5 * 1024* 1024 
  },
});

export default upload;