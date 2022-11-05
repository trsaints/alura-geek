const checkEntry = () => {
  return localStorage.getItem("has_account_db_created");
};

const setStructure = (db) => {
  db.createObjectStore("accounts", { keyPath: "UID", autoIncrement: true });
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

const getAccount = (acc, user, password) => {
  return acc.user === user && acc.password === password;
};

const login = (user, password) => {
  return new Promise((resolve, reject) => {
    const request = window.indexedDB.open("ag_user", 1);

    request.addEventListener("success", (evt) => {
      const { result } = evt.target;
      const objStore = result.transaction("accounts").objectStore("accounts");
      const storeData = objStore.getAll();

      storeData.addEventListener("success", (evt) => {
        const accounts = storeData.result;
        const account = accounts.filter((acc) =>
          getAccount(acc, user, password)
        );

        const result = {
          valid: false,
          root: false,
        };

        if (account[0] !== undefined) {
          if (account[0].UID === 1) {
            result.root = true;
          }

          result.valid = true;

          resolve(result);
        } else {
          reject(new Error("Conta inexistente"));
        }
      });
    });
  });
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
