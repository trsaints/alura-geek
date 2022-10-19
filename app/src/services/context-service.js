const load = async (context) => {
  const ctx = await fetch(`./app/screens/${context}.html`);

  if (ctx.ok) {
    return ctx.text();
  }

  throw new Error(`Não foi possível alterar o contexto: ${ctx.status}`);
};

const check = (target, context) => {
  return target.getAttribute("data-context") === context;
};

const get = () => {
  return document.body.getAttribute("data-context");
};

const set = (target, context) => {
  target.setAttribute("data-context", context)
}

export const contextService = {
  fetch: load,
  check,
  get,
  set
};
