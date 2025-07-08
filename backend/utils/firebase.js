const admin = require('firebase-admin');
const { v4: uuidv4 } = require('uuid');
const serviceAccount = require('../firebaseKey.json');
require('dotenv').config(); 

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
});

console.log(" Using bucket:", process.env.FIREBASE_STORAGE_BUCKET);

const bucket = admin.storage().bucket();

exports.uploadFileToFirebase = async (file) => {
  const filename = `${uuidv4()}_${file.originalname}`;
  const blob = bucket.file(filename);
  const blobStream = blob.createWriteStream({
    metadata: {
      contentType: file.mimetype,
    },
  });

  return new Promise((resolve, reject) => {
    blobStream.on("error", (err) => {
      console.error("Firebase upload failed:", err.message);
      reject(new Error("Failed to upload to Firebase"));
    });

    blobStream.on("finish", async () => {
      try {
        await blob.makePublic(); 
        const publicUrl = `https://storage.googleapis.com/${bucket.name}/${blob.name}`;
        console.log(" Public file URL:", publicUrl);
        resolve(publicUrl);
      } catch (err) {
        console.error("Failed to make file public:", err.message);
        reject(new Error("Uploaded but failed to make file public"));
      }
    });

    blobStream.end(file.buffer);
  });
};
