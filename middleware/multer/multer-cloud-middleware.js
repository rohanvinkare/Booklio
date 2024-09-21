const multer = require("multer");
require("dotenv").config();

const storage = multer.diskStorage({
  filename: function (req, file, cb) {
    const name = Date.now() + "-" + file.originalname;
    cb(null, name);
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const uploadCloud = multer({ storage: storage, fileFilter: fileFilter });

module.exports = uploadCloud;
