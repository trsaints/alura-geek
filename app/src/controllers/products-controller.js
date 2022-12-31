import { ProductCatalog } from "../components/ProductCatalog.js";
import { ProductPanel } from "../components/ProductPanel.js";
import { contextService } from "../services/context-service.js";
import { productsService } from "../services/products-service.js";
import { elementController } from "./element-controller.js";

const renderPanel = async (category, ID, target) => {
  try {
    const products = await productsService.loadAll();
    const categoryList = productsService.loadCategory(products, category);

    const mainProduct = categoryList.filter(({ id }) => id === Number(ID));

    const panel = new ProductPanel(mainProduct[0]);

    target.appendChild(panel);
    renderCatalog(categoryList, panel);
  } catch (error) {
    console.error(error);
  }

  const backButton = document.querySelector('[data-panel="back"]');
  const contentWrappers = document.querySelectorAll("[data-content]");

  backButton.addEventListener("click", (e) => {
    const { parentNode } = e.target;
    parentNode.remove();

    contentWrappers.forEach((wrapper) => elementController.show(wrapper));

    setTimeout(() => (window.location.href = `#${category}`), 100);
  });
};

const setRendering = (evt) => {
  const { target } = evt;
  const isProductLoader = target.dataset.productId !== undefined;

  if (isProductLoader) {
    const { productId } = target.dataset;

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
    const { category } = products[0];

    const options = {
      index: products.slice(0, 6),
      search: products.slice(0, 8),
      products: products,
      editor: products,
    };

    const context = contextService.get();

    target.appendChild(new ProductCatalog(options[context], category));
  }
};

const renderCatalogs = async () => {
  const contentWrapper = document.querySelector("[data-content='catalog']");

  const categories = ["actionFigures", "consoles", "canvases", "keyrings"];

  const list = await productsService.loadAll();

  try {
    categories.forEach(async (category) => {
      const categoryList = productsService.loadCategory(list, category);
      renderCatalog(categoryList, contentWrapper);
    });
  } catch (error) {
    console.error(error);
  }
};

export const productsController = {
  renderCatalogs,
  renderCatalog,
  setRendering,
};
