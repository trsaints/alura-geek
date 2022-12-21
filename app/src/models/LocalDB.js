export class LocalDB {
  #name = "";
  #index = "";
  #keyPath = "";
  #objectStore = "";
  #version = 1;

  #checkPreload = () =>
    localStorage.getItem(`${this.#name}_db_loaded`) !== null;

  #configure = (args) => {
    const request = this.#openRequest();

    request.addEventListener("upgradeneeded", (evt) => {
      const { result } = evt.target;
      const { baseData, options } = args;

      const objStore = result.createObjectStore(this.#objectStore, options);

      const { transaction } = objStore;

      transaction.addEventListener("complete", (_evt) => {
        if (baseData !== undefined) {
          const objectStore = this.#openOS(evt.target, "readwrite");

          baseData.forEach((obj) => objectStore.add(obj));
        }

        console.warn(
          `Um banco de dados foi criado: ${this.#name} v${this.#version}`
        );
      });

      transaction.addEventListener(
        "error",
        (_e) => new Error("Não foi possível configurar o banco de dados")
      );

      localStorage.setItem(`${this.#name}_db_loaded`, true);
    });
  };

  #openRequest = () => window.indexedDB.open(this.#name, this.#version);

  #openOS = ({ result }, mode) => {
    const transaction = result.transaction(this.#objectStore, mode);

    return transaction.objectStore(this.#objectStore);
  };

  #addObject = (obj) => {
    if (obj === undefined)
      throw new Error("Erro ao realizar operação: dados inexistentes");

    const request = this.#openRequest();

    request.addEventListener("success", (evt) => {
      const objectStore = this.#openOS(evt.target, "readwrite");

      const addRequest = objectStore.add(obj);

      addRequest.addEventListener("success", () =>
        console.table({
          status: "Operação concluída com sucesso",
          result: obj,
        })
      );

      addRequest.addEventListener(
        "error",
        () => new Error("Não foi possível adicionar dados")
      );
    });
  };

  #removeObject = (keyPath) => {
    if (keyPath === undefined)
      throw new Error("Erro ao realizar operação: chave não especificada");

    const request = this.#openRequest();

    request.addEventListener("success", (evt) => {
      const objectStore = this.#openOS(evt.target, "readwrite");
      const deleteRequest = objectStore.delete(keyPath);

      deleteRequest.addEventListener("success", () =>
        console.log("Dados excluídos com sucesso")
      );

      deleteRequest.addEventListener(
        "error",
        () => new Error("Não foi possível excluir dados")
      );
    });
  };

  #loadAll = () =>
    new Promise((resolve, reject) => {
      const request = this.#openRequest();

      request.addEventListener("success", (evt) => {
        const objectStore = this.#openOS(evt.target, "readonly");
        const data = objectStore.getAll();

        data.addEventListener("success", () => resolve(data.result));

        data.addEventListener("error", () =>
          reject(new Error("Não foi possível carregar dados"))
        );
      });
    });

  #load = (keyPath) =>
    new Promise((resolve, reject) => {
      const request = this.#openRequest();

      request.addEventListener("success", (evt) => {
        const objectStore = this.#openOS(evt.target, "readonly");
        const data = objectStore.get(keyPath);

        data.addEventListener("success", () => resolve(data.result));

        data.addEventListener("error", () =>
          reject(new Error("Não foi possível carregar dados"))
        );
      });
    });

  get index() {
    return this.#index;
  }

  get keyPath() {
    return this.#keyPath;
  }

  get objectStore() {
    return this.#objectStore;
  }

  get checkPreload() {
    return this.#checkPreload;
  }

  get configure() {
    return this.#configure;
  }

  get addObject() {
    return this.#addObject;
  }

  get removeObject() {
    return this.#removeObject;
  }

  get load() {
    return this.#load;
  }

  get loadAll() {
    return this.#loadAll;
  }

  constructor(args) {
    const { name, index, keyPath, objectStore } = args;

    this.#name = name;
    this.#index = index;
    this.#keyPath = keyPath;
    this.#objectStore = objectStore;
  }
}
