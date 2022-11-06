import { contextController } from "./controllers/context-controller.js";
import { contextService } from "./services/context-service.js";
import { productsService } from "./services/products-service.js";

(() => {
  const preLoadStatus = productsService.checkPreLoad();

  const control = () => {
    const contextWrapper = document.querySelector("[data-context]");

    const dataLoaders = document.querySelectorAll("[data-load]");

    dataLoaders.forEach((loader) =>
      loader.addEventListener("click", () => {
        contextService.set(contextWrapper, loader.dataset.load);
      })
    );

    contextController.observe(contextWrapper);

    contextService.set(contextWrapper, "index");
  };

  if (preLoadStatus === "true") {
    control();
  } else {
    productsService.configure();
    control();
  }
})();
