const preload = async () => {
  const prodcuts = await fetch("./app/db/products.json");

  try {
    return prodcuts.json();
  } catch (error) {
    console.error(error);
  }
};

const checkPreLoad = () => {
  return localStorage.getItem("preloaded");
};

const setStructure = (db, data) => {
  const productsObjStore = db.createObjectStore("products", {
    keyPath: "id",
    autoIncrement: true,
  });

  productsObjStore.transaction.addEventListener("complete", (evt) => {
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

  request.addEventListener("error", () => {
    throw new Error("Não foi possível configurar o banco de dados");
  });

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

      data.addEventListener("success", () => {
        resolve(data.result);
      });

      data.addEventListener("error", () =>
        reject(new Error("Não foi possível realizar a operação"))
      );
    });
  });
};

const loadCategory = async (category) => {
  const data = await loadAll("products");
  const list = data.filter(product => product.category === category)

  return list;
};

export const productsService = {
  checkPreLoad,
  configure,
  loadAll,
  loadCategory,
};
