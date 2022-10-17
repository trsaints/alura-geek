const generate = (tag, selector) => {
  const result = document.createElement(tag);
  result.setAttribute("class", selector);

  return result;
};

const render = (tag, target) => {
  target.appendChild(tag);
};

const clear = (target) => {
  while (target.firstChild) {
    target.removeChild(target.firstChild);
  }
};

export const elementController = {
  generate,
  render,
  clear
}
