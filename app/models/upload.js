'use strict';

const mongoose = require('mongoose');

const uploadSchema = new mongoose.Schema({
  comment: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true,
  }
}, {
    timestamps: true,
});

uploadSchema.virtual('length').get(function() {
  // what is this.text? revisit this later
  return this.text.length;
});

const Upload = mongoose.model('Upload', uploadSchema);

module.exports = Upload;
