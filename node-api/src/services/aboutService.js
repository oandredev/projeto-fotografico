import * as repo from "../repository/aboutRepository.js";

export async function addAbout(about) {
  if (!about) {
    throw new Error("About data is required");
  }

  if (!about.presentationText || about.presentationText.trim() === "") {
    throw new Error("Presentation text is required");
  }

  if (about.imageUrl && typeof about.imageUrl !== "string") {
    throw new Error("Invalid image url");
  }

  let id = await repo.saveAbout(about);

  return id;
}

export async function getAbout(filter) {
  let result = await repo.getAbout(filter);
  return result;
}

export async function updateAbout(id, about) {
  if (!id || isNaN(id) || id <= 0) {
    throw new Error("Invalid id");
  }

  if (!about) {
    throw new Error("About data is required");
  }

  if (!about.presentationText || about.presentationText.trim() === "") {
    throw new Error("Presentation text is required");
  }

  return await repo.saveAbout(about); // Save/Update
}

export async function deleteAbout(id) {
  let lines = await repo.deleteAbout(id);
  return lines;
}

export async function getAboutById(id) {
  let line = await repo.getAboutById(id);
  return line;
}
