import { contextService } from "../services/context-service.js";
import { elementController } from "./element-controller.js";
import { productsController } from "./products-controller.js";

const load = (page) => {
  const main = document.querySelector("main");
  elementController.clear(main);
  main.appendChild(page);
};

const loadPage = (page, target) => {
  const parser = new DOMParser();

  const result = parser.parseFromString(page, "text/html");
  const resultMain = result.querySelector("[data-main='context']");

  target.appendChild(resultMain);
};

const loadPlaceholder = (error, target) => {
  const errorWrapper = document.createElement("h1");
  errorWrapper.textContent =
    "Ops! Algo deu errado. Tente novamente mais tarde.";

  const errorBanner = document.createElement("img");
  errorBanner.setAttribute(
    "src",
    "./app/assets/images/undraw_page_not_found_re_e9o6.svg"
  );

  console.warn(error);

  target.appendChild(errorWrapper);
  target.appendChild(errorBanner);
};

const render = (context) => {
  const frag = document.createDocumentFragment();

  contextService
    .fetch(context)
    .then((page) => loadPage(page, frag))
    .catch((error) => loadPlaceholder(error, frag))
    .finally(() => load(frag));
};

const renderFactory = {
  products: () => {
    render("products");

    setTimeout(productsController.renderCatalogs, 200);

    document.removeEventListener("click", productsController.setRendering);
    document.addEventListener("click", productsController.setRendering);
  },

  search: () => {
    render("search");

    document.removeEventListener("click", productsController.setRendering);
  },

  login: () => {
    render("login");

    document.removeEventListener("click", productsController.setRendering);
  },

  index: () => {
    setTimeout(productsController.renderCatalogs, 200);

    document.removeEventListener("click", productsController.setRendering);
    document.addEventListener("click", productsController.setRendering);
  },
};

const observe = (target) => {
  const config = {
    attributes: true,
    childList: false,
    subtree: false,
  };

  const checkMutation = (mutationList, _observer) => {
    mutationList.forEach((mutation) => {
      const hasChangedContext =
        mutation.type === "attributes" &&
        contextService.get(target) !== undefined;

      if (hasChangedContext) {
        const context = contextService.get(target);
        renderFactory[context]();
        
      }
    });
  };

  const observer = new MutationObserver(checkMutation);

  observer.observe(target, config);
};

export const contextController = {
  observe,
};
