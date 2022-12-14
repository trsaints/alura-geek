import { contextService } from "../services/context-service.js";
import { editorController } from "./editor-controller.js";
import { loginController } from "./login-controller.js";
import { productsController } from "./products-controller.js";
import { searchController } from "./search-controller.js";

const load = (page) => {
  const main = document.querySelector("main");
  main.remove();
  document.body.insertBefore(page, document.body.childNodes[2]);
};

const set = (context) => {
  const contextWrapper = document.querySelector("body");
  contextWrapper.setAttribute("data-context", context);
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

    window.location.href = "#";

    document.addEventListener("click", productsController.setRendering);
  },

  search: () => {
    const searchForm = document.querySelector('[data-form="search"]');
    const searchBar = searchForm.elements["search"];

    if (searchBar.validity.valueMissing) {
      searchBar.focus();
    } else {
      render("search");

      setTimeout(async () => {
        document.addEventListener("click", productsController.setRendering);

        try {
          await searchController.render(searchBar.value);
        } catch (error) {
          console.error(error);
        }
      }, 200);
    }
  },

  login: () => {
    render("login");

    setTimeout(() => {
      const form = document.querySelector("[data-login='form']");
      loginController.load(form);
    }, 200);
  },

  index: () => {
    setTimeout(productsController.renderCatalogs, 200);

    document.addEventListener("click", productsController.setRendering);
  },

  editor: () => {
    render("editor");
    setTimeout(editorController.load, 200);

    document.addEventListener("click", editorController.setRendering);
  },
};

const checkMutation = (mutationList, _observer) => {
  mutationList.forEach((mutation) => {
    const hasChangedContext =
      mutation.type === "attributes" && contextService.get() !== undefined;

    if (hasChangedContext) {
      document.removeEventListener("click", productsController.setRendering);

      const context = contextService.get();
      renderFactory[context]();
    }
  });
};

const observe = () => {
  const contextWrapper = document.querySelector("[data-context]");

  const config = {
    attributes: true,
    childList: false,
    subtree: false,
  };

  const observer = new MutationObserver(checkMutation);

  observer.observe(contextWrapper, config);
};

export const contextController = {
  observe,
  set,
};
