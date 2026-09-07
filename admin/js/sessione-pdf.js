/**
 * PDF scheda sessione Nicola — layout stampabile come Michele-allenamenti
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
      row.innerHTML =
        "<span>S" + s + "</span>" +
        "<span class=\"ex-pdf-log__kg\">kg: _______</span>" +
        "<span class=\"ex-pdf-log__set-line\"></span>" +
        "<span>rep</span>";
      sets.appendChild(row);
    }
    log.appendChild(sets);
    var note = el("div", { className: "ex-pdf-log__note" });
    note.innerHTML = "Note<div class=\"ex-pdf-log__note-line\"></div>";
    log.appendChild(note);
    return log;
  }

  function figureNum(i, ex) {
    var wrap = el("div", { className: "ex-pdf-row__fig" });
    wrap.innerHTML = "<span style=\"font-size:9pt;font-weight:700;color:#8b4513\">" +
      (i + 1) + (ex.progressione ? "*" : "") + "</span>";
    return wrap;
  }

  function renderPdf(data, faseId, sessionKey, root) {
    var fase = findFase(data, faseId);
    if (!fase || !fase.sessioni[sessionKey]) {
      root.innerHTML = "<p>Sessione non trovata.</p>";
      return;
    }
    var s = fase.sessioni[sessionKey];
    root.innerHTML = "";
    document.title = "PDF · " + sessionKey.toUpperCase() + " · " + fase.nome + " | Nicola";

    var article = el("article", { className: "scheda-sessione-pdf" });

    var head = el("header", { className: "scheda-sessione-pdf__head" });
    head.innerHTML =
      "<p class=\"scheda-sessione-pdf__brand\">Scheda allenamento</p>" +
      "<h1>" + sessionKey.toUpperCase() + " — " + s.nome + "</h1>" +
      "<div class=\"scheda-sessione-pdf__meta\">" +
      "<span><span class=\"scheda-sessione-pdf__badge\">" + fase.nome + "</span></span>" +
      "<span><strong>Periodo:</strong> " + formatDate(fase.inizio) + " – " + formatDate(fase.fine) + "</span>" +
      "<span><strong>Settimane:</strong> " + fase.settimane + "</span>" +
      "<span><strong>RIR:</strong> " + (fase.rir || "—") + "</span>" +
      "<span><strong>Atleta:</strong> _______________</span>" +
      "</div>" +
      "<p class=\"scheda-sessione-pdf__obiettivo\">" + (fase.perche || fase.obiettivo || "") + "</p>";
    if (fase.intensitaRecupero) {
      var ir = fase.intensitaRecupero;
      head.innerHTML +=
        "<p class=\"scheda-sessione-pdf__obiettivo\"><strong>Intensità.</strong> " + (ir.intensita || "") + "</p>" +
        "<p class=\"scheda-sessione-pdf__obiettivo\"><strong>Recupero.</strong> " + (ir.recupero || "") +
        " · " + (ir.durataSeduta || "45–60 min") + "</p>";
    }
    if (s.notaSeduta) {
      head.innerHTML += "<p class=\"scheda-sessione-pdf__obiettivo\">" + s.notaSeduta + "</p>";
    }
    if (s.giorno || s.quotaVolume) {
      head.innerHTML += "<p class=\"scheda-sessione-pdf__obiettivo\">" +
        (s.giorno || "") + (s.quotaVolume ? " · " + s.quotaVolume : "") + "</p>";
    }
    article.appendChild(head);

    var oss = el("div", { className: "scheda-sessione-pdf__osservazioni" });
    oss.innerHTML =
      "<div class=\"scheda-sessione-pdf__osservazioni-label\">Osservazioni / note sessione</div>" +
      "<div class=\"scheda-sessione-pdf__osservazioni-line\"></div>" +
      "<div class=\"scheda-sessione-pdf__osservazioni-line\"></div>";
    article.appendChild(oss);

    var main = el("div", { className: "scheda-sessione-pdf__main" });
    var sessionBar = el("div", { className: "scheda-sessione-pdf__session-bar" });
    sessionBar.innerHTML =
      "<span><strong>Data:</strong> ___/___/___</span>" +
      "<span><strong>Durata:</strong> _______</span>" +
      "<span><strong>RPE medio:</strong> ___</span>";
    main.appendChild(sessionBar);

    s.esercizi.forEach(function (ex, i) {
      var row = el("div", { className: "ex-pdf-row" + (ex.progressione ? " ex-pdf-row--prog" : "") });
      row.appendChild(figureNum(i, ex));

      var body = el("div");
      var nameLine = el("p", { className: "ex-pdf-row__name" });
      nameLine.textContent = ex.nome;
      if (ex.progressione) {
        nameLine.appendChild(el("span", { className: "ex-pdf-row__prog", text: " · Progressione" }));
      }
      body.appendChild(nameLine);

      body.appendChild(el("p", {
        className: "ex-pdf-row__muscles",
        html: "<strong>Gruppo:</strong> " + ex.gruppo
      }));

      body.appendChild(el("div", {
        className: "ex-pdf-row__params",
        html: "<span><strong>" + ex.serie + "×" + ex.ripetizioni + "</strong></span>" +
          "<span class=\"target-kg\">kg: _______</span>" +
          "<span>Rec " + (ex.recupero || "—") + "</span>" +
          "<span>RIR " + (ex.rir || "—") + "</span>"
      }));

      if (ex.note) {
        var tech = el("ul", { className: "ex-pdf-row__tech" });
        tech.appendChild(el("li", { html: "<strong>Nota scheda:</strong> " + ex.note }));
        body.appendChild(tech);
      }

      row.appendChild(body);
      row.appendChild(buildExerciseLog(ex));
      main.appendChild(row);
    });
    article.appendChild(main);

    article.appendChild(el("footer", {
      className: "scheda-sessione-pdf__foot",
      text: fase.nome + " · " + sessionKey.toUpperCase() + " · pesi a penna · Nicola"
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
      root.innerHTML = "<p>Parametro ciclo mancante. <a href=\"" + u("/") + "\">Torna al ciclo</a></p>";
      return;
    }

    fetch(MACRO_URL)
      .then(function (r) {
        if (!r.ok) throw new Error("JSON " + r.status);
        return r.json();
      })
      .then(function (data) { renderPdf(data, faseId, sessionKey, root); })
      .catch(function (err) { root.innerHTML = "<p>Errore: " + err.message + "</p>"; });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
