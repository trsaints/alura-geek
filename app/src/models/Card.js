import { elementController } from "../controllers/element-controller.js";
import { imagesController } from "../controllers/images-controller.js";

export class Card {
  #generateBanner = (product) => {
    const fig = elementController.generate("figure", "card__figure");
    const caption = elementController.generate(
      "figcaption",
      "card__figure--caption"
    );
    const img = elementController.generate("img", "card__figure--image");

    const nameSpan = elementController.generate("span", "sr-only")
    nameSpan.textContent = 'Nome: '

    const { name, image } = product;
    
    const nameTag = document.createTextNode(name)

    img.setAttribute("alt", `Imagem de ${name}`);
    imagesController.setURL(image, img);

    elementController.render(nameSpan, caption)
    elementController.render(nameTag, caption)
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
    const button = elementController.generate("button", "product__button");
    button.setAttribute("type", "button");
    button.dataset.productId = product.id;
    button.textContent = "Ver Produto";

    return button;
  };

  #generate = (product) => {
    const frag = document.createDocumentFragment();
    const li = elementController.generate("li", "card");
    elementController.render(this.#generateBanner(product), li);
    elementController.render(this.#generateContent(product), li);
    elementController.render(this.#generateButton(product), li);
    elementController.render(li, frag);

    return frag;
  };

  constructor(product) {
    return this.#generate(product);
  }
}
