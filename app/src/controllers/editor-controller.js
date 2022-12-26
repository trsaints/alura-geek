import { StatusPanel } from "../components/StatusPanel.js";
import { imagesService } from "../services/images-service.js";
import { productsService } from "../services/products-service.js";
import { elementController } from "./element-controller.js";
import { productsController } from "./products-controller.js";

const load = () => {
  const resetModal = document.querySelector('[data-editor="reset"]');
  const resetButton = resetModal.querySelector('[data-reset="confirm"]');
  const noResetButton = resetModal.querySelector('[data-reset="cancel"]');
  const buttons = document.querySelectorAll("[data-option]");

  resetButton.addEventListener("click", () => {
    productsService.reset();
    imagesService.reset();

    window.location.reload();
  });

  noResetButton.addEventListener("click", () => {
    console.log(noResetButton);
    elementController.hide(resetModal);
    resetModal.close();
  });

  buttons.forEach((button) => {
    const { option } = button.dataset;

    button.addEventListener("click", menu[option]);
  });
};

const menu = {
  create: () => {
    const editorForm = document.querySelector('[data-editor="form"]');
    const editorCatalog = document.querySelector('[data-content="catalog"]');
    const editorNavbar = document.querySelector('[data-content="navbar"]');
    const form = document.querySelector('[data-form="editor"]');

    elementController.show(editorForm);
    elementController.clear(editorCatalog);
    elementController.hide(editorNavbar);

    form.addEventListener("submit", add);
  },

  list: () => {
    const editorForm = document.querySelector('[data-editor="form"]');
    const editorCatalog = document.querySelector('[data-content="catalog"]');
    const editorNavbar = document.querySelector('[data-content="navbar"]');
    const form = document.querySelector('[data-form="editor"]');

    elementController.clear(editorCatalog);
    elementController.show(editorCatalog);
    elementController.show(editorNavbar);

    productsController.renderCatalogs();

    elementController.hide(editorForm);
    form.removeEventListener("submit", add);
  },

  reset: () => {
    const modal = document.querySelector('[data-editor="reset"]');

    elementController.show(modal);
    modal.showModal();
  },
};

const add = () => {
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
    productsService.add(product);
    imagesService.add(image);
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

const setRendering = (e) => {
  const { target } = e;

  const { editorAction } = target.dataset;

  if (editorAction === undefined) return;

  const { productId } = target.closest("[data-product-id]").dataset;

  editorOptions[editorAction](productId);

  const actionModal = document.querySelector('[data-editor="warning"]');
  const deleteButton = actionModal.querySelector('[data-warning="confirm"]');
  const cancelButton = actionModal.querySelector('[data-warning="cancel"]');

  deleteButton.addEventListener("click", () => {
    remove(productId);
  });

  cancelButton.addEventListener("click", () => {
    elementController.hide(actionModal);
    actionModal.close();
  });
};

const remove = async (id) => {
  const editorMenu = document.querySelector('[data-editor="menu"]');
  const editor = document.querySelector('[data-main="context"]');
  const ID = Number(id);

  const product = await productsService.load(ID);
  const { image } = product;

  if (product === undefined) return;

  try {
    productsService.remove(ID);
    imagesService.remove(image);
  } catch (error) {
    editorMenu.remove();
    elementController.clear(editor);
    editor.appendChild(new StatusPanel("fail", "remove"));
    return;
  }

  editorMenu.remove();
  elementController.clear(editor);
  editor.appendChild(new StatusPanel("success", "remove"));
};

const showModal = async (id) => {
  const modal = document.querySelector('[data-editor="warning"]');
  const modalTitle = modal.querySelector('[data-warning="content"]');

  const product = await productsService.load(Number(id));
  const { name } = product;

  if (product === undefined) return;

  try {
    modalTitle.textContent = name;
    elementController.show(modal);
    modal.showModal();
  } catch (error) {
    console.error(error);
  }
};

const editorOptions = {
  remove: (id) => showModal(id),
  edit: (id) => edit(id),
};

export const editorController = {
  load,
  setRendering,
};
