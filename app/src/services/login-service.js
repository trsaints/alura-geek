const checkEntry = () => {
  return localStorage.getItem("has_account_db_created");
};

const setStructure = (db) => {
  db.createObjectStore("accounts", { keyPath: "user", autoIncrement: false });
};

const createAccount = (account) => {
  const dbRequest = window.indexedDB.open("ag_user", 1);

  dbRequest.addEventListener("success", (evt) => {
    const db = evt.target.result;
    const transaction = db.transaction(["accounts"], "readwrite");

    const accStore = transaction.objectStore("accounts");
    const request = accStore.add(account);

    request.addEventListener("success", (evt) => {
      console.log("Conta registrada com sucesso");
    });
  });
};

const login = (user, password) => {
  return new Promise((resolve, reject) => {
    const request = window.indexedDB.open("ag_user", 1);

    request.addEventListener("success", (evt) => {
      const { result } = evt.target;
      const objStore = result.transaction("accounts").objectStore("accounts");
      const storeData = objStore.get(user);

      storeData.addEventListener("success", (evt) => {
        const account = auth(storeData, password);

        if (account.valid) {
          resolve(account);
        } else {
          reject(new Error("Usuário ou senha inválidos"));
        }
      });
    });
  });
};

const auth = (store, password) => {
  const account = store.result;

  const result = {
    valid: false,
    root: false,
  };

  if (account !== undefined) {
    if (account.user === "root") {
      result.root = true;
    }

    if (account.password === password) {
      result.valid = true;
    }
  }

  return result;
};

const configure = () => {
  const request = window.indexedDB.open("ag_user", 1);

  request.addEventListener("upgradeneeded", (evt) => {
    const db = evt.target.result;

    setStructure(db);

    loginService.createAccount({
      user: "root",
      password: "alura4GEEK",
    });

    localStorage.setItem("has_account_db_created", true);
  });
};

export const loginService = {
  checkEntry,
  configure,
  createAccount,
  login,
};
