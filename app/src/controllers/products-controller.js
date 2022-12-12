import { ProductCatalog } from "../models/ProductCatalog.js";
import { ProductPanel } from "../models/ProductPanel.js";
import { contextService } from "../services/context-service.js";
import { productsService } from "../services/products-service.js";
import { elementController } from "./element-controller.js";

const renderPanel = (category, id, target) => {
  productsService.loadCategory(category).then((products) => {
    const mainProduct = products.filter((product) => product.id === Number(id));

    const panel = elementController.generate("div", "product__panel");
    panel.setAttribute("id", "product-panel");

    elementController.render(new ProductPanel(mainProduct[0]), panel);
    elementController.render(panel, target);
    renderCatalog(products, panel);

    const backButton = document.querySelector('[data-panel="back"]');
    const contentWrappers = document.querySelectorAll("[data-content]");

    backButton.addEventListener("click", (e) => {
      const productPanel = e.target.parentNode;
      productPanel.remove();

      contentWrappers.forEach((wrapper) => elementController.show(wrapper));

      setTimeout(() => (window.location.href = `#${category}`), 100);
    });
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
    const mainContents = document.querySelectorAll("[data-content]");
    const panel = document.querySelector(".product__panel");

    if (panel) {
      panel.remove();
    }

    renderPanel(productCategory, productId, main);
    mainContents.forEach((content) => elementController.hide(content));
    setTimeout(() => {
      window.location.href = "#product-panel";
    }, 200);
  }
};

const renderCatalog = (products, target) => {
  if (products[0] !== undefined) {
    const category = products[0].category;

    const options = {
      index: products.slice(0, 6),
      search: products.slice(0, 8),
      products: products,
    };

    const context = contextService.get();

    elementController.render(
      new ProductCatalog(options[context], category),
      target
    );
  }
};

const renderCatalogs = () => {
  const contentWrapper = document.querySelector("[data-content='catalog']");

  const categories = ["actionFigures", "consoles", "canvases", "keyrings"];

  categories.forEach(async (category) => {
    const list = await productsService.loadCategory(category);

    renderCatalog(list, contentWrapper);
  });
};

export const productsController = {
  renderCatalogs,
  renderCatalog,
  setRendering,
};
