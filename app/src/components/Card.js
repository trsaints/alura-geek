import { imagesController } from "../controllers/images-controller.js";
import { ClassElement } from "./ClassElement.js";
import { Icon } from "./Icon.js";

export class Card extends ClassElement {
  #generateBanner = (product) => {
    const fig = new ClassElement("figure", "card__figure");
    const caption = new ClassElement("figcaption", "card__figure--caption");
    const img = new ClassElement("img", "card__figure--image");

    const nameSpan = new ClassElement("span", "sr-only");
    nameSpan.textContent = "Nome: ";

    const { name, image } = product;

    const nameTag = document.createTextNode(name);

    img.setAttribute("alt", `Imagem de ${name}`);
    imagesController.setURL(image, img);

    caption.appendChild(nameSpan);
    caption.appendChild(nameTag);
    fig.appendChild(caption);
    fig.appendChild(img);

    return fig;
  };

  #generateInfo = (product) => {
    const contentPrice = new ClassElement("p", "card__content--price");

    const { price } = product;

    const screenreaderSpan = new ClassElement("span", "sr-only");

    const valueTag = document.createTextNode(`R$${price}`);
    screenreaderSpan.textContent = "Preço: ";

    contentPrice.appendChild(screenreaderSpan);
    contentPrice.appendChild(valueTag);

    return contentPrice;
  };

  #setOption = (product, context) => {
    const { id } = product;

    const options = {
      index: () => this.#generateButton("view"),
      search: () => options.index(),
      products: () => options.index(),
      editor: () => {
        const editButton = this.#generateButton("edit");
        const deleteButton = this.#generateButton("remove");
        const actionsWrapper = new ClassElement("div", "card__actions");

        editButton.setAttribute("data-editor-action", "edit");
        deleteButton.setAttribute("data-editor-action", "delete");

        actionsWrapper.appendChild(editButton);
        actionsWrapper.appendChild(deleteButton);

        return actionsWrapper;
      },
    };

    const result = options[context]();
    result.setAttribute("data-product-id", id);
    return result;
  };

  #generateButton = (action) => {
    const contentValues = {
      view: {
        text: "Ver Produto ",
        icon: "arrow-up-right-from-square",
      },
      edit: {
        text: "Editar Produto ",
        icon: "pencil",
      },
      remove: {
        text: "Excluir Produto ",
        icon: "trash-can",
      },
    };

    const button = new ClassElement("button", "card__button");
    button.setAttribute("type", "button");

    const { text, icon } = contentValues[action];
    const isEditorAction = action === "edit" || action === "remove";

    const buttonText = document.createTextNode(text);
    const buttonIcon = new Icon(icon);

    if (isEditorAction) {
      const srSpan = new ClassElement("span", "sr-only");
      srSpan.appendChild(buttonText);
      button.appendChild(srSpan);
    } else {
      button.appendChild(buttonText);
    }

    button.appendChild(buttonIcon);

    return button;
  };

  #generateContent = (product, context) => {
    const wrapper = new ClassElement("div", "card__option");
    const actions = this.#setOption(product, context);
    const price = this.#generateInfo(product);

    wrapper.appendChild(price);
    wrapper.appendChild(actions);

    return wrapper;
  };

  constructor(product, context) {
    const card = super("li", "products__card");

    card.appendChild(this.#generateBanner(product));
    card.appendChild(this.#generateContent(product, context));

    return card;
  }
}
