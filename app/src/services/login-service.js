import { LocalDB } from "../models/LocalDB.js";

const accountsDB = new LocalDB({
  name: "ag_accounts",
  index: "user",
  keyPath: "user",
  objectStore: "accounts",
});

const configure = () => {
  const baseList = [
    {
      user: "root",
      password: "alura4GEEK",
    },
  ];

  const options = {
    options: {
      keyPath: accountsDB.keyPath,
    },

    baseData: baseList,
  };

  accountsDB.configure(options);
};

const load = (user) => accountsDB.load(user);
const add = (account) => accountsDB.addObject(account);
const checkPreload = () => accountsDB.checkPreload();

const auth = async (user, password) => {
  const account = await load(user);
  const isEmpty = user === "" || user === null;

  if (isEmpty)
    throw new Error("Falha ao realizar autenticação: usuário não foi inserido");

  if (account === undefined) throw new Error("Conta inexistente");

  if (password !== account.password) throw new Error("Senha inválida");

  if (account.user === "root")
    return {
      root: true,
    };

  return { root: false };
};

export const loginService = {
  checkPreload,
  configure,
  auth,
  add
};
