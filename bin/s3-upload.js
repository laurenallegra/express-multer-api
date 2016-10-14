'use strict';

// this has to come before anything else
require('dotenv').config();

const fs = require('fs');
const fileType = require ('file-type');
const AWS = require ('aws-sdk');

const filename = process.argv[2] || '';

const readFile = (filename) => {
  return new Promise ((resolve, reject) => {
    fs.readFile(filename, (error, data) => {
      if (error) {
        reject(error);
      }

    resolve(data);
    });
  });
};

// return a default object in the case the fileType is given an unsupported
// filetype to read
const mimeType = (data) => {
  return Object.assign({
    ext: 'bin',
    mime: 'application/octet-stream',
  }, fileType(data));
};

const parseFile = (fileBuffer) => {
  let file = mimeType(fileBuffer);
  file.data = fileBuffer;
  return file;
};

const s3 = new AWS.S3({
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  }
});

const upload = (file) => {
  const options = {
    // get the bucket name from your AWS S3 console
    Bucket: 'laurenschwartzbucket',
    // attach the fileBuffer as a stream to send to S3
    Body: file.data,
    // allow anyone to access the URL of the uploaded file
    ACL: 'public-read',
    // tell s3 what the mime-type is
    ContentType: file.mime,
    // pick a filename for S3 to use for the upload
    Key: `test/test.${file.ext}`
  };

  return new Promise ((resolve, reject) => {
    s3.upload(options, (error, data) => {
      if (error) {
        reject(error);
      }

      resolve(data);
    });
  });
};

const logMessage = (response) => {
  console.log(`The response from AWS was ${JSON.stringify(response)}`);
};

readFile(filename)
.then(parseFile)
.then(upload)
.then(logMessage)
.catch(console.error)
;
