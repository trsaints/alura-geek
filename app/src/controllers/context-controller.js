import { contextService } from "../services/context-service.js";

export const contextController = {
  render(context, target) {
    const frag = document.createDocumentFragment();

    contextService
      .get(context)
      .then((page) => {
        const parser = new DOMParser();

        const result = parser.parseFromString(page, "text/html");
        const resultMain = result.querySelector("main");

        document.body.setAttribute("data-context", context);

        frag.appendChild(resultMain);
      })
      .catch((error) => {
        const errorWrapper = document.createElement("h1");
        errorWrapper.textContent =
          "Ops! Algo deu errado. Tente novamente mais tarde.";

        const errorBanner = document.createElement("img");
        errorBanner.setAttribute(
          "src",
          "./app/assets/images/undraw_page_not_found_re_e9o6.svg"
        );

        console.warn(error);

        frag.appendChild(errorWrapper);
        frag.appendChild(errorBanner);
      })
      .finally(() => {
        const main = document.querySelector("main");
        target.removeChild(main);
        target.insertBefore(frag, target.childNodes[2]);
      });
  },
};
