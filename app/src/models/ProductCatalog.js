import { elementController } from "../controllers/element-controller.js";
import { contextService } from "../services/context-service.js";
import { Card } from "./Card.js";

export class ProductCatalog {
  #renderCard = (product, target) => {
    const card = new Card(product);
    elementController.render(card, target);
  };

  #generateList = (products) => {
    const frag = document.createDocumentFragment();
    const ul = elementController.generate("ul", "products__list");

    products.forEach((product) => {
      this.#renderCard(product, ul);
    });

    elementController.render(ul, frag);

    return frag;
  };

  #setOption = {
    index: (button) => {
      button.setAttribute("data-load", "products");
      button.textContent = "Ver Todos";
      button.addEventListener("click", () =>
        contextService.set(document.body, "products")
      );
    },
    products: (button) => {
      button.setAttribute("data-toggle", "list");
      button.textContent = "Ocultar";
      button.addEventListener("click", () => {
        const target = button.closest('[data-catalog]').querySelector('.products__list')
        elementController.toggle(target);

        if (target.classList.contains("hidden")) {
          button.textContent = "Mostrar";
        } else {
          button.textContent = "Ocultar";
        }
      });
    },
  };

  #generateOption = (context) => {
    const option = elementController.generate(
      "button",
      "products__header--option"
    );

    this.#setOption[context](option);

    return option;
  };

  #generateHeader = (context, category) => {
    const frag = document.createDocumentFragment();
    const header = elementController.generate("header", "products__header");
    const title = elementController.generate("h2", "products__header--title");
    const option = this.#generateOption(context);

    const categories = {
      canvases: "Quadros",
      keyrings: "Chaveiros",
      actionFigures: "Action Figures",
      consoles: "Consoles",
    };

    title.textContent = categories[category];

    elementController.render(title, header);
    elementController.render(option, header);
    elementController.render(header, frag);

    return frag;
  };

  #generateCatalog = (products, category) => {
    const context = contextService.get();

    const frag = document.createDocumentFragment();
    const catalog = elementController.generate("div", "main__catalog");
    catalog.dataset.catalog = category;

    const header = this.#generateHeader(context, category);
    const list = this.#generateList(products);

    elementController.render(header, catalog);
    elementController.render(list, catalog);
    elementController.render(catalog, frag);

    return frag;
  };

  constructor(products, category) {
    return this.#generateCatalog(products, category);
  }
}
