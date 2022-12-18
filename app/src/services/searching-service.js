import { productsService } from "./products-service.js";

const search = async (keywords, list) => {
  const searchParam = keywords.toLowerCase();

  const nameCompare = ({ name }) => name.toLowerCase().includes(searchParam);

  const match = list.filter((product) => nameCompare(product));
  return match;
};

const getCount = async (keywords) => {
  const refList = await productsService.loadAll("products");
  const { length } = await search(keywords, refList);
  return length;
};

export const searchingService = {
  search,
  getCount,
};
