document.addEventListener("DOMContentLoaded", () => {
  const header = document.querySelector(".header");

  if (header) {
    const updateHeader = () => {
      header.classList.toggle("scrolled", window.scrollY > 50);
    };
    window.addEventListener("scroll", updateHeader, { passive: true });
    updateHeader();
  }

  /* MENU MOBILE */
  const menuButton = document.querySelector(".menu-mobile");
  const menu = document.querySelector(".menu");

  if (menuButton && menu) {
    menuButton.setAttribute("aria-expanded", "false");

    const closeMenu = () => {
      menu.classList.remove("aberto");
      menuButton.classList.remove("aberto");
      document.body.classList.remove("menu-aberto");
      menuButton.setAttribute("aria-expanded", "false");
      menuButton.setAttribute("aria-label", "Abrir menu");
    };

    menuButton.addEventListener("click", () => {
      const open = !menu.classList.contains("aberto");
      menu.classList.toggle("aberto", open);
      menuButton.classList.toggle("aberto", open);
      document.body.classList.toggle("menu-aberto", open);
      menuButton.setAttribute("aria-expanded", String(open));
      menuButton.setAttribute("aria-label", open ? "Fechar menu" : "Abrir menu");
    });

    menu.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", closeMenu);
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") closeMenu();
    });

    window.addEventListener("resize", () => {
      if (window.innerWidth > 800) closeMenu();
    });
  }

  /* REVEAL */
  const elements = document.querySelectorAll(
    ".reveal, .reveal-left, .reveal-right, .reveal-zoom"
  );

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver((entries, observerInstance) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("active");
        observerInstance.unobserve(entry.target);
      });
    }, {
      threshold: 0.14,
      rootMargin: "0px 0px -55px 0px"
    });

    elements.forEach((element) => observer.observe(element));
  } else {
    elements.forEach((element) => element.classList.add("active"));
  }

  /* LINKS INTERNOS */
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (event) => {
      const id = link.getAttribute("href");
      if (!id || id === "#") return;

      const target = document.querySelector(id);
      if (!target) return;

      event.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });

  /* FORM -> WHATSAPP */
  const form = document.querySelector(".contato-formulario");

  if (form) {
    form.addEventListener("submit", (event) => {
      event.preventDefault();

      const nome = form.querySelector('[name="nome"]')?.value.trim() || "";
      const whatsapp = form.querySelector('[name="whatsapp"]')?.value.trim() || "";
      const servico = form.querySelector('[name="servico"]')?.value.trim() || "";
      const mensagem = form.querySelector('[name="mensagem"]')?.value.trim() || "";

      let text = "Olá! Gostaria de agendar um horário.";
      if (nome) text += `\n\nNome: ${nome}`;
      if (whatsapp) text += `\nWhatsApp: ${whatsapp}`;
      if (servico) text += `\nServiço: ${servico}`;
      if (mensagem) text += `\nMensagem: ${mensagem}`;

      const url = `https://wa.me/5562999999999?text=${encodeURIComponent(text)}`;
      window.open(url, "_blank", "noopener,noreferrer");
    });
  }

  /* CURSOR DESKTOP */
  const cursor = document.querySelector(".cursor");
  const follower = document.querySelector(".cursor-follower");

  if (cursor && follower && window.matchMedia("(pointer: fine)").matches) {
    let mouseX = -100, mouseY = -100;
    let followerX = -100, followerY = -100;

    document.body.classList.add("cursor-ready");

    window.addEventListener("mousemove", (event) => {
      mouseX = event.clientX;
      mouseY = event.clientY;
      cursor.style.left = `${mouseX}px`;
      cursor.style.top = `${mouseY}px`;
    }, { passive: true });

    const animateCursor = () => {
      followerX += (mouseX - followerX) * 0.11;
      followerY += (mouseY - followerY) * 0.11;
      follower.style.left = `${followerX}px`;
      follower.style.top = `${followerY}px`;
      requestAnimationFrame(animateCursor);
    };

    animateCursor();
  }
});