/**
 * PDF fase AB+AC+CB — layout Forza Quotidiana (foglio bianco A4 orizzontale)
 */
(function () {
  "use strict";

  var HUB_URL = window.fqUrl ? window.fqUrl("/admin/data/hub-periodizzazione.json") : "/admin/data/hub-periodizzazione.json";
  var BLOCCO1_URL = window.fqUrl ? window.fqUrl("/admin/data/blocco-1-fase1.json") : "/admin/data/blocco-1-fase1.json";
  var SESSION_KEYS = ["ab", "ac", "cb"];

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
      day: "numeric", month: "short", year: "numeric"
    });
  }

  function sessionTitle(key, day) {
    var code = ((day && day.codice) || key.toUpperCase()).replace(/^\s+|\s+$/g, "");
    var nome = ((day && day.nome) || "").replace(/^\s+|\s+$/g, "");
    if (!nome) return code;
    var safe = code.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    if (new RegExp("^" + safe + "\\s*[·•\\-–:]\\s*", "i").test(nome)) return nome;
    if (nome.toUpperCase().indexOf(code.toUpperCase()) === 0) return nome;
    return code + " · " + nome;
  }

  function compactReps(raw) {
    if (raw == null || raw === "") return "";
    var s = String(raw).replace(/\s+/g, " ").trim();
    var first = s.match(/^(\d+(?:\s*[–\-]\s*\d+)?)/);
    if (first) return first[1].replace(/\s/g, "");
    return s.replace(/\s*\([^)]*\)/g, "").split(/\s*·\s*/)[0].trim();
  }

  function normName(s) {
    return String(s || "")
      .toLowerCase()
      .replace(/[àá]/g, "a")
      .replace(/[èé]/g, "e")
      .replace(/[ìí]/g, "i")
      .replace(/[òó]/g, "o")
      .replace(/[ùú]/g, "u")
      .replace(/[^a-z0-9]+/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  }

  function tokens(s) {
    return normName(s.nome || s).split(" ").filter(function (w) { return w.length > 2; });
  }

  function scoreMatch(a, b) {
    var ta = tokens(a);
    var tb = tokens(b);
    if (!ta.length || !tb.length) return 0;
    var hit = 0;
    ta.forEach(function (t) {
      if (tb.indexOf(t) !== -1) hit += 1;
    });
    return hit / Math.max(ta.length, tb.length);
  }

  function findMatch(templateEx, liveList, used) {
    var bestI = -1;
    var bestS = 0.4;
    liveList.forEach(function (ex, i) {
      if (used[i]) return;
      var s = scoreMatch(templateEx, ex);
      if (s > bestS) {
        bestS = s;
        bestI = i;
      }
    });
    return bestI;
  }

  function mergeSessions(blocco, fase) {
    var out = {};
    SESSION_KEYS.forEach(function (key) {
      var tpl = blocco.sessioni[key];
      var live = fase.sessioni && fase.sessioni[key];
      if (!tpl) {
        out[key] = live;
        return;
      }
      var used = {};
      out[key] = {
        codice: tpl.codice,
        nome: tpl.nome,
        giorno: (live && live.giorno) || tpl.giorno,
        quotaVolume: (live && live.quotaVolume) || tpl.quotaVolume,
        esercizi: tpl.esercizi.map(function (ex) {
          var row = {
            nome: ex.nome,
            serie: ex.serie,
            ripetizioni: ex.ripetizioni,
            tempo: ex.tempo,
            recupero: ex.recupero,
            progressionePrincipale: ex.progressionePrincipale === true || ex.progressione === true
          };
          if (!live || !live.esercizi) return row;
          var i = findMatch(ex, live.esercizi, used);
          if (i < 0) return row;
          used[i] = true;
          var src = live.esercizi[i];
          if (src.serie != null) row.serie = src.serie;
          if (src.ripetizioni) row.ripetizioni = compactReps(src.ripetizioni);
          if (src.recupero) row.recupero = src.recupero;
          if (src.progressione === true) row.progressionePrincipale = true;
          return row;
        })
      };
    });
    return out;
  }

  function render(macro, fase, root, blocco) {
    root.innerHTML = "";
    document.title = "PDF · " + fase.nome + " | Nicola";

    var titleEl = document.getElementById("fase-pdf-title");
    if (titleEl) titleEl.textContent = "PDF riassunto AB–CB · " + fase.nome.replace(/^Fase \d+ · /, "");

    var tipo = (fase.id === "ipertrofia-accumulo" && blocco && blocco.tipo)
      ? blocco.tipo
      : String(fase.nome || "Periodizzazione").replace(/^Fase\s*\d+\s*[·•]\s*/i, "").toUpperCase();

    var sessioni = (fase.id === "ipertrofia-accumulo" && blocco && blocco.sessioni)
      ? blocco.sessioni
      : (blocco && blocco.sessioni ? mergeSessions(blocco, fase) : fase.sessioni);

    var article = el("article", { className: "scheda-a4 scheda-a4--admin" });

    var head = el("header", { className: "scheda-a4__head" });
    head.innerHTML =
      "<div class=\"scheda-a4__head-main\">Scheda allenamento · <span>" + tipo + "</span></div>" +
      "<p class=\"scheda-a4__head-period\">" +
      "<span class=\"scheda-a4__badge\">" + fase.settimane + " SETT</span> " + fase.nome +
      "</p>" +
      "<div class=\"scheda-a4__head-meta\">" +
      "<span><strong>Atleta:</strong> _______________</span>" +
      "<span><strong>Periodo:</strong> " + formatDate(fase.inizio) + " – " + formatDate(fase.fine) + "</span>" +
      "<span><strong>RIR:</strong> " + (fase.rir || "—") + "</span>" +
      "<span><strong>Settimana:</strong> Lun AB · Mer AC · Sab CB</span>" +
      "</div>";
    article.appendChild(head);

    var oss = el("div", { className: "scheda-a4__osservazioni scheda-a4__intro-fase" });
    var ossText = (fase.perche || fase.obiettivo || fase.guida || "").slice(0, 220);
    oss.innerHTML =
      "<strong>Osservazioni / note</strong> " +
      (ossText ? ossText + " — " : "") +
      "______________________________________________________________";
    article.appendChild(oss);

    var grid = el("div", { className: "scheda-a4__grid scheda-a4__grid--abc" });
    SESSION_KEYS.forEach(function (key) {
      var day = sessioni[key];
      if (!day) return;
      var quad = el("section", {
        className: "scheda-a4__quad" + (key === "cb" ? " scheda-a4__quad--cb" : "")
      });
      var h2 = el("h2");
      h2.textContent = sessionTitle(key, day);
      if (day.giorno || day.quotaVolume) {
        var sub = el("span", {
          className: "scheda-a4__quad-sub",
          text: [day.giorno, day.quotaVolume].filter(Boolean).join(" · ")
        });
        h2.appendChild(document.createElement("br"));
        h2.appendChild(sub);
      }
      quad.appendChild(h2);

      var table = el("table");
      table.innerHTML = "<thead><tr><th>Esercizio</th><th>S×R</th><th>TUT</th><th>Rec</th><th>kg</th><th>Reps</th><th>Note</th></tr></thead>";
      var tbody = el("tbody");
      day.esercizi.forEach(function (ex) {
        var tr = el("tr");
        var nome = ex.nome + (ex.progressionePrincipale === true || ex.progressione === true ? " *" : "");
        tr.innerHTML =
          "<td>" + nome + "</td>" +
          "<td>" + ex.serie + "×" + compactReps(ex.ripetizioni) + "</td>" +
          "<td>" + (ex.tempo || ex.tut || "—") + "</td>" +
          "<td>" + (ex.recupero || "—") + "</td>" +
          "<td></td><td></td><td></td>";
        tbody.appendChild(tr);
      });
      table.appendChild(tbody);
      quad.appendChild(table);
      grid.appendChild(quad);
    });
    article.appendChild(grid);

    article.appendChild(el("footer", {
      className: "scheda-a4__foot",
      text: fase.nome + " · Nicola · * = progressione · kg a penna · uso palestra"
    }));

    root.appendChild(article);
  }

  function init() {
    var root = document.getElementById("fase-pdf-root");
    if (!root) return;
    var params = new URLSearchParams(window.location.search);
    var annoId = params.get("anno") || "2026-2027";
    var faseId = params.get("fase");
    if (!faseId) {
      root.innerHTML = "<p>Parametro fase mancante. <a href=\"" + u("/") + "\">Torna al ciclo</a></p>";
      return;
    }

    Promise.all([
      fetch(u(HUB_URL)).then(function (r) { return r.json(); }),
      fetch(u(BLOCCO1_URL)).then(function (r) { return r.json(); })
    ])
      .then(function (pair) {
        var hub = pair[0];
        var blocco = pair[1];
        var anno = hub.anni.find(function (a) { return a.id === annoId; }) || hub.anni[0];
        return fetch(u(anno.macrocicloUrl)).then(function (r) { return r.json(); }).then(function (macro) {
          return { macro: macro, blocco: blocco };
        });
      })
      .then(function (pack) {
        var fase = pack.macro.fasi.find(function (f) { return f.id === faseId; });
        if (!fase) {
          root.innerHTML = "<p>Fase non trovata. <a href=\"" + u("/") + "\">Ciclo</a></p>";
          return;
        }
        render(pack.macro, fase, root, pack.blocco);
      })
      .catch(function (err) {
        root.innerHTML = "<p>Errore: " + err.message + "</p>";
      });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
