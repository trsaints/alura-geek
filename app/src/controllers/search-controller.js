import { productsService } from "../services/products-service.js";
import { searchingService } from "../services/searching-service.js";
import { productsController } from "./products-controller.js";

const render = async (keywords) => {
  const contentWrapper = document.querySelector("[data-search='results']");
  const renderCount = document.querySelector('[data-search="count"]');
  const categories = ["actionFigures", "consoles", "canvases", "keyrings"];

  const products = await productsService.loadAll();
  const { result, length } = searchingService.search(keywords, products);

  try {
    renderCount.textContent = `Encontrado(s) ${length} resultado(s)`;

    categories.forEach((category) => {
      const list = productsService.loadCategory(result, category);

      productsController.renderCatalog(list, contentWrapper);
    });
  } catch (error) {
    console.error(error);
  }
};

export const searchController = {
  render,
};
