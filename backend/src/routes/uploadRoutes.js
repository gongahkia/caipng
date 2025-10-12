/**
 * Upload Routes
 */

const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const {
  uploadImage,
  uploadMultipleImages
} = require('../controllers/uploadController');

// Image upload routes
router.post('/', upload.single('image'), uploadImage);
router.post('/multiple', upload.array('images', 10), uploadMultipleImages);

module.exports = router;

