import { elementController } from "../controllers/element-controller.js";

export class StatusPanel {
  #generateBanner = (status, type) => {
    const fig = elementController.generate("figure", "editor__status");
    const img = elementController.generate("img", "editor__img");
    const figCaption = elementController.generate(
      "figcaption",
      "editor__caption"
    );

    const result = this.#loadStatus(status, type);

    img.setAttribute("src", `./app/assets/images/${result.banner}`);
    figCaption.textContent = result.message;

    elementController.render(figCaption, fig);
    elementController.render(img, fig);

    return fig;
  };

  #generate = (status, type) => {
    const frag = document.createDocumentFragment();

    const banner = this.#generateBanner(status, type);
    const homeLink = elementController.generate("a", "editor__status--link");
    homeLink.setAttribute("href", "./index.html");
    homeLink.textContent = "Voltar à página inicial";

    elementController.render(banner, frag)
    elementController.render(homeLink, frag)

    return frag;
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
      fail: `Não foi possível ${options[type][status]} o produto.`
    }

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
    return this.#generate(status, type);
  }
}
