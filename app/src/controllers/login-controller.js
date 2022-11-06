import { contextService } from "../services/context-service.js";
import { loginService } from "../services/login-service.js";

const validations = ["patternMismatch", "valueMissing", "customError"];

const patterns = {
  user: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,12}$/,
  password: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/,
};

const errorMessages = {
  user: {
    patterMismatch:
      "Seu nome de usuário deve conter: \n Uma letra maiúscula \n Uma letra minúscula \n Um dígito \n de 6 a 12 caracteres",

    valueMissing: "O campo usuário não pode estar vazio",

    customError: "Usuário inválido!",
  },

  password: {
    patternMismatch:
      "Sua senha deve conter: \n Uma letra maiúscula \n Uma letra minúscula \n Um dígito \n de 6 a 20 caracteres",

    valueMissing: "O campo senha não pode estar vazio",

    customError: "Senha inválida!",
  },
};

const validate = (input) => {};

const displayValidity = (input, message) => {
  const warnDisplay = input.parentNode.querySelector("[data-login='warning']");
  warnDisplay.textContent = message;
};

const warnValidity = (input, message) => {
  input.setCustomValidity(message);
  input.reportValidity();
};

const login = (user, password) => {
  loginService
    .login(user.value, password.value)
    .then((success) => {
      displayValidity(user, "");
      displayValidity(password, "");

      if (success.root) {
        contextService.set(document.body, "editor");
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
