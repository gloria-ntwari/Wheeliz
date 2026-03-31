import { Storage } from '@google-cloud/storage';
import path from 'path';
import fs from 'fs';

// Check for local key file (for development without gcloud CLI)
const keyFilePath = path.join(__dirname, '..', 'gcs-key.json');
const storageOptions: any = {};

if (fs.existsSync(keyFilePath)) {
  console.log('GCS: Using local key file:', keyFilePath);
  storageOptions.keyFilename = keyFilePath;
} else {
  console.log('GCS: Using default credentials (Cloud Run / ADC)');
}

const storage = new Storage(storageOptions);

const bucketName = process.env.GCS_BUCKET_NAME || 'wheeliez-fronted-bucket';
const bucket = storage.bucket(bucketName);

/**
 * Uploads a file buffer to Google Cloud Storage
 * @param buffer File buffer from Multer memoryStorage
 * @param destination Destination path in the bucket
 * @param mimetype File mimetype
 * @returns Public URL of the uploaded file
 */
export const uploadToGCS = async (
  buffer: Buffer,
  destination: string,
  mimetype: string
): Promise<string> => {
  const file = bucket.file(destination);

  await file.save(buffer, {
    metadata: { contentType: mimetype },
    resumable: false, // For small files (<10MB), resumable is slower
  });

  // Make the file publicly accessible (Optional - depends on your needs)
  // await file.makePublic(); 

  // Return the public URL
  // Note: This URL format works if the bucket/file is publicly accessible
  return `https://storage.googleapis.com/${bucketName}/${destination}`;
};

export default storage;
