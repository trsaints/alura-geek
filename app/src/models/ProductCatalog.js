import { elementController } from "../controllers/element-controller.js";
import { iconController } from "../controllers/icon-controller.js";
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

  #changeIcon = (button) => {
    const target = button
      .closest("[data-catalog]")
      .querySelector(".products__list");

    let statusText = "Ocultar ";

    const buttonIcon = iconController.generate("eye");

    if (target.classList.contains("hidden")) {
      statusText = "Mostrar ";
      buttonIcon.classList.remove("fa-eye-slash");
      buttonIcon.classList.add("fa-eye");
    } else {
      statusText = "Ocultar ";
      buttonIcon.classList.remove("fa-eye");
      buttonIcon.classList.add("fa-eye-slash");
    }

    button.textContent = statusText;
    elementController.render(buttonIcon, button);
  };

  #setOption = {
    index: (button) => {
      button.setAttribute("data-load", "products");
      button.setAttribute("type", "button");

      const rightArrow = iconController.generate("arrow-right");

      const buttonText = document.createTextNode("Ver Todos ");

      button.appendChild(buttonText);
      button.appendChild(rightArrow);
    },

    products: (button) => {
      button.setAttribute("data-toggle", "list");
      button.textContent = "Ocultar ";

      const buttonIcon = iconController.generate("eye-slash");
      elementController.render(buttonIcon, button);

      button.addEventListener("click", () => {
        const target = button
          .closest("[data-catalog]")
          .querySelector(".products__list");
        elementController.toggle(target);

        this.#changeIcon(button);
      });
    },

    search: (button) => {
      this.#setOption.index(button);
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

  #generateHeader = (context, heading) => {
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

    const titleText = document.createTextNode(categories[heading])
    const titleSpan = elementController.generate("span", 'sr-only');
    titleSpan.textContent = 'Categoria: '

    elementController.render(titleSpan, title)
    elementController.render(titleText, title)

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
