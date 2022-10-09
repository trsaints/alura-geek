import { contextController } from "./controllers/context-controller.js";
import { productsController } from "./controllers/products-controller.js";
import { contextService } from "./services/context-service.js";
import { databaseService } from "./services/database-service.js";

(() => {
  const productBtn = document.querySelector('[data-load="products"]');
  const loginBtn = document.querySelector('[data-load="login"]');
  const searchBtn = document.querySelector('[data-load="search"]');
  const contextWrapper = document.querySelector("[data-context]");

  productBtn.addEventListener("click", () => {
    contextController.render("products");
  });

  searchBtn.addEventListener("click", () => {
    contextController.render("search");
  });

  loginBtn.addEventListener("click", () => {
    loginBtn.remove();
    contextController.render("login");
  });

  if (!databaseService.checkPreLoad()) {
    databaseService.configure();
  }

  if (contextService.check(contextWrapper, "index")) {
    productsController.renderCatalogs();
  }
})();
