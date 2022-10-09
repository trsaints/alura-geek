let getProducts = async () => {
  const prodcuts = await fetch("./app/db/products.json");

  try {
    return prodcuts.json();
  } catch (error) {
    console.error(error);
  }
};

let checkPreLoad = () => {
  return localStorage.getItem("preloaded");
};

let setStructure = (db, data) => {
  const productsObjStore = db.createObjectStore("products", {
    keyPath: "category",
  });

  db.createObjectStore("images", { keyPath: "image" });

  data.forEach((list) => {
    productsObjStore.createIndex(list.category, list.category, {
      unique: true,
    });
  });

  productsObjStore.transaction.addEventListener("complete", (evt) => {
    const categoryObjStore = db
      .transaction("products", "readwrite")
      .objectStore("products");

    const imageObjectStore = db
      .transaction("images", "readwrite")
      .objectStore("images");

    data.forEach((list) => {
      categoryObjStore.add(list);

      const category = list.category;
      const products = list[category];

      products.forEach((product) => {
        imageObjectStore.add({
          image: product.image,
        });
      });
    });

    console.log("Banco de dados configurado com sucesso");
  });
};

let configure = async () => {
  let baseData = [];

  await getProducts().then((data) => {
    baseData = data.categories;
  });

  const request = window.indexedDB.open("ag_products", 1);

  request.addEventListener("upgradeneeded", (evt) => {
    const db = evt.target.result;

    setStructure(db, baseData);
  });

  request.addEventListener("error", () => {
    throw new Error("Não foi possível configurar o banco de dados");
  });

  localStorage.setItem("preloaded", true);
};

let loadAll = () => {
  const request = window.indexedDB.open("ag_products", 1);

  request.addEventListener("success", async (evt) => {
    const db = evt.target.result;
    const transaction = db.transaction("products");
    const objStore = transaction.objectStore("products");
    const data = objStore.getAll();

    data.addEventListener("success", () => {
      return data.result;
    })
  })
};

export const databaseService = {
  checkPreLoad,
  configure,
  loadAll,
};