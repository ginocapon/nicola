/**
 * Pagina sessione — scheda Nicola (layout come Michele-allenamenti)
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
    nav.innerHTML = '<a href="' + u("/") + '">Ciclo</a> · <strong>' + sessionKey.toUpperCase() + "</strong>";
    root.appendChild(nav);

    var head = el("header", { className: "admin-session-head" });
    var ir = fase.intensitaRecupero || {};
    var lead = (fase.perche ? fase.perche + " " : "") + (s.notaSeduta || fase.obiettivo || "");
    head.innerHTML =
      "<p class=\"tagline\">" + formatDate(fase.inizio) + " – " + formatDate(fase.fine) +
      " · " + (s.giorno || "") + " · " + (s.quotaVolume || "") + "</p>" +
      "<h1>" + sessionKey.toUpperCase() + " — " + s.nome + "</h1>" +
      "<p class=\"lead\">" + lead + "</p>";
    root.appendChild(head);

    if (ir.intensita || ir.recupero || ir.durataSeduta) {
      var irBox = el("aside", { className: "admin-fase__ir" });
      if (ir.intensita) irBox.appendChild(el("p", { html: "<strong>Intensità.</strong> " + ir.intensita }));
      if (ir.recupero) irBox.appendChild(el("p", { html: "<strong>Recupero.</strong> " + ir.recupero }));
      if (ir.durataSeduta) irBox.appendChild(el("p", { html: "<strong>Durata.</strong> " + ir.durataSeduta }));
      root.appendChild(irBox);
    }

    var actions = el("div", { className: "admin-session-actions no-print" });
    actions.innerHTML =
      '<a class="btn btn-primary" href="' +
      u("/admin/sessione/pdf/?ciclo=" + encodeURIComponent(faseId) + "&sessione=" + sessionKey) +
      '" target="_blank" rel="noopener">PDF scheda</a>';
    root.appendChild(actions);

    var tableWrap = el("div", { className: "table-wrap" });
    var table = el("table", { className: "scheda-table admin-session-table" });
    table.innerHTML =
      "<thead><tr><th>#</th><th>Esercizio</th><th>Gruppo</th><th>S×R</th><th>Peso</th><th>Rec</th><th>RIR</th><th>Note</th></tr></thead>";
    var tbody = el("tbody");
    s.esercizi.forEach(function (ex, i) {
      var tr = el("tr");
      if (ex.progressione) tr.className = "admin-row--prog";
      tr.innerHTML =
        "<td>" + (i + 1) + (ex.progressione ? " *" : "") + "</td>" +
        "<td><strong>" + ex.nome + "</strong>" +
        (ex.seriePieno && ex.seriePieno > ex.serie ? " <span class=\"tag-prog\">→ " + ex.seriePieno + " s.</span>" : "") +
        "</td>" +
        "<td>" + ex.gruppo + "</td>" +
        "<td>" + ex.serie + "×" + ex.ripetizioni + "</td>" +
        "<td class=\"admin-peso\">_______</td>" +
        "<td>" + (ex.recupero || "—") + "</td>" +
        "<td>" + (ex.rir || "—") + "</td>" +
        "<td>" + (ex.note || "—") + "</td>";
      tbody.appendChild(tr);
    });
    table.appendChild(tbody);
    tableWrap.appendChild(table);
    root.appendChild(tableWrap);

    var logBox = el("aside", { className: "admin-log-box no-print" });
    logBox.innerHTML = "<h2>Log seduta</h2><p>Data: _______ · Durata: _______ · RPE medio: _______</p>";
    root.appendChild(logBox);

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
      root.innerHTML = "<p>Parametro <code>ciclo</code> mancante. <a href=\"" + u("/") + "\">Torna al ciclo</a>.</p>";
      return;
    }
    fetch(MACRO_URL)
      .then(function (r) {
        if (!r.ok) throw new Error("JSON " + r.status);
        return r.json();
      })
      .then(function (data) { renderSession(data, faseId, sessionKey, root); })
      .catch(function (err) { root.innerHTML = "<p class=\"status error\">Errore: " + err.message + "</p>"; });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
