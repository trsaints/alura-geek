import { contextController } from "./controllers/context-controller.js";
import { contextService } from "./services/context-service.js";
import { imagesService } from "./services/images-service.js";
import { productsService } from "./services/products-service.js";

(async () => {
  const preLoadStatus = productsService.checkPreLoad() === "true";

  const control = () => {
    const contextWrapper = document.querySelector("[data-context]");

    const dataLoaders = document.querySelectorAll("[data-load]");

    const searchForm = document.querySelector('[data-form="search"]')

    dataLoaders.forEach((loader) =>
      loader.addEventListener("click", () => {
        contextService.set(contextWrapper, loader.dataset.load);
      })
    );

    contextController.observe(contextWrapper);

    contextService.set(contextWrapper, "index");

    searchForm.addEventListener('submit', (e) => e.preventDefault())
  };

  if (preLoadStatus) {
    control();
  } else {
    await productsService.configure();
    await imagesService.configure();
    control();
  }
})();
