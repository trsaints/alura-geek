export const contextService = {
  async get(context) {
    const ctx = await fetch(`./app/screens/${context}.html`);

    if (ctx.ok) {
      return ctx.text();
    }

    throw new Error(`Não foi possível alterar o contexto: ${ctx.status}`);
  },
};
