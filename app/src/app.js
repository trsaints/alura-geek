import { contextController } from "./controllers/context-controller.js";
import { imagesService } from "./services/images-service.js";
import { productsService } from "./services/products-service.js";

(async () => {
  const preLoadStatus = productsService.checkPreLoad() === "true";

  const control = () => {
    contextController.observe();
    contextController.set("index");

    const searchForm = document.querySelector('[data-form="search"]');
    searchForm.addEventListener("submit", (e) => e.preventDefault());

    document.addEventListener("click", (e) => {
      const { target } = e;
      const dataLoader = target.closest("[data-load]");

      if (dataLoader)
        contextController.set(dataLoader.getAttribute("data-load"));
    });
  };

  if (preLoadStatus) {
    control();
  } else {
    await productsService.configure();
    await imagesService.configure();
    control();
  }
})();
