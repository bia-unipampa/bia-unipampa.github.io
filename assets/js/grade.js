/* =========================================================================
   BIA — grade.js
   "Monte sua grade": planejador de percurso com obrigatórias, eletivas
   (respeitando o semestre mínimo de oferta), ACGs por grupo e ACEE.
   Estado salvo em localStorage (só neste navegador).
   Metas: PPC v1.4, Tabela 2 (CCOG 2.550 h · CCCG 240 h · ACEE 60 h ·
   ACG 360 h, mínimo de 36 h por grupo).
   ========================================================================= */
(function () {
  "use strict";

  const { AXES, SEMESTERS, ELECTIVES } = window.BIA_DATA;
  const KEY = "bia-grade-v1";
  const GOAL = { ccog: 2550, cccg: 240, acee: 60, acg: 360, acgGroup: 36, total: 3210 };
  const GROUPS = { 1: "Ensino", 2: "Pesquisa", 3: "Cultura, sociedade e gestão" };
  const fmt = (n) => n.toLocaleString("pt-BR");
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

  const blank = () => ({ done: {}, electives: {}, acg: [], acee: 0 });
  let state = blank();

  function load() {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) state = Object.assign(blank(), JSON.parse(raw));
    } catch (e) {}
  }
  function save() {
    try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) {}
  }

  const compId = (s, i) => `s${s}-${i}`;
  const elecId = (idx) => `e${idx}`;
  const chosenElectives = () => Object.values(state.electives).flat();

  /* ---------------- semestres ---------------- */
  function renderPlanner() {
    const root = document.getElementById("planner");
    root.innerHTML = "";
    SEMESTERS.forEach((sem) => {
      const card = document.createElement("section");
      card.className = "psem";
      const required = sem.components.filter((c) => !c.elective);
      const mine = state.electives[sem.n] || [];
      const hours = required.reduce((s, c) => s + c.hours, 0) + mine.reduce((s, idx) => s + ELECTIVES[idx].hours, 0);

      const head = document.createElement("div");
      head.className = "psem__head";
      head.innerHTML =
        `<h3>${sem.n}º semestre</h3>` +
        `<span class="psem__load">${fmt(hours)} h · ≈ ${Math.round(hours / 17)} h/semana</span>`;
      const all = document.createElement("button");
      all.type = "button";
      all.className = "psem__all";
      const ids = sem.components.map((c, i) => (c.elective ? null : compId(sem.n, i))).filter(Boolean)
        .concat(mine.map(elecId));
      const allDone = ids.length && ids.every((id) => state.done[id]);
      all.textContent = allDone ? "desmarcar semestre" : "marcar semestre como concluído";
      all.addEventListener("click", () => {
        ids.forEach((id) => { if (allDone) delete state.done[id]; else state.done[id] = true; });
        commit();
      });
      head.appendChild(all);
      card.appendChild(head);

      sem.components.forEach((c, i) => {
        if (c.elective) return;
        card.appendChild(item(compId(sem.n, i), c.name.pt, c.hours, AXES[c.axis].color));
      });
      mine.forEach((idx) => {
        const e = ELECTIVES[idx];
        const el = item(elecId(idx), e.name.pt, e.hours, AXES.cg.color, true);
        const rm = document.createElement("button");
        rm.type = "button";
        rm.className = "pitem__rm";
        rm.setAttribute("aria-label", `Remover ${e.name.pt}`);
        rm.textContent = "✕";
        rm.addEventListener("click", () => {
          state.electives[sem.n] = mine.filter((x) => x !== idx);
          delete state.done[elecId(idx)];
          commit();
        });
        el.querySelector(".pitem__right").appendChild(rm);
        card.appendChild(el);
      });

      // seletor de eletivas disponíveis neste semestre
      const taken = chosenElectives();
      const options = ELECTIVES.map((e, idx) => ({ e, idx }))
        .filter(({ e, idx }) => e.from <= sem.n && !taken.includes(idx));
      if (options.length) {
        const add = document.createElement("div");
        add.className = "padd";
        const sel = document.createElement("select");
        sel.setAttribute("aria-label", `Adicionar eletiva no ${sem.n}º semestre`);
        sel.innerHTML = `<option value="">+ adicionar eletiva…</option>` +
          options.map(({ e, idx }) => `<option value="${idx}">${esc(e.name.pt)} (${e.hours} h)</option>`).join("");
        sel.addEventListener("change", () => {
          if (sel.value === "") return;
          (state.electives[sem.n] = state.electives[sem.n] || []).push(Number(sel.value));
          commit();
        });
        add.appendChild(sel);
        card.appendChild(add);
      }
      root.appendChild(card);
    });
  }

  function item(id, name, hours, color, elective) {
    const row = document.createElement("label");
    row.className = "pitem" + (elective ? " pitem--el" : "") + (state.done[id] ? " is-done" : "");
    row.style.setProperty("--c", color);
    const cb = document.createElement("input");
    cb.type = "checkbox";
    cb.checked = !!state.done[id];
    cb.addEventListener("change", () => {
      if (cb.checked) state.done[id] = true; else delete state.done[id];
      commit();
    });
    const nm = document.createElement("span");
    nm.className = "pitem__name";
    nm.textContent = name;
    const right = document.createElement("span");
    right.className = "pitem__right";
    right.innerHTML = `<span class="pitem__h">${hours} h</span>`;
    row.append(cb, nm, right);
    return row;
  }

  /* ---------------- ACGs ---------------- */
  function renderAcg() {
    const list = document.getElementById("acgList");
    list.innerHTML = "";
    if (!state.acg.length) {
      list.innerHTML = `<li class="acglist__empty" style="border:none;background:none;display:block">Nenhuma atividade registrada ainda.</li>`;
    }
    state.acg.forEach((a, i) => {
      const li = document.createElement("li");
      li.innerHTML =
        `<span class="acglist__g">G${a.group}</span><span>${esc(a.desc)}</span>` +
        `<span class="pitem__h">${a.hours} h</span>`;
      const rm = document.createElement("button");
      rm.type = "button";
      rm.className = "pitem__rm";
      rm.setAttribute("aria-label", `Remover ${a.desc}`);
      rm.textContent = "✕";
      rm.addEventListener("click", () => { state.acg.splice(i, 1); commit(); });
      li.appendChild(rm);
      list.appendChild(li);
    });
    document.getElementById("acee").value = state.acee || 0;
  }

  /* ---------------- resumo ---------------- */
  function meter(label, done, goal, color, planned, extra) {
    const pd = Math.min(100, (done / goal) * 100);
    const pp = planned != null ? Math.min(100 - pd, (Math.max(0, planned - done) / goal) * 100) : 0;
    const status = done >= goal
      ? `<span class="pmeter__ok">✓ meta atingida</span>`
      : (extra || "");
    return `<div class="pmeter">` +
      `<div class="pmeter__row"><span>${label}</span><b>${fmt(Math.min(done, goal))} / ${fmt(goal)} h</b></div>` +
      `<div class="pmeter__bar"><span class="pmeter__fill" style="--c:${color};width:${pd}%"></span>` +
      (pp ? `<span class="pmeter__fill pmeter__fill--plan" style="--c:${color};width:${pp}%"></span>` : "") +
      `</div>${status}</div>`;
  }

  function renderSummary() {
    let ccog = 0;
    SEMESTERS.forEach((sem) => sem.components.forEach((c, i) => {
      if (!c.elective && state.done[compId(sem.n, i)]) ccog += c.hours;
    }));
    const chosen = chosenElectives();
    const cccgPlan = chosen.reduce((s, idx) => s + ELECTIVES[idx].hours, 0);
    const cccgDone = chosen.filter((idx) => state.done[elecId(idx)]).reduce((s, idx) => s + ELECTIVES[idx].hours, 0);
    const byGroup = { 1: 0, 2: 0, 3: 0 };
    state.acg.forEach((a) => { byGroup[a.group] += a.hours; });
    const acg = byGroup[1] + byGroup[2] + byGroup[3];
    const acee = Math.min(GOAL.acee, state.acee || 0);
    const total = Math.min(ccog, GOAL.ccog) + Math.min(cccgDone, GOAL.cccg) + Math.min(acg, GOAL.acg) + acee;

    const pct = Math.round((total / GOAL.total) * 100);
    document.getElementById("pTotal").innerHTML = `${fmt(total)} <small>/ 3.210 h · ${pct}%</small>`;

    const missingGroups = Object.keys(byGroup).filter((g) => byGroup[g] < GOAL.acgGroup);
    const acgWarn = acg > 0 && missingGroups.length
      ? `<span class="pmeter__warn">Falta o mínimo de 36 h em: ${missingGroups.map((g) => GROUPS[g]).join(", ")}</span>`
      : "";
    const cccgNote = cccgPlan < GOAL.cccg
      ? `<span class="pmeter__warn">Planejadas: ${fmt(cccgPlan)} h. Escolha mais ${fmt(GOAL.cccg - cccgPlan)} h nos semestres.</span>`
      : (cccgDone < GOAL.cccg ? `<span class="pmeter__ok">✓ ${fmt(cccgPlan)} h planejadas</span>` : "");

    document.getElementById("pMeters").innerHTML =
      meter("Obrigatórias (CCOG)", ccog, GOAL.ccog, "#22d3ee") +
      meter("Eletivas (CCCG)", cccgDone, GOAL.cccg, AXES.cg.color, cccgPlan, cccgNote) +
      meter("Atividades complementares (ACG)", acg, GOAL.acg, "#b366ff", null, acgWarn) +
      meter("Extensão específica (ACEE)", acee, GOAL.acee, AXES.ia.color);
  }

  function commit() {
    save();
    renderPlanner();
    renderAcg();
    renderSummary();
  }

  /* ---------------- eventos ---------------- */
  document.getElementById("acgForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const desc = document.getElementById("acgDesc").value.trim();
    const hours = parseInt(document.getElementById("acgHours").value, 10);
    const group = Number(document.getElementById("acgGroup").value);
    if (!desc || !(hours > 0)) return;
    state.acg.push({ desc, hours, group });
    e.target.reset();
    commit();
    document.getElementById("acgDesc").focus();
  });
  document.getElementById("acee").addEventListener("change", (e) => {
    state.acee = Math.max(0, Math.min(GOAL.acee, parseInt(e.target.value, 10) || 0));
    commit();
  });
  document.getElementById("btnPrint").addEventListener("click", () => window.print());
  document.getElementById("btnReset").addEventListener("click", () => {
    if (!window.confirm("Apagar todo o planejamento salvo neste navegador?")) return;
    state = blank();
    commit();
  });

  load();
  commit();
})();
