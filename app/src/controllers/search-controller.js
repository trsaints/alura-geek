import { productsService } from "../services/products-service.js";
import { searchingService } from "../services/searching-service.js";
import { productsController } from "./products-controller.js";

const render = async (keywords) => {
  const contentWrapper = document.querySelector("[data-search='results']");
  const renderCount = document.querySelector('[data-search="count"]')
  const categories = ["actionFigures", "consoles", "canvases", "keyrings"];
  
  const searchCount = await searchingService.getCount(keywords);
  renderCount.textContent = `Encontrado(s) ${searchCount} resultado(s)`

  categories.forEach(async (category) => {
    const list = await productsService.loadCategory(category);
    const match = await searchingService.search(keywords, list)

    productsController.renderCatalog(match, contentWrapper);
  });  
};

export const searchController = {
  render,
};