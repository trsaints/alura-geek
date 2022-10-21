import { elementController } from "../controllers/element-controller.js";

export class ProductPanel {
  #generateBanner = (product) => {
    const img = elementController.generate("img", "product__panel--image");

    img.setAttribute("src", `./app/assets/images/${product.image}`);

    return img;
  };

  #generateContent = (product) => {
    const frag = document.createDocumentFragment();

    const heading = elementController.generate("h3", "product__panel--title");
    const desc = elementController.generate("p", "product__panel--description");
    const value = elementController.generate("span", "product__panel--price");

    const {name, description, price} = product;

    heading.textContent = name;
    desc.textContent = description;
    value.textContent = `R$ ${price}`;

    elementController.render(heading, frag);
    elementController.render(desc, frag);
    elementController.render(value, frag);

    return frag;
  };

  #generate = (product) => {
    const frag = document.createDocumentFragment();

    const banner = elementController.generate("figure", "product__panel--banner");
    const content = elementController.generate("article", "product__panel--content");

    const contents = {
      banner: this.#generateBanner(product),
      content: this.#generateContent(product),
    };

    elementController.render(contents.banner, banner);
    elementController.render(contents.content, content);
    elementController.render(banner, frag);
    elementController.render(content, frag);

    return frag;
  };

  constructor(product) {
    return this.#generate(product);
  }
}
