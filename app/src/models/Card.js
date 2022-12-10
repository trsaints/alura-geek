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

  #generateContent = (product) => {
    const value = elementController.generate("p", "card__content--price");

    const { price } = product;

    const screenreaderSpan = elementController.generate("span", "sr-only");

    const valueTag = document.createTextNode(`R$${price}`);
    screenreaderSpan.textContent = "Preço: ";
    elementController.render(screenreaderSpan, value);
    elementController.render(valueTag, value);

    return value;
  };

  #generateButton = (product) => {
    const button = elementController.generate("button", "card__button");
    button.setAttribute("type", "button");
    button.dataset.productId = product.id;
    const buttonText = document.createTextNode("Ver Produto ");
    const buttonIcon = iconController.generate("up-right-from-square");

    button.appendChild(buttonText);
    button.appendChild(buttonIcon);

    return button;
  };

  #generateOption = (product) => {
    const wrapper = elementController.generate("div", "card__option");
    const button = this.#generateButton(product);
    const price = this.#generateContent(product);

    wrapper.appendChild(price);
    wrapper.appendChild(button);

    return wrapper;
  };

  #generate = (product) => {
    const frag = document.createDocumentFragment();
    const li = elementController.generate("li", "products__card");
    elementController.render(this.#generateBanner(product), li);
    elementController.render(this.#generateOption(product), li);
    elementController.render(li, frag);

    return frag;
  };

  constructor(product) {
    return this.#generate(product);
  }
}
