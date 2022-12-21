const load = async (context) => {
  const ctx = await fetch(`./app/screens/${context}.html`);

  try {
    if (ctx.ok) return ctx.text();
  } catch (error) {
    throw new Error(`Não foi possível carregar contexto: ${error}`);
  }
};

const get = () => document.body.getAttribute("data-context");

export const contextService = {
  fetch: load,
  get,
};
