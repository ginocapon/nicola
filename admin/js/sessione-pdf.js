/**
 * PDF / stampa scheda sessione Nicola
 */
(function () {
  "use strict";

  function u(path) {
    return window.fqUrl ? window.fqUrl(path) : path;
  }

  var MACRO_URL = u("/admin/data/macrociclo-2026-2027.json");

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

  function formatDate(iso) {
    return new Date(iso + "T12:00:00").toLocaleDateString("it-IT", {
      day: "numeric", month: "short", year: "numeric"
    });
  }

  function findFase(data, id) {
    return data.fasi.find(function (f) { return f.id === id; });
  }

  function buildExerciseLog(ex) {
    var log = el("div", { className: "ex-pdf-log" });
    log.appendChild(el("p", { className: "ex-pdf-log__label", text: "Log" }));
    var sets = el("div", { className: "ex-pdf-log__sets" });
    var n = Math.min(ex.serie || 4, 6);
    for (var s = 1; s <= n; s++) {
      var row = el("div", { className: "ex-pdf-log__set" });
      row.innerHTML = "<span>S" + s + "</span> kg: _______ rep: _______";
      sets.appendChild(row);
    }
    log.appendChild(sets);
    log.appendChild(el("div", { className: "ex-pdf-log__note", html: "Note: _________________________" }));
    return log;
  }

  function renderPdf(data, faseId, sessionKey, root) {
    var fase = findFase(data, faseId);
    if (!fase || !fase.sessioni[sessionKey]) {
      root.innerHTML = "<p>Sessione non trovata.</p>";
      return;
    }
    var s = fase.sessioni[sessionKey];
    root.innerHTML = "";
    document.title = "PDF · " + sessionKey.toUpperCase() + " · " + fase.nome;

    var article = el("article", { className: "scheda-sessione-pdf" });

    var head = el("header", { className: "scheda-sessione-pdf__head" });
    head.innerHTML =
      "<p class=\"pdf-kicker\">Scheda allenamento</p>" +
      "<h1>" + sessionKey.toUpperCase() + " — " + s.nome + "</h1>" +
      "<p class=\"pdf-meta\">" + fase.nome + " · " + formatDate(fase.inizio) + " – " + formatDate(fase.fine) + "</p>" +
      "<p class=\"pdf-meta\">" + (s.giorno || "") + " · " + (s.quotaVolume || "") + " · RIR: " + (fase.rir || "—") + "</p>" +
      "<p class=\"pdf-atleta\"><strong>Atleta:</strong> _______________</p>" +
      (fase.perche ? "<p class=\"pdf-perche\">" + fase.perche + "</p>" : "");
    if (fase.intensitaRecupero) {
      var ir = fase.intensitaRecupero;
      head.innerHTML +=
        "<p><strong>Intensità:</strong> " + (ir.intensita || "") + "</p>" +
        "<p><strong>Recupero:</strong> " + (ir.recupero || "") + " · " + (ir.durataSeduta || "") + "</p>";
    }
    if (s.notaSeduta) head.innerHTML += "<p class=\"pdf-nota\">" + s.notaSeduta + "</p>";
    article.appendChild(head);

    article.appendChild(el("div", {
      className: "scheda-sessione-pdf__session-bar",
      html: "Data: ___/___/___ · Durata: _______ · RPE: ___"
    }));

    s.esercizi.forEach(function (ex, i) {
      var row = el("div", { className: "ex-pdf-row" + (ex.progressione ? " ex-pdf-row--prog" : "") });
      var body = el("div", { className: "ex-pdf-row__body" });
      body.innerHTML =
        "<p class=\"ex-pdf-row__num\">" + (i + 1) + (ex.progressione ? " *" : "") + "</p>" +
        "<p class=\"ex-pdf-row__name\">" + ex.nome + (ex.progressione ? " · Progressione" : "") + "</p>" +
        "<p class=\"ex-pdf-row__gruppo\">" + ex.gruppo + "</p>" +
        "<p class=\"ex-pdf-row__params\">" + ex.serie + "×" + ex.ripetizioni +
        " · Rec " + (ex.recupero || "—") + " · RIR " + (ex.rir || "—") + " · kg: _______</p>" +
        (ex.note ? "<p class=\"ex-pdf-row__note\">" + ex.note + "</p>" : "");
      row.appendChild(body);
      row.appendChild(buildExerciseLog(ex));
      article.appendChild(row);
    });

    article.appendChild(el("footer", {
      className: "scheda-sessione-pdf__foot",
      text: fase.nome + " · " + sessionKey.toUpperCase() + " · Nicola · pesi a penna"
    }));
    root.appendChild(article);
  }

  function init() {
    var root = document.getElementById("pdf-root");
    if (!root) return;
    var params = new URLSearchParams(window.location.search);
    var faseId = params.get("ciclo");
    var sessionKey = (params.get("sessione") || "ab").toLowerCase();

    var printBtn = document.getElementById("pdf-print-btn");
    if (printBtn) printBtn.addEventListener("click", function () { window.print(); });

    if (!faseId) {
      root.innerHTML = "<p>Parametro ciclo mancante.</p>";
      return;
    }

    fetch(MACRO_URL)
      .then(function (r) { return r.json(); })
      .then(function (data) { renderPdf(data, faseId, sessionKey, root); })
      .catch(function (err) { root.innerHTML = "<p>Errore: " + err.message + "</p>"; });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
