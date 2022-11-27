import { imagesService } from "../services/images-service.js";

const setURL = (image, target) => {
  imagesService.load(image).then((file) => {
    const href = URL.createObjectURL(file);
    target.setAttribute("src", href);
  });
};

export const imagesController = {
  setURL,
};