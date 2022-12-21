const search = (keywords, list) => {
  const searchParam = keywords.toLowerCase();

  const nameCompare = ({ name }) => name.toLowerCase().includes(searchParam);
  
  const match = list.filter((product) => nameCompare(product));

  return {
    result: match,
    length: match.length
  }
};

export const searchingService = {
  search,
};
