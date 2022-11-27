import { ProductCatalog } from "../models/ProductCatalog.js";
import { ProductPanel } from "../models/ProductPanel.js";
import { productsService } from "../services/products-service.js";
import { elementController } from "./element-controller.js";

const renderPanel = (category, id, target) => {
  productsService.loadCategory(category).then((products) => {
    const mainProduct = products.filter((product) => product.id === Number(id));

    const panel = elementController.generate("div", "product__panel");

    elementController.render(new ProductPanel(mainProduct[0]), panel);
    elementController.render(new ProductCatalog(products, category), panel);
    elementController.render(panel, target);
  });
};

const setRendering = (evt) => {
  const target = evt.target;
  const isProductLoader = target.dataset.productId !== undefined;

  if (isProductLoader) {
    const productId = target.dataset.productId;
    const productCategory = target
      .closest("[data-catalog]")
      .getAttribute("data-catalog");
    const main = document.querySelector("main");
    const panel = document.querySelector(".product__panel");

    if (panel) {
      panel.remove();
    }

    renderPanel(productCategory, productId, main);
  }
};

const renderCatalogs = () => {
  const contentWrapper = document.querySelector("[data-content]");

  const categories = ["actionFigures", "consoles", "canvases", "keyrings"];

  categories.forEach(async (category) => {
    const list = await productsService.loadCategory(category);

    elementController.render(
      new ProductCatalog(list, category),
      contentWrapper
    );
  });
};

export const productsController = {
  renderCatalogs,
  setRendering,
};
