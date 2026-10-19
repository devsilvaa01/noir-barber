
document.addEventListener("DOMContentLoaded", () => {
  // MENU MOBILE
  const menuToggle = document.querySelector("#menu-toggle");
  const menu = document.querySelector("#menu-principal");

  function fecharMenu() {
    if (!menuToggle || !menu) return;

    menu.classList.remove("aberto");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Abrir menu");
    document.body.classList.remove("menu-aberto");
  }

  function alternarMenu() {
    if (!menuToggle || !menu) return;

    const aberto = menuToggle.getAttribute("aria-expanded") !== "true";

    menu.classList.toggle("aberto", aberto);
    menuToggle.setAttribute("aria-expanded", String(aberto));
    menuToggle.setAttribute(
      "aria-label",
      aberto ? "Fechar menu" : "Abrir menu"
    );
    document.body.classList.toggle("menu-aberto", aberto);
  }

  if (menuToggle && menu) {
    menuToggle.addEventListener("click", (event) => {
      event.stopPropagation();
      alternarMenu();
    });

    menu.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", fecharMenu);
    });

    document.addEventListener("click", (event) => {
      if (
        menuToggle.getAttribute("aria-expanded") === "true" &&
        !menu.contains(event.target) &&
        !menuToggle.contains(event.target)
      ) {
        fecharMenu();
      }
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") fecharMenu();
    });

    window.addEventListener("resize", () => {
      if (window.innerWidth > 820) fecharMenu();
    });
  }

  // ANIMAÇÕES AO ROLAR
  const elementosRevelar = document.querySelectorAll(".revelar");
  const movimentoReduzido = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  );

  if (
    "IntersectionObserver" in window &&
    !movimentoReduzido.matches
  ) {
    const observador = new IntersectionObserver(
      (entradas, observer) => {
        entradas.forEach((entrada) => {
          if (entrada.isIntersecting) {
            entrada.target.classList.add("visivel");
            observer.unobserve(entrada.target);
          }
        });
      },
      {
        threshold: 0.12,
        rootMargin: "0px 0px -35px 0px",
      }
    );

    elementosRevelar.forEach((elemento) => {
      observador.observe(elemento);
    });
  } else {
    elementosRevelar.forEach((elemento) => {
      elemento.classList.add("visivel");
    });
  }

  // ANO DO RODAPÉ
  const anoAtual = String(new Date().getFullYear());
  const elementoAno = document.querySelector("#ano-atual");

  if (elementoAno) {
    elementoAno.textContent = anoAtual;
  }

  // COPIAR CUPOM
  const botaoCopiar = document.querySelector("#copiar-cupom");
  const feedbackCupom = document.querySelector("#cupom-feedback");
  const codigoCupom = document.querySelector("#cupom-codigo");

  async function copiarTexto(texto) {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(texto);
      return;
    }

    const campoTemporario = document.createElement("textarea");
    campoTemporario.value = texto;
    campoTemporario.setAttribute("readonly", "");
    campoTemporario.style.position = "fixed";
    campoTemporario.style.left = "-9999px";

    document.body.appendChild(campoTemporario);
    campoTemporario.select();

    const copiou = document.execCommand("copy");
    campoTemporario.remove();

    if (!copiou) {
      throw new Error("Não foi possível copiar o cupom.");
    }
  }

  if (botaoCopiar && codigoCupom) {
    botaoCopiar.addEventListener("click", async () => {
      const codigo = codigoCupom.textContent.trim();

      if (!codigo) return;

      try {
        await copiarTexto(codigo);
        botaoCopiar.textContent = "Copiado!";

        if (feedbackCupom) {
          feedbackCupom.textContent = "Cupom copiado com sucesso!";
        }
      } catch (erro) {
        if (feedbackCupom) {
          feedbackCupom.textContent =
            "Não foi possível copiar automaticamente. Copie o código: " +
            codigo;
        }
      }

      window.setTimeout(() => {
        botaoCopiar.innerHTML = 'Copiar cupom <span>⧉</span>';
      }, 2000);
    });
  }
});
