const cloudinary = require("cloudinary");
const fs = require("fs");
const path = require("path");

// Cloadinary Configuration
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

// Uploading the image
exports.uploadImages = async (req, res) => {
  try {
    const { path } = req.body;
    // "Object.values()" extract the values of an object and return them as an array
    // "flat()" flatens the nested array into simple array
    let files = Object.values(req.files).flat();
    let images = [];

    for (const file of files) {
      const url = await uploadToCloudinary(file, path);
      // "url" is URL of images uploaded on Cloudinary
      images.push(url);
      // Removing the file from tmp folder(refer server.js)
      removeTmp(file.tempFilePath);
    }
    res.json(images);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

//  Showing the required images from Cloudinary
exports.listImages = async (req, res) => {
  const { path, sort, max } = req.body;
  // Searching required images from Cloudinary
  cloudinary.v2.search
    .expression(`${path}`)
    .sort_by("created_at", `${sort}`)
    .max_results(max)
    .execute()
    .then((result) => {
      res.json(result);
    })
    .catch((err) => {
      console.log(err.error.message);
    });
};

// Uploading images to Cloudinary Online Storage
// "uplaod(file, path, callback-fn)"
const uploadToCloudinary = async (file, path) => {
  return new Promise((resolve) => {
    cloudinary.v2.uploader.upload(
      file.tempFilePath,
      {
        folder: path,
      },
      (err, res) => {
        if (err) {
          // Removing the file from tmp folder(refer server.js)
          removeTmp(file.tempFilePath);
          return res.status(400).json({ message: "Upload image failed." });
        }
        resolve({
          url: res.secure_url,
        });
      }
    );
  });
};

// Function for removing unwanted files
const removeTmp = (path) => {
  // "unlink()" deletes the file on the given path
  fs.unlink(path, (err) => {
    if (err) throw err;
  });
};
