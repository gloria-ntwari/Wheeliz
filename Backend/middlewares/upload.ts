import multer from 'multer';
import path from 'path';
import fs from 'fs';



import { cloudinaryStorage } from '../config/cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';


const comicImageStorage = cloudinaryStorage('comics');
const comicDocumentStorage = cloudinaryStorage('documents');
const avatarStorage = cloudinaryStorage('avatars');


const imageFilter = (_req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  console.log('Multer Filter: Processing file:', file.originalname, 'Mimetype:', file.mimetype);
  const allowedTypes = /jpeg|jpg|png|gif|webp/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype && extname) {
    console.log('Multer Filter: File accepted');
    return cb(null, true);
  } else {
    console.error('Multer Filter: File rejected');
    cb(new Error('Only image files are allowed (jpeg, jpg, png, gif, webp)'));
  }
};

// File filter for documents
const documentFilter = (_req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowedTypes = /pdf|doc|docx|txt|jpeg|jpg|png|webp/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());

  if (extname) {
    return cb(null, true);
  } else {
    cb(new Error('Only PDF, Word, Text, or Image files are allowed for documents'));
  }
};

// Upload middleware for comic images
export const uploadComicImage = multer({
  storage: comicImageStorage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: imageFilter
}).single('coverImage');

// Upload middleware for comic documents
export const uploadComicDocuments = multer({
  storage: comicDocumentStorage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: documentFilter
}).array('documents', 5); // Max 5 documents

// Combined upload for both image and documents
export const uploadComicFiles = multer({
  storage: new CloudinaryStorage({
    cloudinary: require('../config/cloudinary').default,
    params: async (req: any, file: any) => {
      let folderName = 'wheeliz/others';
      if (file.fieldname === 'coverImage') folderName = 'wheeliz/comics';
      else if (file.fieldname === 'documents') folderName = 'wheeliz/documents';
      
      return {
        folder: folderName,
        resource_type: 'auto',
        allowed_formats: ['jpg', 'png', 'jpeg', 'webp', 'pdf', 'doc', 'docx'],
      };
    },
  }),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (_req, file, cb) => {
    if (file.fieldname === 'coverImage') {
      imageFilter(_req, file, cb);
    } else {
      documentFilter(_req, file, cb);
    }
  }
}).fields([
  { name: 'coverImage', maxCount: 1 },
  { name: 'documents', maxCount: 5 }
]);

// Upload for avatars (Admin & Kid)
export const uploadAvatar = multer({
  storage: avatarStorage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: imageFilter
}).fields([{ name: 'avatar', maxCount: 1 }]);

// Upload for assignment submissions
export const uploadSubmissionFiles = multer({
  storage: new CloudinaryStorage({
    cloudinary: require('../config/cloudinary').default,
    params: async (req: any, file: any) => {
      return {
        folder: 'wheeliz/submissions',
        resource_type: 'auto',
        allowed_formats: ['jpg', 'png', 'jpeg', 'webp', 'pdf', 'doc', 'docx'],
      };
    },
  }),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: documentFilter
}).array('attachments', 10); // Allow up to 10 files (limit will be checked in controller)
