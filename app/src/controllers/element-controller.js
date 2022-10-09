let generate = (tag, selector) => {
  const result = document.createElement(tag);
  result.setAttribute("class", selector);

  return result;
};

let render = (tag, target) => {
  target.appendChild(tag);
};

let clear = (target) => {
  while (target.firstChild) {
    target.removeChild(target.firstChild);
  }
};

export const elementController = {
  generate,
  render,
  clear
}
