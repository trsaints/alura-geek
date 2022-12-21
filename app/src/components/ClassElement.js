export class ClassElement {
  constructor(tag, selector) {
    const tagElement = document.createElement(tag);
    tagElement.setAttribute("class", selector);

    return tagElement;
  }
}
