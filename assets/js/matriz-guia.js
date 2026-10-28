/* =========================================================================
   BIA — matriz-guia.js
   Página "Matriz passo a passo": composição da carga horária, explorador
   por semestre / por eixo e lista de eletivas. Dados de curriculum.js.
   ========================================================================= */
(function () {
  "use strict";

  const { AXES, SEMESTERS, ELECTIVES } = window.BIA_DATA;
  const { observeReveals, bindTooltip } = window.BIA_SITE;
  const AXIS_ORDER = ["pi", "fm", "ia", "fc", "cp", "cg"];
  const fmt = (n) => n.toLocaleString("pt-BR");
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

  /* ---------------- composição (PPC, Tabela 2) ---------------- */
  const PARTS = [
    { label: "Disciplinas obrigatórias", hours: 1500, c: "#22d3ee", d: "Matemática, computação, IA e contexto profissional" },
    { label: "Trilha de Resolução de Problemas", hours: 720, c: "#fb3b5c", d: "RP I a VI, incluindo 270 h de extensão vinculada" },
    { label: "Trabalho de Conclusão (TCC)", hours: 330, c: "#ffb547", d: "TCC I (150 h) e TCC II (180 h)" },
    { label: "Eletivas (CCCGs)", hours: 240, c: "#4d8cff", d: "Componentes complementares à sua escolha" },
    { label: "Atividades complementares (ACGs)", hours: 360, c: "#b366ff", d: "Ensino, pesquisa, cultura, sociedade e gestão" },
    { label: "Extensão específica (ACEE)", hours: 60, c: "#2ee6a6", d: "Ações em projetos e programas de extensão" }
  ];
  const TOTAL = PARTS.reduce((s, p) => s + p.hours, 0); // 3.210 h

  function renderComposition() {
    const bar = document.getElementById("hbar");
    const leg = document.getElementById("hlegend");
    PARTS.forEach((p) => {
      const pct = (p.hours / TOTAL) * 100;
      const seg = document.createElement("span");
      seg.className = "hbar__seg";
      seg.tabIndex = 0;
      seg.style.setProperty("--c", p.c);
      seg.style.flex = `${p.hours} 1 0`;
      seg.setAttribute("aria-label", `${p.label}: ${fmt(p.hours)} horas`);
      bindTooltip(seg, `<b>${fmt(p.hours)} h · ${pct.toFixed(1).replace(".", ",")}%</b>${esc(p.label)}<br>${esc(p.d)}`);
      bar.appendChild(seg);

      const item = document.createElement("div");
      item.className = "hlegend__item";
      item.style.setProperty("--c", p.c);
      item.innerHTML = `<span class="hlegend__sw"></span><span>${esc(p.label)}</span><b>${fmt(p.hours)} h</b>`;
      leg.appendChild(item);
    });
  }

  /* ---------------- explorador por semestre ---------------- */
  const INTROS = [
    { t: "A largada: dados, código e a primeira imersão em IA", d: "Você chega e já trabalha com IA. Programação, dados e matemática começam juntos, e na trilha de RP sua equipe enfrenta o primeiro problema real da comunidade." },
    { t: "Dos dados ao insight", d: "Pipelines, bancos de dados e ciência de dados: você aprende a transformar dados brutos em decisões. O cálculo entra como ferramenta para entender os modelos." },
    { t: "A matemática do aprendizado e os primeiros modelos", d: "Álgebra linear e cálculo multivariável ganham sentido no Aprendizado de Máquina I. Você também aprende a projetar sistemas de IA confiáveis e a comunicar resultados com visualizações." },
    { t: "Linguagem, agentes e modelos avançados", d: "Do raciocínio estatístico aos LLMs: processamento de linguagem natural, sistemas multiagentes e modelos mais sofisticados de aprendizado de máquina." },
    { t: "Visão, redes profundas e IA generativa", d: "O semestre da fronteira: aprendizado profundo, transformers, visão computacional e otimização inteligente. Na RP V, a extensão leva as soluções para a comunidade." },
    { t: "IA responsável, segura e em escala", d: "Ética algorítmica, governança, segurança contra ataques adversariais e processamento de grandes volumes de dados. A RP VI consolida seis semestres de prática real." },
    { t: "Seu projeto autoral e sua especialização", d: "Começa o TCC: você concebe e fundamenta um projeto técnico-científico próprio. As eletivas de IA aplicada direcionam sua formação para a área que mais te interessa." },
    { t: "Defesa do TCC e trilha própria", d: "Você desenvolve, valida e defende o projeto final, que pode virar artigo, produto ou startup, e completa suas eletivas e atividades complementares." }
  ];

  let current = 0;

  function renderSemNav() {
    const nav = document.getElementById("semnav");
    SEMESTERS.forEach((s, i) => {
      const b = document.createElement("button");
      b.setAttribute("role", "tab");
      b.setAttribute("aria-selected", String(i === current));
      b.setAttribute("aria-controls", "sempanel");
      b.innerHTML = `<b>${s.n}º</b><span>${esc(INTROS[i].t.split(":")[0])}</span>`;
      b.addEventListener("click", () => selectSem(i));
      nav.appendChild(b);
    });
  }

  function selectSem(i, focusPanel) {
    current = i;
    document.querySelectorAll("#semnav button").forEach((b, k) => b.setAttribute("aria-selected", String(k === i)));
    const sem = SEMESTERS[i];
    const panel = document.getElementById("sempanel");
    const required = sem.components.filter((c) => !c.elective);
    const hours = required.reduce((s, c) => s + c.hours, 0);
    const credits = required.reduce((s, c) => s + c.credits, 0);
    const iaCount = sem.components.filter((c) => c.axis === "ia" || /IA|Inteligência/.test(c.name.pt)).length;

    const items = sem.components.map((c) => {
      const a = AXES[c.axis];
      const h = c.elective ? "à escolha" : `${c.hours} h · ${c.credits} cr`;
      return `<li style="--c:${a.color}"><span class="complist__axis">${esc(a.name.pt)}</span>` +
        `<span class="complist__h">${h}</span>` +
        `<span class="complist__name">${esc(c.name.pt)}</span>` +
        `<span class="complist__desc">${esc(c.desc.pt)}</span></li>`;
    }).join("");

    panel.innerHTML =
      `<span class="sempanel__kicker">${sem.n}º semestre</span>` +
      `<h3>${esc(INTROS[i].t)}</h3>` +
      `<p class="sempanel__intro">${esc(INTROS[i].d)}</p>` +
      `<div class="sempanel__stats">` +
        `<div><b>${required.length}</b>componentes obrigatórios</div>` +
        `<div><b>${fmt(hours)} h</b>${credits} créditos</div>` +
        `<div><b>≈ ${Math.round(hours / 17)} h</b>por semana*</div>` +
        `<div><b>${iaCount}</b>com IA no nome ou no eixo</div>` +
      `</div>` +
      `<ul class="complist">${items}</ul>` +
      `<div class="sempanel__nav">` +
        `<button class="btn btn--ghost" data-step="-1" ${i === 0 ? "disabled" : ""}>← ${i}º semestre</button>` +
        `<button class="btn btn--ghost" data-step="1" ${i === SEMESTERS.length - 1 ? "disabled" : ""}>${i + 2}º semestre →</button>` +
      `</div>` +
      `<p class="note">* Estimativa de horas em atividades do componente por semana, considerando 17 semanas letivas. Não inclui estudo individual.</p>`;

    panel.querySelectorAll("[data-step]").forEach((b) =>
      b.addEventListener("click", () => {
        selectSem(current + Number(b.dataset.step), true);
        if (window.innerWidth < 860) document.getElementById("explorar").scrollIntoView({ behavior: "smooth" });
      })
    );
    if (focusPanel) panel.focus({ preventScroll: true });
  }

  /* ---------------- explorador por eixo ---------------- */
  let currentAxis = "ia";

  function renderAxisChips() {
    const root = document.getElementById("axisChips");
    AXIS_ORDER.forEach((key) => {
      const a = AXES[key];
      const b = document.createElement("button");
      b.className = "chip";
      b.style.setProperty("--c", a.color);
      b.setAttribute("aria-pressed", String(key === currentAxis));
      b.innerHTML = `<span class="chip__dot"></span>${esc(a.name.pt)}`;
      b.addEventListener("click", () => {
        currentAxis = key;
        root.querySelectorAll(".chip").forEach((c) => c.setAttribute("aria-pressed", String(c === b)));
        renderAxisView();
      });
      root.appendChild(b);
    });
  }

  function renderAxisView() {
    const root = document.getElementById("axisview");
    const a = AXES[currentAxis];
    let total = 0;
    const cols = SEMESTERS.map((s) => {
      const comps = s.components.filter((c) => c.axis === currentAxis);
      comps.forEach((c) => { total += c.hours; });
      const inner = comps.length
        ? comps.map((c) => `<div class="timeline__item" style="--c:${a.color}">${esc(c.name.pt)}</div>`).join("")
        : `<div class="timeline__empty"></div>`;
      return `<div class="timeline__col"><span class="timeline__sem">${s.n}º sem.</span>${inner}</div>`;
    }).join("");
    const summary = currentAxis === "cg"
      ? "240 h em eletivas, concentradas no 7º e no 8º semestres, mas algumas podem ser antecipadas."
      : `${fmt(total)} h obrigatórias neste eixo.`;
    root.innerHTML =
      `<div class="tile tile--line" style="--c:${a.color}"><span class="tile__tag">${esc(a.name.pt)}</span>` +
      `<h3>${esc(a.short.pt)}</h3><p>${summary}</p></div>` +
      `<div class="timeline">${cols}</div>`;
  }

  function bindViews() {
    const tabs = document.querySelectorAll("[data-view]");
    tabs.forEach((t) =>
      t.addEventListener("click", () => {
        tabs.forEach((x) => x.setAttribute("aria-selected", String(x === t)));
        document.getElementById("viewSem").hidden = t.dataset.view !== "sem";
        document.getElementById("viewAxis").hidden = t.dataset.view !== "axis";
      })
    );
  }

  /* ---------------- eletivas ---------------- */
  function renderElectives() {
    const root = document.getElementById("elecGrid");
    const groups = [
      { from: 4, feature: true, t: "Trilhas de IA aplicada · a partir do 4º", ico: "🚀" },
      { from: 1, t: "Desde o 1º semestre", ico: "🧭" },
      { from: 2, t: "A partir do 2º semestre", ico: "🐍" },
      { from: 4, feature: false, t: "Formação transversal · a partir do 4º", ico: "🌐" }
    ];
    groups.forEach((g) => {
      const list = ELECTIVES.filter((e) => e.from === g.from && (g.feature === undefined || e.feature === g.feature));
      if (!list.length) return;
      const el = document.createElement("article");
      el.className = "tile reveal";
      if (g.feature) el.classList.add("tile--wide");
      el.innerHTML =
        `<span class="tile__ico" aria-hidden="true">${g.ico}</span><h3>${esc(g.t)}</h3>` +
        `<p>${list.map((e) => `${e.icon ? e.icon + " " : ""}${esc(e.name.pt)} <span style="color:var(--ink-dim);font-family:var(--font-mono);font-size:.74rem">${e.hours} h</span>`).join("<br>")}</p>`;
      root.appendChild(el);
    });
  }

  renderComposition();
  renderSemNav();
  document.getElementById("sempanel").tabIndex = -1;
  selectSem(0);
  renderAxisChips();
  renderAxisView();
  bindViews();
  renderElectives();
  observeReveals(document);
})();
