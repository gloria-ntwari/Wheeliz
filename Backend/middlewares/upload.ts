import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, '..', 'uploads');
const comicsDir = path.join(uploadsDir, 'comics');
const documentsDir = path.join(uploadsDir, 'documents');
const avatarsDir = path.join(uploadsDir, 'avatars');

[uploadsDir, comicsDir, documentsDir, avatarsDir].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Storage configuration for comic cover images
const comicImageStorage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, comicsDir);
  },
  filename: (_req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'comic-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// Storage configuration for comic documents
const comicDocumentStorage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, documentsDir);
  },
  filename: (_req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'doc-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// File filter for images
const imageFilter = (_req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Only image files are allowed (jpeg, jpg, png, gif, webp)'));
  }
};

// File filter for documents
const documentFilter = (_req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowedTypes = /pdf|doc|docx|txt/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());

  if (extname) {
    return cb(null, true);
  } else {
    cb(new Error('Only document files are allowed (pdf, doc, docx, txt)'));
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
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      if (file.fieldname === 'coverImage') {
        cb(null, comicsDir);
      } else {
        cb(null, documentsDir);
      }
    },
    filename: (_req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      const prefix = file.fieldname === 'coverImage' ? 'comic-' : 'doc-';
      cb(null, prefix + uniqueSuffix + path.extname(file.originalname));
    }
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
  storage: multer.diskStorage({
    destination: (_req, _file, cb) => {
      cb(null, avatarsDir);
    },
    filename: (_req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      cb(null, 'avatar-' + uniqueSuffix + path.extname(file.originalname));
    }
  }),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: imageFilter
}).fields([{ name: 'avatar', maxCount: 1 }]);
