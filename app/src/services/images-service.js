import { productsService } from "./products-service.js";

const preloadBlob = async (name) => {
  const blob = await fetch(`./app/assets/images/${name}`);

  if (blob.ok) {
    return {
      name: name,
      file: await blob.blob(),
    };
  }
};

const preloadNames = async () => {
  const names = await productsService.loadAll("products");
  const products = names.map((list) => list[list.category]);
  const images = [];

  products.map((list) => list.map((product) => images.push(product.image)));

  return images;
};

const preload = async () => {
  const names = await preloadNames();
  const blobs = names.map((name) => {
    return preloadBlob(name);
  });

  return Promise.all(blobs).then((values) => Promise.resolve(values));
};

const add = async (blob) => {
  const request = window.indexedDB.open("ag_images", 1);

  request.addEventListener("success", (e) => {
    const db = e.target.result;
    const objStore = db
      .transaction("images", "readwrite")
      .objectStore("images");

    objStore.add(blob);
  });
};

const setStructure = (db, blobs) => {
  const newObjStore = db.createObjectStore("images", { keyPath: "name" });

  newObjStore.transaction.addEventListener("complete", (evt) => {
    const objStore = db
      .transaction("images", "readwrite")
      .objectStore("images");

    blobs.forEach((blob) => {
      objStore.add(blob);
    });

    console.log("Banco de imagens configurado com sucesso");
  });
};

const load = async (name) => {
  return new Promise((resolve, reject) => {
    const request = window.indexedDB.open("ag_images", 1);

    request.addEventListener("success", (evt) => {
      const db = evt.target.result;
      const objStore = db.transaction("images").objectStore("images");
      const data = objStore.get(name);

      data.addEventListener("success", () => {
        resolve(data.result);
      });

      data.addEventListener("error", () =>
        reject(new Error("Não foi possível realizar a operação"))
      );
    });
  });
};

const configure = async () => {
  const blobs = await preload();

  const request = window.indexedDB.open("ag_images", 1);

  request.addEventListener("upgradeneeded", (e) => {
    const db = e.target.result;

    setStructure(db, blobs);
  });

  request.addEventListener("error", () => {
    throw new Error("Não foi possível configurar o banco de imagens");
  });
};

export const imagesService = {
  configure,
  load,
};
