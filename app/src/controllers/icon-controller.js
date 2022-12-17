import { elementController } from "./element-controller.js"

const generate = (name) => {
  const baseIcon = elementController.generate('span', 'fa-solid')
  baseIcon.setAttribute("aria-hidden", true)
  baseIcon.classList.add(`fa-${name}`)

  return baseIcon;
}

export const iconController = {
  generate
}