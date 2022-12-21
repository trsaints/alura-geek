import { LocalDB } from "../models/LocalDB.js";
import { productsService } from "./products-service.js";

const preloadBlob = async (name) => {
  const file = await fetch(`./app/assets/images/${name}`);

  try {
    if (file.ok) return file.blob();
  } catch (error) {
    throw new Error(`Não foi possível pré-carregar imagem: ${error}`);
  }
};

const preloadNames = async () => {
  const products = await productsService.loadAll();
  const images = [];

  products.map(({ image }) => images.push(image));

  return images;
};

const preload = async () => {
  const names = await preloadNames();
  const blobs = names.map(async (name) => {
    const blob = await preloadBlob(name);
    return new File([blob], name);
  });

  const results = await Promise.all(blobs);
  return await Promise.resolve(results);
};

const imagesDB = new LocalDB({
  name: "ag_images",
  index: "name",
  keyPath: "name",
  objectStore: "images",
});

const configure = async () => {
  const baseList = await preload();

  const options = {
    options: {
      keyPath: imagesDB.keyPath,
    },

    baseData: baseList,
  };

  imagesDB.configure(options);
};

const checkPreload = imagesDB.checkPreload;
const load = (image) => imagesDB.load(image);
const add = (image) => imagesDB.addObject(image);
const remove = (image) => imagesDB.removeObject(image);

export const imagesService = {
  checkPreload,
  configure,
  load,
  add,
  remove,
};
