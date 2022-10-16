import { Storage } from "@google-cloud/storage";
const vision = require('@google-cloud/vision');

export const googleCloudVisionClient = new vision.ImageAnnotatorClient({
    projectId: process.env.GOOGLE_PROJECT_ID,
    credentials: {
      client_email: process.env.GOOGLE_EMAIL,
      private_key: process.env.GOOGLE_PRIVATE_KEY,
    },
  });
  
export const googleCloudStorageClient = new Storage({
    projectId: process.env.GOOGLE_PROJECT_ID,
    credentials: {
      client_email: process.env.GOOGLE_EMAIL,
      private_key: process.env.GOOGLE_PRIVATE_KEY,
    },
});