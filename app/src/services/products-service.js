const preload = async () => {
  const response = await fetch("./app/db/products.json");

  try {
    if (response.ok) return response.json();
  } catch (error) {
    console.error(error);
  }
};

const checkPreLoad = () => localStorage.getItem("preloaded");

const setStructure = (db, data) => {
  const productsObjStore = db.createObjectStore("products", {
    keyPath: "id",
    autoIncrement: true,
  });

  productsObjStore.transaction.addEventListener("complete", (_evt) => {
    const categoryObjStore = db
      .transaction("products", "readwrite")
      .objectStore("products");

    data.forEach((list) => {
      const { category } = list;

      list[category].forEach((product) => {
        product.category = category;
        categoryObjStore.add(product);
      });
    });

    console.log("Banco de dados configurado com sucesso");
  });
};

const configure = async () => {
  const baseData = await preload();

  const request = window.indexedDB.open("ag_products", 1);

  request.addEventListener("upgradeneeded", (evt) => {
    const { result } = evt.target;

    setStructure(result, baseData.categories);
  });

  request.addEventListener(
    "error",
    () => new Error("Não foi possível configurar o banco de dados")
  );

  localStorage.setItem("preloaded", true);
};

const loadAll = (record) => {
  return new Promise((resolve, reject) => {
    const request = window.indexedDB.open("ag_products", 1);

    request.addEventListener("success", (evt) => {
      const { result } = evt.target;
      const transaction = result.transaction(record);
      const objStore = transaction.objectStore(record);
      const data = objStore.getAll();

      data.addEventListener("success", () => resolve(data.result));

      data.addEventListener("error", () =>
        reject(new Error("Não foi possível realizar a operação"))
      );
    });
  });
};

const loadCategory = async (category) => {
  const data = await loadAll("products");
  const list = data.filter((product) => product.category === category);

  return list;
};

const add = async (product) => {
  const request = window.indexedDB.open("ag_products", 1);

  request.addEventListener("success", (e) => {
    const { result } = e.target;
    const transaction = result.transaction("products", "readwrite");
    const objStore = transaction.objectStore("products");

    const addReq = objStore.add(product);

    addReq.addEventListener("success", () =>
      console.log("Produto adicionado com sucesso!")
    );

    addReq.addEventListener(
      "error",
      () => new Error("Não foi possível realizar a operação")
    );
  });
};

export const productsService = {
  checkPreLoad,
  configure,
  loadAll,
  loadCategory,
  add,
};
