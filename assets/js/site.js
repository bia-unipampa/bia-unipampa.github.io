/* =========================================================================
   BIA — site.js
   Comportamento comum das páginas internas: nav (scroll + burger),
   revelação ao rolar, tooltip e fundo neural.
   ========================================================================= */
(function () {
  "use strict";

  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------------- reveal on scroll ---------------- */
  let io;
  function observeReveals(scope) {
    const root = scope || document;
    if (prefersReduced || !("IntersectionObserver" in window)) {
      root.querySelectorAll(".reveal").forEach((el) => el.classList.add("is-in"));
      return;
    }
    if (!io) {
      io = new IntersectionObserver(
        (entries) => {
          entries.forEach((en) => {
            if (!en.isIntersecting) return;
            const sibs = [...en.target.parentElement.querySelectorAll(":scope > .reveal")];
            const idx = Math.max(0, sibs.indexOf(en.target));
            en.target.style.transitionDelay = Math.min(idx * 70, 350) + "ms";
            en.target.classList.add("is-in");
            io.unobserve(en.target);
          });
        },
        { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
      );
    }
    root.querySelectorAll(".reveal:not(.is-in)").forEach((el) => io.observe(el));
  }

  /* ---------------- tooltip (gráficos) ---------------- */
  let tip;
  function bindTooltip(el, html) {
    if (!tip) {
      tip = document.createElement("div");
      tip.className = "tip";
      tip.hidden = true;
      tip.setAttribute("role", "tooltip");
      document.body.appendChild(tip);
    }
    const show = (x, y) => {
      tip.innerHTML = html;
      tip.hidden = false;
      const r = tip.getBoundingClientRect();
      tip.style.left = Math.min(x + 14, innerWidth - r.width - 12) + "px";
      tip.style.top = Math.max(12, y - r.height - 14) + "px";
    };
    el.addEventListener("mousemove", (e) => show(e.clientX, e.clientY));
    el.addEventListener("mouseleave", () => { tip.hidden = true; });
    el.addEventListener("focus", () => {
      const r = el.getBoundingClientRect();
      show(r.left + r.width / 2, r.top);
    });
    el.addEventListener("blur", () => { tip.hidden = true; });
  }

  /* ---------------- nav behaviour ---------------- */
  const nav = document.getElementById("nav");
  if (nav) {
    const onScroll = () => nav.classList.toggle("is-scrolled", window.scrollY > 24);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    const burger = document.getElementById("burger");
    burger.addEventListener("click", () => {
      const open = nav.classList.toggle("is-open");
      burger.setAttribute("aria-expanded", String(open));
    });
    nav.querySelectorAll(".nav__links a").forEach((a) =>
      a.addEventListener("click", () => {
        nav.classList.remove("is-open");
        burger.setAttribute("aria-expanded", "false");
      })
    );
  }

  window.BIA_SITE = { observeReveals, bindTooltip };

  document.addEventListener("DOMContentLoaded", () => {
    observeReveals(document);
    if (window.BIA_NEURAL) window.BIA_NEURAL();
  });
})();
