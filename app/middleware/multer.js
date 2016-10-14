'use strict';

const multer = require('multer');
const storage = multer.memoryStorage(); // don't do this w/real apps bc it will slow down your server if ppl upload large files, and others won't be able to access your app

module.exports = multer({ storage });
