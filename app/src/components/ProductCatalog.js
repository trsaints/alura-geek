import { elementController } from "../controllers/element-controller.js";
import { contextService } from "../services/context-service.js";
import { Card } from "./Card.js";
import { ClassElement } from "./ClassElement.js";
import { Icon } from "./Icon.js";

export class ProductCatalog extends ClassElement {
  #renderCard = (product, target) => {
    const card = new Card(product, contextService.get());
    target.appendChild(card);
  };

  #generateList = (products) => {
    const ul = new ClassElement("ul", "products__list");

    products.forEach((product) => this.#renderCard(product, ul));

    return ul;
  };

  #changeIcon = (button) => {
    const target = button
      .closest("[data-catalog]")
      .querySelector(".products__list");

    let statusText = "Ocultar ";

    const buttonIcon = new Icon("eye");

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
    button.appendChild(buttonIcon);
  };

  #setOption = {
    index: (button) => {
      button.setAttribute("data-load", "products");
      button.setAttribute("type", "button");

      const rightArrow = new Icon("arrow-right");

      const buttonText = document.createTextNode("Ver Todos ");

      button.appendChild(buttonText);
      button.appendChild(rightArrow);
    },

    products: (button) => {
      button.setAttribute("data-toggle", "list");
      button.setAttribute("type", "button");
      button.textContent = "Ocultar ";

      const buttonIcon = new Icon("eye-slash");
      button.appendChild(buttonIcon);

      button.addEventListener("click", () => {
        const target = button
          .closest("[data-catalog]")
          .querySelector(".products__list");
        elementController.toggle(target);

        this.#changeIcon(button);
      });
    },

    search: (button) => this.#setOption.index(button),

    editor: (button) => this.#setOption.products(button),
  };

  #generateOption = (context) => {
    const option = new ClassElement("button", "products__header--option");

    this.#setOption[context](option);

    return option;
  };

  #generateHeader = (context, heading) => {
    const header = new ClassElement("header", "products__header");
    const title = new ClassElement("h2", "products__header--title");
    title.setAttribute("id", heading);

    const option = this.#generateOption(context);

    const categories = {
      canvases: "Quadros",
      keyrings: "Chaveiros",
      actionFigures: "Action Figures",
      consoles: "Consoles",
    };

    const titleText = document.createTextNode(categories[heading]);
    const titleSpan = new ClassElement("span", "sr-only");
    titleSpan.textContent = "Categoria: ";

    title.appendChild(titleSpan);
    title.appendChild(titleText);

    header.appendChild(title);
    header.appendChild(option);

    return header;
  };

  constructor(products, category) {
    const context = contextService.get();

    const catalog = super("div", "main__catalog");
    catalog.setAttribute("data-catalog", category);

    const header = this.#generateHeader(context, category);
    const list = this.#generateList(products);

    catalog.appendChild(header);
    catalog.appendChild(list);

    return catalog;
  }
}
