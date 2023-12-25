const fs = require("fs");

// Validation for the Image Files
module.exports = async function (req, res, next) {
  try {
    if (!req.files || Object.values(req.files).flat().length === 0) {
      return res.status(400).json({ message: "No files selected." });
    }

    // "Object.values()" extract the values of an object and return them as an array
    // "flat()" flatens the nested array into simple array
    let files = Object.values(req.files).flat();
    files.forEach((file) => {
      // Check For Image Format ("file.mimetype" determines the file format)
      if (
        file.mimetype !== "image/jpeg" &&
        file.mimetype !== "image/png" &&
        file.mimetype !== "image/gif" &&
        file.mimetype !== "image/webp"
      ) {
        // Removing the file from tmp folder(refer server.js)
        removeTmp(file.tempFilePath);
        return res.status(400).json({ message: "Unsupported file format." });
      }
      // Check for Image Size
      if (file.size > 1024 * 1024 * 5) {
        // Removing the file from tmp folder(refer server.js)
        removeTmp(file.tempFilePath);
        return res
          .status(400)
          .json({ message: "File size is too large.[Support <= 5mb]" });
      }
    });

    next();
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Function for removing unwanted files
const removeTmp = (path) => {
  // "unlink()" deletes the file on the given path
  fs.unlink(path, (err) => {
    if (err) throw err;
  });
};
