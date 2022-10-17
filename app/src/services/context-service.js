export const contextService = {
  fetch: async (context) => {
    const ctx = await fetch(`./app/screens/${context}.html`);

    if (ctx.ok) {
      return ctx.text();
    }

    throw new Error(`Não foi possível alterar o contexto: ${ctx.status}`);
  },

  check: (target, context) => {
    return target.getAttribute("data-context") === context;
  },

  get: (target) => {
    return target.getAttribute("data-context");
  },

  set: (target, context) => {
    target.setAttribute("data-context", context)
  }
};
