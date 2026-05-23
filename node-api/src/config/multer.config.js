import multer from "multer";
import fs from "fs";
import path from "path";
import { UPLOAD_ROOT } from "./upload-path.js";

const MAX_FILE_SIZE_MB = 5;
const ALLOWED_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
];

function createUpload(folder) {
  const uploadPath = path.join(UPLOAD_ROOT, folder);

  if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath, { recursive: true });
  }

  const storage = multer.diskStorage({
    destination(req, file, cb) {
      cb(null, uploadPath);
    },
    filename(req, file, cb) {
      const ext = path.extname(file.originalname);
      const name = `${folder}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}${ext}`;
      cb(null, name);
    },
  });

  const fileFilter = (req, file, cb) => {
    if (ALLOWED_MIME_TYPES.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error(`Tipo de arquivo não permitido: ${file.mimetype}`), false);
    }
  };

  return multer({
    storage,
    fileFilter,
    limits: {
      fileSize: MAX_FILE_SIZE_MB * 1024 * 1024, // 5MB por arquivo
    },
  });
}

export const aboutUpload = createUpload("about");
export const heroUpload = createUpload("hero");
