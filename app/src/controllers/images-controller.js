import { imagesService } from "../services/images-service.js";

const setURL = async (image, target) => {
  const { name } = await imagesService.load(image);
  const fileURL = localStorage.getItem(name);
  
  try {
    target.setAttribute("src", fileURL);
  } catch (error) {
    console.error(error);
  }
};

export const imagesController = {
  setURL,
};
