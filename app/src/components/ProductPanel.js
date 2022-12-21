import { imagesController } from "../controllers/images-controller.js";
import { ClassElement } from "./ClassElement.js";
import { Icon } from "./Icon.js";

export class ProductPanel extends ClassElement {
  #generateButtons = () => {
    const backButton = new ClassElement("button", "product__panel--close");
    const buttonText = document.createTextNode(" Voltar");
    const buttonIcon = new Icon("arrow-left");
    backButton.setAttribute("type", "button");
    backButton.setAttribute("data-panel", "back");

    backButton.appendChild(buttonIcon);
    backButton.appendChild(buttonText);

    return backButton;
  };

  #generateBanner = (product) => {
    const img = new ClassElement("img", "product__panel--image");
    const { image } = product;

    imagesController.setURL(image, img);

    return img;
  };

  #generateContent = (product) => {
    const frag = document.createDocumentFragment();

    const heading = new ClassElement("h3", "product__panel--title");
    const desc = new ClassElement("p", "product__panel--description");
    const value = new ClassElement("span", "product__panel--price");
    const tag = new ClassElement("span", "product__panel--tag");
    const tagIcon = new Icon("tag");

    const { name, description, price, category } = product;

    const categories = {
      actionFigures: "Action Figures ",
      keyrings: "Chaveiros ",
      canvases: "Quadros ",
      consoles: "Consoles ",
    };

    const tagText = document.createTextNode(categories[category]);

    tag.appendChild(tagText);
    tag.appendChild(tagIcon);

    heading.textContent = name;
    desc.textContent = description;
    value.textContent = `R$ ${price}`;

    frag.appendChild(heading);
    frag.appendChild(tag);
    frag.appendChild(desc);
    frag.appendChild(value);

    return frag;
  };
  
  constructor(product) {
    const panel = super("div", "product__panel");
    panel.setAttribute("id", "product-panel");

    const banner = new ClassElement("figure", "product__panel--banner");
    const content = new ClassElement("article", "product__panel--content");

    const contents = {
      banner: this.#generateBanner(product),
      content: this.#generateContent(product),
      backButton: this.#generateButtons(),
    };

    banner.appendChild(contents.banner);
    content.appendChild(contents.content);
    panel.appendChild(contents.backButton);
    panel.appendChild(banner);
    panel.appendChild(content);

    return panel;
  }
}
