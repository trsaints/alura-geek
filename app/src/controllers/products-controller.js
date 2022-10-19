import { ProductCatalog } from "../models/ProductCatalog.js";
import { ProductPanel } from "../models/ProductPanel.js";
import { contextService } from "../services/context-service.js";
import { databaseService } from "../services/database-service.js";
import { elementController } from "./element-controller.js";

const renderPanel = (keyPath, id, target) => {
  databaseService.load(keyPath).then((products) => {
    const mainProduct = products[keyPath].filter(
      (product) => product.id === id
    );

    const context = contextService.get(document.body);

    const panel = elementController.generate("div", "product__panel");

    elementController.render(new ProductPanel(mainProduct[0], keyPath), panel);
    elementController.render(new ProductCatalog(context, products), panel);

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

const renderCatalog = (category, target) => {
  if (!databaseService.checkPreLoad()) {
    return;
  }

  databaseService.loadAll("products").then((data) => {
    const context = contextService.get(document.body);
    const products = data.filter((list) => list.category === category)[0];
    elementController.render(new ProductCatalog(context, products), target);
  });
};

const renderCatalogs = () => {
  const contentWrapper = document.querySelector("[data-content]");

  databaseService.loadAll("products").then((catalogs) => {
    const context = contextService.get(document.body);
   
    catalogs.forEach(catalog => {
      elementController.render(new ProductCatalog(context, catalog), contentWrapper)
    })
  })
};

export const productsController = {
  renderCatalogs,
  renderCatalog,
  setRendering,
};
