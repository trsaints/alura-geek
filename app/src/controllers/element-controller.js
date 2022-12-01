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

const getClass = (element, selector) => {
  return element.classList.contains(selector);
};

const toggle = (element) => {
  element.classList.toggle("hidden");
};

const hide = (element) => {
  if (!getClass(element, "hidden")) {
    element.classList.add("hidden");
  }
};

const show = (element) => {
  if (getClass(element, "hidden")) {
    element.classList.remove("hidden");
  }
};

export const elementController = {
  generate,
  render,
  clear,
  toggle,
  show,
  hide
};
