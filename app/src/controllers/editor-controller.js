import { StatusPanel } from "../components/StatusPanel.js";
import { imagesService } from "../services/images-service.js";
import { productsService } from "../services/products-service.js";
import { elementController } from "./element-controller.js";
import { productsController } from "./products-controller.js";

const load = () => {
  const buttons = document.querySelectorAll("[data-option]");
  const editorForm = document.querySelector('[data-editor="form"]');
  const editorCatalog = document.querySelector('[data-content="catalog"]');
  const form = document.querySelector('[data-form="editor"]');

  const menuOptions = {
    create: () => {
      elementController.show(editorForm);
      elementController.clear(editorCatalog);

      form.addEventListener("submit", add);
    },

    list: () => {
      elementController.clear(editorCatalog);
      elementController.show(editorCatalog);

      productsController.renderCatalogs();

      elementController.hide(editorForm);
      form.removeEventListener("submit", add);
    },
  };

  buttons.forEach((button) => {
    const { option } = button.dataset;

    button.addEventListener("click", menuOptions[option]);
  });
};

const add = async () => {
  const form = document.querySelector('[data-form="editor"]');
  const editorMenu = document.querySelector('[data-editor="menu"]');
  const formWrapper = document.querySelector('[data-editor="form"]');
  const editor = document.querySelector('[data-main="context"]');

  const { elements } = form;
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
    form.remove();
    formWrapper.remove();
    editorMenu.remove();
    editor.appendChild(new StatusPanel("fail", "add"));
    return;
  }

  form.remove();
  formWrapper.remove();
  editorMenu.remove();
  editor.appendChild(new StatusPanel("success", "add"));
};

const edit = async (id) => {};

const remove = async (id) => {
  try {
  } catch (error) {}
};

export const editorController = {
  load,
};
