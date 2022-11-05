import { Account } from "../models/Account.js";
import { loginService } from "../services/login-service.js";
import { contextController } from "./context-controller.js";

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

const setHandler = (form, type) => {
  const userIn = form.querySelector("[data-login='user']");
  const passwordIn = form.querySelector("[data-login='password']");

  const options = {
    login: () =>
      form.addEventListener("submit", (evt) => {
        evt.preventDefault();

        loginService
          .login(userIn.value, passwordIn.value)
          .then((success) => {
            displayValidity(userIn, "");
            displayValidity(passwordIn, "");

            if (success.root) {
              contextController.render("editor");
            }

            console.log("Autenticado com sucesso");
            console.table(success);
          })
          .catch((error) => {
            displayValidity(userIn, "Usuário inválido!");
            displayValidity(passwordIn, "Senha inválida!");
            console.log(error);
          });
      }),

    register: () => {
      form.addEventListener("submit", (evt) => {
        evt.preventDefault();
      });
    },

    configure: () => {
      loginService.configure();
    },
  };

  options[type]();
};

const load = (form) => {
  if (loginService.checkEntry()) {
    setHandler(form, "login");
  } else {
    setHandler(form, "configure");
  }
};

export const loginController = {
  load,
};
