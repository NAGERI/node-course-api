import multer from "multer";
import path from "path";

// Set storage engine
const storage = multer.diskStorage({
  destination: "./uploads/",
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});

// Init upload
const upload = multer({
  storage: storage,
  limits: { fileSize: 1000000 }, // 1MB limit
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
}).single("image"); // Name of the file input field in the form

// Check file type
function checkFileType(file, cb) {
  // Allowed extensions
  const filetypes = /jpeg|jpg|png|gif/;
  // Check extension
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  // Check mime type
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb("Error: Images only!");
  }
}

export function uploadFile(req, res) {
  upload(req, res, (err) => {
    if (err) {
      return res.status(400).json({ error: err });
    }
    if (!req.file) {
      return res.status(400).json({ error: "No file selected" });
    }
    res.status(200).json({ message: "File uploaded successfully" });
  });
}
