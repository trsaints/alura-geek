import { imagesService } from "../services/images-service.js";
import { productsService } from "../services/products-service.js";

const load = () => {
  const form = document.querySelector('[data-form="editor"]');

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    add(form);
  });
};

const add = async (form) => {
  const elements = form.elements;
  const product = {
    name: elements["product"].value,
    price: elements["price"].value,
    category: elements["category"].value,
    description: elements["description"].value,
    image: elements["image"].files[0].name,
  };

  await productsService.add(product);
  await imagesService.add(elements["image"].files[0]);
};

export const editorController = {
  load
};