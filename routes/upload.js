const express = require("express");
const { uploadImages, listImages } = require("../controllers/upload");

// Middleware for uploading images(posts)
const imageUpload = require("../middlewares/imageUpload");
// Middlewares for authentication
const { authUser } = require("../middlewares/auth");

const router = express.Router();

router.post("/uploadImages", authUser, imageUpload, uploadImages);
router.post("/listImages", authUser, listImages);

module.exports = router;
