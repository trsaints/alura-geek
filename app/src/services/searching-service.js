import { productsService } from "./products-service.js";

const search = async (keywords, list) => {
  const searchParam = keywords.toLowerCase();

  const nameCompare = ({ name }) => name.toLowerCase().includes(searchParam);

  const match = list.filter((product) => nameCompare(product));
  return match;
};

const getCount = async (keywords) => {
  const refList = await productsService.loadAll("products");
  const result = await search(keywords, refList);
  return result.length;
};

export const searchingService = {
  search,
  getCount,
};
