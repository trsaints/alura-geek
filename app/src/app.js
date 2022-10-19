import { contextController } from "./controllers/context-controller.js";
import { contextService } from "./services/context-service.js";
import { databaseService } from "./services/database-service.js";

(() => {
  const contextWrapper = document.querySelector("[data-context]");

  const dataLoaders = document.querySelectorAll("[data-load]");

  dataLoaders.forEach((loader) =>
    loader.addEventListener("click", () => {
      contextService.set(contextWrapper, loader.dataset.load);
    })
  );

  if (!databaseService.checkPreLoad()) {
    databaseService.configure();
  }

  contextController.observe(contextWrapper);

  contextService.set(contextWrapper, "index");
})();
