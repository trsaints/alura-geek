import { elementController } from "../controllers/element-controller.js";

export class ProductPanel {
  #generateBanner = (product) => {
    const img = elementController.generate("img", "product__panel--banner");

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
    value.textContent = price;

    elementController.render(heading, frag);
    elementController.render(desc, frag);
    elementController.render(value, frag);

    return frag;
  };

  #generate = (product, category) => {
    const frag = document.createDocumentFragment();

    const content = {
      banner: this.#generateBanner(product),
      content: this.#generateContent(product),
    };

    console.log(category)

    elementController.render(content.banner, frag);
    elementController.render(content.content, frag);

    return frag;
  };

  constructor(product, category) {
    return this.#generate(product, category);
  }
}
