import multer from "multer";
import { mkdirSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const uploadDirectory = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../../../uploads",
);
mkdirSync(uploadDirectory, { recursive: true });

const allowedFileTypes = ["image/jpeg", "image/png", "image/jpg", "image/webp"];
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDirectory);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

export const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (allowedFileTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      const error = new Error("Only JPG, JPEG and PNG images are allowed");
      error.status = 400;
      cb(error);
    }
  },
});
