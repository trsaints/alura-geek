import { LocalDB } from "../models/LocalDB.js";

const preload = async () => {
  const response = await fetch("./app/db/products.json");

  try {
    if (response.ok) return response.json();
  } catch (error) {
    console.log("Não foi possível carregar dados");
  }
};

const productsDB = new LocalDB({
  name: "ag_products",
  index: "category",
  keyPath: "id",
  objectStore: "products",
});

const configure = async () => {
  const baseList = await preload();

  const options = {
    options: {
      keyPath: productsDB.keyPath,
      autoIncrement: true,
    },

    baseData: baseList.products,
  };

  try {
    productsDB.configure(options);
  } catch (error) {
    console.error(error);
  }
};

const checkPreload = productsDB.checkPreload;
const loadAll = () => productsDB.loadAll();
const load = (id) => productsDB.load(id);
const add = (product) => productsDB.addObject(product);
const remove = (id) => productsDB.removeObject(id);
const reset = () => productsDB.reset();

const loadCategory = (data, category) =>
  data.filter((product) => product.category === category);

export const productsService = {
  checkPreload,
  configure,
  load,
  loadAll,
  loadCategory,
  add,
  remove,
  reset,
};
