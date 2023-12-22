const multer = require('multer');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto')
const {FOLDER, ALGO} = require("../config/env")

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      console.log(req.body)
      // Define the destination folder for uploaded files
      cb(null, FOLDER);
    },

    filename: (req, file, cb) => {
      let file_name =""
      if(file.originalname){
       file_name = file.originalname.split('.')[0]
      }

      // Define the filename for uploaded files
      cb(null, `${Date.now()}-${file_name}${path.extname(file.originalname)}`);
    },
  });

exports.upload = multer({ storage: storage });

exports.generateKeys=(req, res, next)=>{
   const options = {
    modulusLength: 2048,
    publicKeyEncoding: {
      type: 'spki',
      format: 'pem',
    },
    privateKeyEncoding: {
      type: 'pkcs8',
      format: 'pem',
    },
   }
   const { privateKey, publicKey }= crypto.generateKeyPairSync(ALGO,options)
   req.keys = {
    privateKey,
    publicKey,
  };
  next()
}
const cleanupInterval = 5 * 1000;
exports.cleanupFiles = () => {
  const uploadDir = path.join(__dirname,'../../', FOLDER);

  fs.readdir(uploadDir, (err, files) => {
    if (err) {
      console.error('Error reading directory:', err);
      return;
    }

    const currentTime = Date.now();

    files.forEach((file) => {
      const filePath = path.join(uploadDir, file);

      fs.stat(filePath, (err, stats) => {
        if (err) {
          console.error('Error getting file stats:', err);
          return;
        }

        const lastModifiedTime = new Date(stats.mtime).getTime();
        const elapsedTime = currentTime - lastModifiedTime;

        // If the file has been inactive for more than cleanupInterval, delete it
        if (elapsedTime > cleanupInterval) {
          fs.unlink(filePath, (err) => {
            if (err) {
              console.error('Error deleting file:', err);
            } else {
              console.log(`File deleted: ${filePath}`);
            }
          });
        }
      });
    });
  });
};