import { imagesService } from "../services/images-service.js";

const setURL = async (image, target) => {
  const file = await imagesService.load(image);
  const fileURL = localStorage.getItem(file.name);

  target.setAttribute("src", fileURL);
};

export const imagesController = {
  setURL,
};
