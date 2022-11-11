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

    const { name, image } = product;

    imagesController.setURL(image, img);

    caption.textContent = name;

    elementController.render(caption, fig);
    elementController.render(img, fig);

    return fig;
  };

  #generateContent = (product) => {
    const wrapper = elementController.generate("div", "card__content");
    const para = elementController.generate("p", "card__content--desc");
    const value = elementController.generate("span", "card__content--price");

    const { desc, price } = product;

    value.textContent = `R$ ${price}`;
    para.textContent = desc;

    elementController.render(para, wrapper);
    elementController.render(value, wrapper);

    return wrapper;
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
