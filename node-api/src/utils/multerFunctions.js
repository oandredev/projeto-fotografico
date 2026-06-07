import { UPLOAD_ROOT } from "../config/upload-path.js";
import fs from "fs";
import path from "path";

export function resolveUploadPath(imageUrl) {
  return path.join(UPLOAD_ROOT, imageUrl.replace(/^\/uploads/, ""));
}

export function deleteFile(imageUrl) {
  const filePath = resolveUploadPath(imageUrl);
  if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
}
