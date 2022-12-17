import { elementController } from "../controllers/element-controller.js";
import { iconController } from "../controllers/icon-controller.js";
import { imagesController } from "../controllers/images-controller.js";

export class ProductPanel {
  #generateButtons = () => {
    const backButton = elementController.generate(
      "button",
      "product__panel--close"
    );
    const buttonText = document.createTextNode(" Voltar");
    const buttonIcon = iconController.generate("arrow-left");
    backButton.setAttribute("type", "button");
    backButton.setAttribute("data-panel", "back");

    elementController.render(buttonIcon, backButton);
    elementController.render(buttonText, backButton);

    return backButton;
  };

  #generateBanner = (product) => {
    const img = elementController.generate("img", "product__panel--image");
    const { image } = product;

    imagesController.setURL(image, img);

    return img;
  };

  #generateContent = (product) => {
    const frag = document.createDocumentFragment();

    const heading = elementController.generate("h3", "product__panel--title");
    const desc = elementController.generate("p", "product__panel--description");
    const value = elementController.generate("span", "product__panel--price");
    const tag = elementController.generate("span", "product__panel--tag");
    const tagIcon = iconController.generate("tag");

    const { name, description, price, category } = product;

    const categories = {
      actionFigures: "Action Figures ",
      keyrings: "Chaveiros ",
      canvases: "Quadros ",
      consoles: "Consoles ",
    };

    const tagText = document.createTextNode(categories[category]);

    elementController.render(tagText, tag);
    elementController.render(tagIcon, tag);

    heading.textContent = name;
    desc.textContent = description;
    value.textContent = `R$ ${price}`;

    elementController.render(heading, frag);
    elementController.render(tag, frag);
    elementController.render(desc, frag);
    elementController.render(value, frag);

    return frag;
  };

  #generate = (product) => {
    const frag = document.createDocumentFragment();

    const banner = elementController.generate(
      "figure",
      "product__panel--banner"
    );
    const content = elementController.generate(
      "article",
      "product__panel--content"
    );

    const contents = {
      banner: this.#generateBanner(product),
      content: this.#generateContent(product),
      backButton: this.#generateButtons(),
    };

    elementController.render(contents.banner, banner);
    elementController.render(contents.content, content);
    elementController.render(contents.backButton, frag);
    elementController.render(banner, frag);
    elementController.render(content, frag);

    return frag;
  };

  constructor(product) {
    return this.#generate(product);
  }
}
