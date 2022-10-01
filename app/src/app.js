import { contextController } from "./controllers/context-controller.js";

(() => {
  const productBtn = document.querySelector('[data-load="products"]');
  const loginBtn = document.querySelector('[data-load="login"]');
  const searchBtn = document.querySelector('[data-load="search"]');

  const contextWrapper = document.querySelector("[data-context]");

  productBtn.addEventListener("click", () => {
    contextController.render("products", contextWrapper);
  });

  searchBtn.addEventListener("click", () => {
    contextController.render("products", contextWrapper);
  });

  loginBtn.addEventListener("click", () => {
    contextController.render("login", contextWrapper);
    loginBtn.remove();
  });
})();
