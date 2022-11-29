import { StatusPanel } from "../models/StatusPanel.js";
import { imagesService } from "../services/images-service.js";
import { productsService } from "../services/products-service.js";
import { elementController } from "./element-controller.js";

const load = () => {
  const form = document.querySelector('[data-form="editor"]');

  form.addEventListener("submit", options.add);
};

const options = {
  add: (e) => {
    e.preventDefault();

    const form = document.querySelector('[data-form="editor"]');
    
    add(form).then((status) => {
      const panel = elementController.generate("div", "status__panel");
      const dataMain = document.querySelector('.editor');
      elementController.render(status, panel);
      form.remove();
      elementController.render(panel, dataMain);
    });
  },
};

const add = async (form) => {
  const elements = form.elements;
  const image = elements["image"].files[0];

  const product = {
    name: elements["product"].value,
    price: elements["price"].value,
    category: elements["category"].value,
    description: elements["description"].value,
    image: image.name,
  };

  try {
    await productsService.add(product);
    await imagesService.add(image);
  } catch (error) {
    return new StatusPanel("fail", "add");
  }

  return new StatusPanel("success", "add");
};

export const editorController = {
  load,
};
