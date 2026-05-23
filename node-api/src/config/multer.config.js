import multer from "multer";
import fs from "fs";
import path from "path";
import { UPLOAD_ROOT } from "./upload-path.js";

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
      const name = `${folder}-${Date.now()}${ext}`;
      cb(null, name);
    },
  });

  return multer({ storage });
}

export const aboutUpload = createUpload("about");
