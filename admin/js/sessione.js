/**
 * Pagina sessione — scheda Nicola
 */
(function () {
  "use strict";

  var MACRO_URL = window.fqUrl ? window.fqUrl("/admin/data/macrociclo-2026-2027.json") : "/admin/data/macrociclo-2026-2027.json";

  function el(tag, attrs, children) {
    var node = document.createElement(tag);
    if (attrs) {
      Object.keys(attrs).forEach(function (k) {
        if (k === "className") node.className = attrs[k];
        else if (k === "html") node.innerHTML = attrs[k];
        else if (k === "text") node.textContent = attrs[k];
        else node.setAttribute(k, attrs[k]);
      });
    }
    (children || []).forEach(function (c) {
      if (typeof c === "string") node.appendChild(document.createTextNode(c));
      else if (c) node.appendChild(c);
    });
    return node;
  }

  function u(path) {
    return window.fqUrl ? window.fqUrl(path) : path;
  }

  function formatDate(iso) {
    return new Date(iso + "T12:00:00").toLocaleDateString("it-IT", {
      day: "numeric", month: "long", year: "numeric"
    });
  }

  function findFase(data, id) {
    return data.fasi.find(function (f) { return f.id === id; });
  }

  function sessionHref(faseId, sessionKey) {
    return u("/admin/sessione/?ciclo=" + encodeURIComponent(faseId) + "&sessione=" + sessionKey);
  }

  function renderSession(data, faseId, sessionKey, root) {
    var fase = findFase(data, faseId);
    if (!fase || !fase.sessioni[sessionKey]) {
      root.innerHTML = "<p>Sessione non trovata.</p>";
      return;
    }
    var s = fase.sessioni[sessionKey];
    root.innerHTML = "";
    document.title = sessionKey.toUpperCase() + " · " + fase.nome + " | Nicola";

    var nav = el("nav", { className: "admin-breadcrumb" });
    nav.innerHTML = '<a href="' + u("/") + '">Ciclo</a> · <span>' + sessionKey.toUpperCase() + "</span>";
    root.appendChild(nav);

    var head = el("header", { className: "admin-session-head" });
    var ir = fase.intensitaRecupero || {};
    head.innerHTML =
      "<p class=\"session-meta\">" + formatDate(fase.inizio) + " – " + formatDate(fase.fine) +
      " · " + (s.giorno || "") + " · " + (s.quotaVolume || "") + "</p>" +
      "<h1>" + sessionKey.toUpperCase() + " — " + s.nome + "</h1>" +
      "<p class=\"session-lead\">" + (s.notaSeduta || fase.obiettivo || "") + "</p>";
    root.appendChild(head);

    if (fase.perche || ir.intensita) {
      var irBox = el("aside", { className: "admin-fase__ir" });
      if (fase.perche) irBox.appendChild(el("p", { html: "<strong>A cosa serve.</strong> " + fase.perche }));
      if (ir.intensita) irBox.appendChild(el("p", { html: "<strong>Intensità.</strong> " + ir.intensita }));
      if (ir.recupero) irBox.appendChild(el("p", { html: "<strong>Recupero.</strong> " + ir.recupero }));
      if (ir.durataSeduta) irBox.appendChild(el("p", { html: "<strong>Durata.</strong> " + ir.durataSeduta }));
      root.appendChild(irBox);
    }

    var actions = el("div", { className: "admin-session-actions no-print" });
    actions.innerHTML =
      '<a class="btn btn-primary" href="' +
      u("/admin/sessione/pdf/?ciclo=" + encodeURIComponent(faseId) + "&sessione=" + sessionKey) +
      '" target="_blank" rel="noopener">Scarica PDF</a>' +
      '<button type="button" class="btn btn-ghost" onclick="window.print()">Stampa pagina</button>';
    root.appendChild(actions);

    var cards = el("div", { className: "exercise-list" });
    s.esercizi.forEach(function (ex, i) {
      var card = el("article", { className: "exercise-card" + (ex.progressione ? " exercise-card--prog" : "") });
      card.innerHTML =
        "<div class=\"exercise-card__num\">" + (i + 1) + (ex.progressione ? " *" : "") + "</div>" +
        "<div class=\"exercise-card__body\">" +
        "<h3>" + ex.nome + "</h3>" +
        "<p class=\"exercise-card__gruppo\">" + ex.gruppo + "</p>" +
        "<div class=\"exercise-card__params\">" +
        "<span><strong>Serie×Rep</strong> " + ex.serie + "×" + ex.ripetizioni + "</span>" +
        "<span><strong>Recupero</strong> " + (ex.recupero || "—") + "</span>" +
        "<span><strong>RIR</strong> " + (ex.rir || "—") + "</span>" +
        "<span><strong>Peso</strong> _______</span>" +
        "</div>" +
        (ex.note ? "<p class=\"exercise-card__note\">" + ex.note + "</p>" : "") +
        "</div>";
      cards.appendChild(card);
    });
    root.appendChild(cards);

    var diario = el("section", { className: "admin-diario no-print" });
    diario.innerHTML = "<h2>Log seduta</h2><p>Data: _______ · Durata: _______ · RPE medio: _______</p>";
    var tableWrap = el("div", { className: "table-wrap" });
    var table = el("table", { className: "scheda-table" });
    table.innerHTML = "<thead><tr><th>Esercizio</th><th>Kg</th><th>S1</th><th>S2</th><th>S3</th><th>S4</th><th>RIR</th></tr></thead>";
    var tbody = el("tbody");
    s.esercizi.forEach(function (ex) {
      var tr = el("tr");
      tr.innerHTML =
        "<td>" + ex.nome + "</td><td></td><td></td><td></td><td></td>" +
        "<td>" + (ex.serie >= 4 ? "" : "—") + "</td><td></td>";
      tbody.appendChild(tr);
    });
    table.appendChild(tbody);
    tableWrap.appendChild(table);
    diario.appendChild(tableWrap);
    root.appendChild(diario);

    var links = el("nav", { className: "admin-session-nav" });
    ["ab", "ac", "cb"].forEach(function (k) {
      if (!fase.sessioni[k]) return;
      links.appendChild(el("a", {
        href: sessionHref(faseId, k),
        className: k === sessionKey ? "is-active" : "",
        text: k.toUpperCase()
      }));
    });
    root.appendChild(links);
  }

  function init() {
    var root = document.getElementById("sessione-root");
    if (!root) return;
    var params = new URLSearchParams(window.location.search);
    var faseId = params.get("ciclo");
    var sessionKey = (params.get("sessione") || "ab").toLowerCase();
    if (!faseId) {
      root.innerHTML = "<p>Parametro ciclo mancante. <a href=\"" + (window.fqUrl ? window.fqUrl("/") : "/") + "\">Torna al ciclo</a>.</p>";
      return;
    }
    fetch(MACRO_URL)
      .then(function (r) { return r.json(); })
      .then(function (data) { renderSession(data, faseId, sessionKey, root); })
      .catch(function (err) { root.innerHTML = "<p class=\"status error\">Errore: " + err.message + "</p>"; });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
