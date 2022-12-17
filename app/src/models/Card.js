import { elementController } from "../controllers/element-controller.js";
import { imagesController } from "../controllers/images-controller.js";
import { iconController } from "../controllers/icon-controller.js";

export class Card {
  #generateBanner = (product) => {
    const fig = elementController.generate("figure", "card__figure");
    const caption = elementController.generate(
      "figcaption",
      "card__figure--caption"
    );
    const img = elementController.generate("img", "card__figure--image");

    const nameSpan = elementController.generate("span", "sr-only");
    nameSpan.textContent = "Nome: ";

    const { name, image } = product;

    const nameTag = document.createTextNode(name);

    img.setAttribute("alt", `Imagem de ${name}`);
    imagesController.setURL(image, img);

    elementController.render(nameSpan, caption);
    elementController.render(nameTag, caption);
    elementController.render(caption, fig);
    elementController.render(img, fig);

    return fig;
  };

  #generateInfo = (product) => {
    const value = elementController.generate("p", "card__content--price");

    const { price } = product;

    const screenreaderSpan = elementController.generate("span", "sr-only");

    const valueTag = document.createTextNode(`R$${price}`);
    screenreaderSpan.textContent = "Preço: ";
    elementController.render(screenreaderSpan, value);
    elementController.render(valueTag, value);

    return value;
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
        const actionsWrapper = elementController.generate(
          "div",
          "card__actions"
        );

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

    const button = elementController.generate("button", "card__button");
    button.setAttribute("type", "button");

    const option = contentValues[action];
    const isEditorAction = action === 'edit' || action === 'remove'

    const buttonText = document.createTextNode(option.text);
    const buttonIcon = iconController.generate(option.icon);

    if (isEditorAction) {
      const srSpan = elementController.generate('span', 'sr-only')
      srSpan.appendChild(buttonText)
      button.appendChild(srSpan);
    } else {
      button.appendChild(buttonText)
    }

    button.appendChild(buttonIcon);

    return button;
  };

  #generateContent = (product, context) => {
    const wrapper = elementController.generate("div", "card__option");
    const actions = this.#setOption(product, context);
    const price = this.#generateInfo(product);

    wrapper.appendChild(price);
    wrapper.appendChild(actions);

    return wrapper;
  };

  #generate = (product, context) => {
    const frag = document.createDocumentFragment();
    const li = elementController.generate("li", "products__card");
    elementController.render(this.#generateBanner(product), li);
    elementController.render(this.#generateContent(product, context), li);
    elementController.render(li, frag);

    return frag;
  };

  constructor(product, context) {
    return this.#generate(product, context);
  }
}
