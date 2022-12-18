import { ClassElement } from "./ClassElement.js";

export class Icon extends ClassElement {
  constructor(name) {
    const iconTag = super("span", "fa-solid");
    iconTag.setAttribute("aria-hidden", true);
    iconTag.classList.add(`fa-${name}`);

    return iconTag;
  }
}
