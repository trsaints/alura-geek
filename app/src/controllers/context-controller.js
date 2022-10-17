import { contextService } from "../services/context-service.js";
import { elementController } from "./element-controller.js";
import { productsController } from "./products-controller.js";

let load = (page) => {
  const main = document.querySelector("main");
  elementController.clear(main);
  main.appendChild(page);
};

let loadPage = (page, target) => {
  const parser = new DOMParser();

  const result = parser.parseFromString(page, "text/html");
  const resultMain = result.querySelector("[data-main='context']");

  target.appendChild(resultMain);
};

let loadPlaceholder = (error, target) => {
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

let render = (context) => {
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

    setTimeout(productsController.renderCatalogs, 500);
  },

  search: () => {
    render("search");
  },

  login: () => {
    render("login");
  },
};

const observe = (target) => {
  const config = {
    attributes: true,
    childList: false,
    subtree: false,
  };

  const checkMutation = (mutationList, observer) => {
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
  observe
};
