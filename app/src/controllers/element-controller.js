const clear = (target) => {
  while (target.firstChild) {
    target.removeChild(target.firstChild);
  }
};

const checkClass = (element, selector) => {
  return element.classList.contains(selector);
};

const toggle = (element) => {
  element.classList.toggle("hidden");
};

const hide = (element) => {
  if (!checkClass(element, "hidden")) {
    element.classList.add("hidden");
    element.setAttribute('aria-hidden', true)
  }
};

const show = (element) => {
  if (checkClass(element, "hidden")) {
    element.classList.remove("hidden");
    element.removeAttribute('aria-hidden')
  }
};

export const elementController = {
  clear,
  toggle,
  show,
  hide,
};
