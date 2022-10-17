import { ProductCatalog } from "../models/ProductCatalog.js";
import { contextService } from "../services/context-service.js";
import { databaseService } from "../services/database-service.js";
import { elementController } from "./element-controller.js";

const renderProduct = () => {};

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
  const catalogs = contentWrapper.querySelectorAll("[data-catalog]");

  catalogs.forEach((catalog) => {
    const category = catalog.getAttribute("data-catalog");

    renderCatalog(category, catalog);
  });
};

export const productsController = {
  renderCatalogs,
};
