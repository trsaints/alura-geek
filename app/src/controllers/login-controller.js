import { loginService } from "../services/login-service.js";
import { contextController } from "./context-controller.js";

const displayValidity = (input, message) => {
  const warnDisplay = input.parentNode.querySelector("[data-login='warning']");
  warnDisplay.textContent = message;
};

const login = (user, password) => {
  loginService
    .login(user.value, password.value)
    .then((success) => {
      displayValidity(user, "");
      displayValidity(password, "");

      if (success.root) {
        contextController.set("editor");
      }

      console.log("Autenticado com sucesso");
    })
    .catch((error) => {
      displayValidity(user, "Usuário inválido!");
      displayValidity(password, "Senha inválida!");

      console.log(error);
    });
};

const register = (user, password) => {};

const handlerOptions = {
  login: (user, password) => login(user, password),

  register: (user, password) => register(user, password),
};

const setHandler = (form, type) => {
  const userIn = form.querySelector("[data-login='user']");
  const passwordIn = form.querySelector("[data-login='password']");

  form.addEventListener("submit", (evt) => {
    evt.preventDefault();

    handlerOptions[type](userIn, passwordIn);
  });
};

const load = (form) => {
  if (loginService.checkEntry()) {
    setHandler(form, "login");
  } else {
    loginService.configure();
    setHandler(form, "login");
  }
};

export const loginController = {
  load,
};
