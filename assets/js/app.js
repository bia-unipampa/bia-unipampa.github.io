/* =========================================================================
   BIA — app.js
   Neural backdrop · i18n engine · curriculum render · reveal · modal · nav
   ========================================================================= */
(function () {
  "use strict";

  const { AXES, SEMESTERS, ELECTIVES } = window.BIA_DATA;
  const I18N = window.BIA_I18N;
  const AXIS_ORDER = ["pi", "fm", "ia", "fc", "cp", "cg"];
  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------------- language ---------------- */
  let lang = "pt";

  function t(key) {
    const dict = I18N[lang] || I18N.pt;
    return dict[key] != null ? dict[key] : (I18N.pt[key] || "");
  }

  function applyI18n() {
    document.documentElement.lang = lang;
    document.querySelectorAll("[data-i18n]").forEach((el) => {
      el.textContent = t(el.getAttribute("data-i18n"));
    });
    document.querySelectorAll("[data-i18n-html]").forEach((el) => {
      el.innerHTML = t(el.getAttribute("data-i18n-html"));
    });
    document.querySelector(".modal__close").setAttribute("aria-label", t("matrix.close"));
  }

  function setLang(next) {
    if (!I18N[next]) return;
    lang = next;
    try { localStorage.setItem("bia-lang", next); } catch (e) {}
    document.querySelectorAll(".langswitch button").forEach((b) =>
      b.classList.toggle("is-active", b.dataset.lang === next)
    );
    applyI18n();
    renderAxes();
    renderLegend();
    renderMatrix();
    renderElectives();
    renderCycles();
  }

  /* ---------------- render: axes ---------------- */
  function renderAxes() {
    const grid = document.getElementById("axesGrid");
    grid.innerHTML = "";
    AXIS_ORDER.forEach((key) => {
      const a = AXES[key];
      const el = document.createElement("article");
      el.className = "axis reveal";
      el.style.setProperty("--c", a.color);
      el.innerHTML =
        `<span class="axis__code">${key.toUpperCase()}</span>` +
        `<span class="axis__dot"></span>` +
        `<h3>${a.name[lang]}</h3>` +
        `<p>${a.short[lang]}</p>`;
      grid.appendChild(el);
    });
    observeReveals(grid);
  }

  function renderLegend() {
    const leg = document.getElementById("legend");
    leg.innerHTML = "";
    AXIS_ORDER.forEach((key) => {
      const a = AXES[key];
      const item = document.createElement("span");
      item.className = "legend__item";
      item.innerHTML =
        `<span class="legend__sw" style="background:${a.color};color:${a.color}"></span>${a.name[lang]}`;
      leg.appendChild(item);
    });
  }

  /* ---------------- render: matrix ---------------- */
  function renderMatrix() {
    const root = document.getElementById("matrix");
    root.innerHTML = "";
    SEMESTERS.forEach((sem) => {
      const col = document.createElement("div");
      col.className = "sem";
      col.setAttribute("role", "listitem");

      const head = document.createElement("div");
      head.className = "sem__head";
      head.innerHTML = `<span>${t("matrix.semester")}</span><b>${sem.n}</b>`;
      col.appendChild(head);

      sem.components.forEach((c) => {
        const axis = AXES[c.axis];
        const btn = document.createElement("button");
        btn.className = "comp";
        if (c.elective) btn.classList.add("comp--elective");
        if (c.credits >= 8) btn.classList.add("comp--big");
        btn.style.setProperty("--c", axis.color);
        const meta = c.elective
          ? axis.name[lang]
          : `${c.credits} ${t("matrix.credits")} · ${c.hours}h`;
        btn.innerHTML =
          `<span class="comp__name">${c.name[lang]}</span>` +
          `<span class="comp__meta">${meta}</span>`;
        btn.addEventListener("click", () => openModal(c));
        col.appendChild(btn);
      });

      root.appendChild(col);
    });
  }

  /* ---------------- render: electives ---------------- */
  function renderElectives() {
    const root = document.getElementById("electives");
    root.innerHTML = "";
    ELECTIVES.filter((e) => e.feature).forEach((e) => {
      const el = document.createElement("span");
      el.className = "elective reveal";
      el.innerHTML = `<span class="elective__ico">${e.icon}</span>${e.name[lang]}`;
      root.appendChild(el);
    });
    observeReveals(root);
  }

  /* ---------------- render: RP cycles ---------------- */
  function renderCycles() {
    const root = document.getElementById("rpCycles");
    root.innerHTML = "";
    const blurbs = {
      pt: ["Primeiros passos em equipe", "Dados em ação", "Aprendizado de máquina aplicado", "Soluções autônomas", "Extensão na comunidade", "Domínio consolidado"],
      es: ["Primeros pasos en equipo", "Datos en acción", "Aprendizaje automático aplicado", "Soluciones autónomas", "Extensión en la comunidad", "Dominio consolidado"],
      en: ["First steps as a team", "Data in action", "Applied machine learning", "Autonomous solutions", "Community outreach", "Consolidated mastery"]
    };
    const roman = ["I", "II", "III", "IV", "V", "VI"];
    for (let i = 0; i < 6; i++) {
      const li = document.createElement("li");
      li.className = "rp__cycle reveal";
      li.innerHTML =
        `<b>${roman[i]}</b><span>${t("rp.cycle")} ${roman[i]}</span>` +
        `<small>${blurbs[lang][i]}</small>`;
      root.appendChild(li);
    }
    observeReveals(root);
  }

  /* ---------------- modal ---------------- */
  const modal = document.getElementById("modal");
  let lastFocus = null;

  function openModal(c) {
    const axis = AXES[c.axis];
    lastFocus = document.activeElement;
    const axisEl = document.getElementById("modalAxis");
    axisEl.textContent = `${t("matrix.axisLabel")} · ${axis.name[lang]}`;
    axisEl.style.background = hexA(axis.color, 0.16);
    axisEl.style.color = axis.color;
    document.getElementById("modalTitle").textContent = c.name[lang];
    document.getElementById("modalDesc").textContent = c.desc[lang];

    const meta = document.getElementById("modalMeta");
    if (c.elective || !c.credits) {
      meta.innerHTML = "";
      meta.style.display = "none";
    } else {
      meta.style.display = "flex";
      meta.innerHTML =
        `<div><b style="color:${axis.color}">${c.credits}</b><span>${t("matrix.credits")}</span></div>` +
        `<div><b style="color:${axis.color}">${c.hours}</b><span>${t("matrix.hours")}</span></div>`;
    }
    modal.hidden = false;
    document.body.style.overflow = "hidden";
    modal.querySelector(".modal__close").focus();
  }

  function closeModal() {
    modal.hidden = true;
    document.body.style.overflow = "";
    if (lastFocus) lastFocus.focus();
  }

  modal.addEventListener("click", (e) => {
    if (e.target.hasAttribute("data-close")) closeModal();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !modal.hidden) closeModal();
  });

  function hexA(hex, a) {
    const n = parseInt(hex.slice(1), 16);
    return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${a})`;
  }

  /* ---------------- reveal on scroll ---------------- */
  let io;
  function observeReveals(scope) {
    if (prefersReduced) {
      (scope || document).querySelectorAll(".reveal").forEach((el) => el.classList.add("is-in"));
      return;
    }
    if (!io) {
      io = new IntersectionObserver(
        (entries) => {
          entries.forEach((en, i) => {
            if (en.isIntersecting) {
              const sibs = [...en.target.parentElement.querySelectorAll(".reveal")];
              const idx = Math.max(0, sibs.indexOf(en.target));
              en.target.style.transitionDelay = Math.min(idx * 70, 350) + "ms";
              en.target.classList.add("is-in");
              io.unobserve(en.target);
            }
          });
        },
        { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
      );
    }
    (scope || document).querySelectorAll(".reveal:not(.is-in)").forEach((el) => io.observe(el));
  }

  /* ---------------- nav behaviour ---------------- */
  const nav = document.getElementById("nav");
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

  document.querySelectorAll(".langswitch button").forEach((b) =>
    b.addEventListener("click", () => setLang(b.dataset.lang))
  );

  /* ---------------- neural backdrop ---------------- */
  function neural() {
    if (prefersReduced) return;
    const canvas = document.getElementById("neural");
    const ctx = canvas.getContext("2d");
    let w, h, dpr, nodes, raf;
    const mouse = { x: -9999, y: -9999 };

    function size() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = canvas.width = innerWidth * dpr;
      h = canvas.height = innerHeight * dpr;
      canvas.style.width = innerWidth + "px";
      canvas.style.height = innerHeight + "px";
      const count = Math.min(96, Math.floor((innerWidth * innerHeight) / 16000));
      nodes = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.22 * dpr,
        vy: (Math.random() - 0.5) * 0.22 * dpr,
        r: (Math.random() * 1.6 + 0.6) * dpr
      }));
    }

    const LINK = 130;
    function frame() {
      ctx.clearRect(0, 0, w, h);
      const link = LINK * dpr;
      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i];
        n.x += n.vx; n.y += n.vy;
        if (n.x < 0 || n.x > w) n.vx *= -1;
        if (n.y < 0 || n.y > h) n.vy *= -1;

        // mouse pull
        const mdx = mouse.x - n.x, mdy = mouse.y - n.y;
        const md = Math.hypot(mdx, mdy);
        if (md < 170 * dpr) { n.x += (mdx / md) * 0.5; n.y += (mdy / md) * 0.5; }

        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(120, 220, 255, 0.7)";
        ctx.fill();

        for (let j = i + 1; j < nodes.length; j++) {
          const m = nodes[j];
          const dx = n.x - m.x, dy = n.y - m.y;
          const d = Math.hypot(dx, dy);
          if (d < link) {
            const o = (1 - d / link) * 0.5;
            const grad = ctx.createLinearGradient(n.x, n.y, m.x, m.y);
            grad.addColorStop(0, `rgba(34,211,238,${o})`);
            grad.addColorStop(1, `rgba(217,70,239,${o})`);
            ctx.strokeStyle = grad;
            ctx.lineWidth = 0.6 * dpr;
            ctx.beginPath();
            ctx.moveTo(n.x, n.y); ctx.lineTo(m.x, m.y); ctx.stroke();
          }
        }
      }
      raf = requestAnimationFrame(frame);
    }

    window.addEventListener("mousemove", (e) => { mouse.x = e.clientX * dpr; mouse.y = e.clientY * dpr; }, { passive: true });
    window.addEventListener("mouseout", () => { mouse.x = -9999; mouse.y = -9999; });
    let rt;
    window.addEventListener("resize", () => { clearTimeout(rt); rt = setTimeout(size, 200); });
    // pause when tab hidden
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) cancelAnimationFrame(raf);
      else frame();
    });

    size();
    frame();
  }

  /* ---------------- init ---------------- */
  try {
    const saved = localStorage.getItem("bia-lang");
    if (saved && I18N[saved]) lang = saved;
  } catch (e) {}

  applyI18n();
  renderAxes();
  renderLegend();
  renderMatrix();
  renderElectives();
  renderCycles();
  document.querySelectorAll(".langswitch button").forEach((b) =>
    b.classList.toggle("is-active", b.dataset.lang === lang)
  );
  observeReveals(document);
  neural();
})();
