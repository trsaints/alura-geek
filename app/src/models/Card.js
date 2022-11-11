import { elementController } from "../controllers/element-controller.js";
import { imagesService } from "../services/images-service.js";

export class Card {
  #setURL = (file, target) => {
    imagesService.load(file).then((ref) => {
      const href = URL.createObjectURL(ref.file);
      target.setAttribute("src", href);
    });
  };

  #generateBanner = (product) => {
    const fig = elementController.generate("figure", "card__figure");
    const caption = elementController.generate(
      "figcaption",
      "card__figure--caption"
    );
    const img = elementController.generate("img", "card__figure--image");

    const { name, image } = product;

    this.#setURL(image, img);

    caption.textContent = name;

    elementController.render(caption, fig);
    elementController.render(img, fig);

    return fig;
  };

  #generateContent = (product) => {
    const wrapper = elementController.generate("div", "card__content");
    const desc = elementController.generate("p", "card__content--desc");
    const price = elementController.generate("span", "card__content--price");

    const content = {
      desc: product.desc,
      price: product.price,
    };

    price.textContent = `R$ ${content.price}`;
    desc.textContent = content.desc;

    elementController.render(desc, wrapper);
    elementController.render(price, wrapper);

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
