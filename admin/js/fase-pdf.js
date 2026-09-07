/**
 * PDF fase completa — AB + AC + CB su un foglio (orizzontale)
 */
(function () {
  "use strict";

  var MACRO_URL = window.fqUrl ? window.fqUrl("/admin/data/macrociclo-2026-2027.json") : "/admin/data/macrociclo-2026-2027.json";
  var BLOCCO1_URL = window.fqUrl ? window.fqUrl("/admin/data/blocco-1-fase1.json") : "/admin/data/blocco-1-fase1.json";
  var BLOCCO1_ID = "ipertrofia-accumulo";

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

  function render(macro, fase, root, blocco) {
    root.innerHTML = "";
    document.title = "PDF · " + fase.nome + " | Nicola";
    var tipo = blocco ? blocco.tipo : "Periodizzazione";

    var article = el("article", { className: "scheda-a4 scheda-a4--admin" });
    var head = el("header", { className: "scheda-a4__head" });
    head.innerHTML =
      "<p class=\"pdf-kicker\">Scheda allenamento · " + tipo + "</p>" +
      "<h1>" + fase.settimane + " sett. · " + fase.nome + "</h1>" +
      "<p><strong>Atleta:</strong> _______________</p>" +
      "<p>Periodo: " + formatDate(fase.inizio) + " – " + formatDate(fase.fine) + " · RIR: " + (fase.rir || "—") + "</p>";
    article.appendChild(head);

    var intro = el("div", { className: "scheda-a4__osservazioni scheda-a4__intro-fase" });
    var introHtml = "<h2>Spiegazione fase</h2><p>" + (fase.guida || fase.obiettivo || "") + "</p>";
    if (fase.perche) introHtml += "<p><strong>A cosa serve.</strong> " + fase.perche + "</p>";
    if (fase.intensitaRecupero) {
      var ir = fase.intensitaRecupero;
      introHtml += "<p><strong>Intensità.</strong> " + (ir.intensita || "") + "</p>";
      introHtml += "<p><strong>Recupero.</strong> " + (ir.recupero || "") + " · " + (ir.durataSeduta || "") + "</p>";
    }
    if (fase.schedaIntro) introHtml += "<p>" + fase.schedaIntro + "</p>";
    intro.innerHTML = introHtml;
    article.appendChild(intro);

    if (blocco && blocco.guidaOperativa) {
      var g = blocco.guidaOperativa;
      var metodo = el("div", { className: "scheda-a4__osservazioni scheda-a4__metodo" });
      var mh = "<h2>Metodo — settimana tipo</h2><p>" + g.sintesi + "</p>";
      if (g.distribuzioneSettimanale && g.distribuzioneSettimanale.consigliata) {
        mh += "<p><strong>Settimana:</strong> ";
        mh += g.distribuzioneSettimanale.consigliata
          .filter(function (r) { return r.sessione !== "Riposo"; })
          .map(function (r) { return r.giorno.slice(0, 3) + " " + r.sessione; })
          .join(" · ");
        mh += "</p>";
      }
      metodo.innerHTML = mh;
      article.appendChild(metodo);
    }

    var grid = el("div", { className: "scheda-a4__grid" });
    ["ab", "ac", "cb"].forEach(function (key) {
      var day = fase.sessioni[key];
      if (!day) return;
      var quad = el("section", { className: "scheda-a4__quad" });
      quad.appendChild(el("h2", { text: key.toUpperCase() + " · " + day.nome }));
      if (day.giorno) quad.appendChild(el("p", { className: "scheda-a4__quad-meta", text: day.giorno + " · " + (day.quotaVolume || "") }));
      var table = el("table");
      table.innerHTML = "<thead><tr><th>Esercizio</th><th>S×R</th><th>RIR</th><th>Rec</th><th>kg</th><th>Note</th></tr></thead>";
      var tbody = el("tbody");
      day.esercizi.forEach(function (ex) {
        var tr = el("tr");
        tr.innerHTML =
          "<td>" + ex.nome + (ex.progressione ? " *" : "") + "</td>" +
          "<td>" + ex.serie + "×" + ex.ripetizioni + "</td>" +
          "<td>" + (ex.rir || "") + "</td>" +
          "<td>" + (ex.recupero || "") + "</td>" +
          "<td>_______</td>" +
          "<td>" + (ex.note || "") + "</td>";
        tbody.appendChild(tr);
      });
      table.appendChild(tbody);
      quad.appendChild(table);
      grid.appendChild(quad);
    });
    article.appendChild(grid);
    article.appendChild(el("footer", {
      className: "scheda-a4__foot",
      text: fase.nome + " · Nicola · * = progressione · kg a penna"
    }));
    root.appendChild(article);
  }

  function init() {
    var root = document.getElementById("fase-pdf-root");
    if (!root) return;
    var params = new URLSearchParams(window.location.search);
    var faseId = params.get("fase");
    if (!faseId) {
      root.innerHTML = "<p>Parametro fase mancante. <a href=\"/\">Torna al ciclo</a></p>";
      return;
    }
    fetch(MACRO_URL)
      .then(function (r) { return r.json(); })
      .then(function (macro) {
        var fase = macro.fasi.find(function (f) { return f.id === faseId; });
        if (!fase) throw new Error("Fase non trovata");
        if (faseId === BLOCCO1_ID) {
          return fetch(BLOCCO1_URL).then(function (r) { return r.json(); })
            .then(function (blocco) { render(macro, fase, root, blocco); });
        }
        render(macro, fase, root, null);
      })
      .catch(function (err) { root.innerHTML = "<p>Errore: " + err.message + "</p>"; });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
