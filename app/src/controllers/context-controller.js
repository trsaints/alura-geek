import { contextService } from "../services/context-service.js";
import { elementController } from "./element-controller.js";

let load = (page) => {
  const main = document.querySelector("main");
  elementController.clear(main);
  main.appendChild(page);
};

let loadPage = (page, target, context) => {
  const parser = new DOMParser();

  const result = parser.parseFromString(page, "text/html");
  const resultMain = result.querySelector("[data-load='context']");

  document.body.setAttribute("data-context", context);

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
    .then((page) => loadPage(page, frag, context))
    .catch((error) => loadPlaceholder(error, frag))
    .finally(() => load(frag));
};

export const contextController = {
  render,
};
