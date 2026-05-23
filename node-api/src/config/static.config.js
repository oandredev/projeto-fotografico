import express from "express";
import { UPLOAD_ROOT } from "./upload-path.js";

export function setupStatic(app) {
  app.use("/uploads", express.static(UPLOAD_ROOT));
}
