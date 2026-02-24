import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const cloudinaryStorage = (folder: string) => new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: `wheeliz/${folder}`,
    allowed_formats: ['jpg', 'png', 'jpeg', 'webp', 'pdf', 'doc', 'docx'],
    resource_type: 'auto',
  } as any,
});

export default cloudinary;
