import { ClassElement } from "./ClassElement.js";
export class StatusPanel extends ClassElement {
  #generateBanner = (status, type) => {
    const fig = new ClassElement("figure", "status__panel--banner");
    const img = new ClassElement("img", "status__img");
    const figcaption = new ClassElement("figcaption", "status__caption");

    const { banner, message } = this.#loadStatus(status, type);

    img.setAttribute("src", `./app/assets/images/${banner}`);
    figcaption.textContent = message;

    fig.appendChild(figcaption);
    fig.appendChild(img);

    return fig;
  };

  #loadStatus = (status, type) => {
    const options = {
      edit: {
        success: "editado",
        fail: "editar",
      },

      add: {
        success: "adicionado",
        fail: "adicionar",
      },

      remove: {
        success: "excluído",
        fail: "excluir",
      },
    };

    const messages = {
      success: `Produto ${options[type][status]} com sucesso!`,
      fail: `Não foi possível ${options[type][status]} o produto.`,
    };

    const banners = {
      success: "undraw_accept_terms_re_lj38.svg",
      fail: "undraw_access_denied_re_awnf.svg",
    };

    return {
      message: messages[status],
      banner: banners[status],
    };
  };

  constructor(status, type) {
    const panel = super("div", "status__panel");

    const banner = this.#generateBanner(status, type);
    const homeLink = new ClassElement("a", "status__panel--link");
    homeLink.setAttribute("href", "./index.html");
    homeLink.textContent = "Voltar à página inicial";

    panel.appendChild(banner);
    panel.appendChild(homeLink);

    return panel;
  }
}
