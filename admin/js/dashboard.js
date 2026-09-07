/**
 * Dashboard ciclo Nicola — estetica Michele, contenuto Nicola
 */
(function () {
  "use strict";

  var DATA_URL = window.fqUrl ? window.fqUrl("/admin/data/macrociclo-2026-2027.json") : "/admin/data/macrociclo-2026-2027.json";
  var SESSIONI = ["ab", "ac", "cb"];

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

  function shortName(sessione) {
    return (sessione.nome || "").replace(/^(AB|AC|CB)\s*·\s*/i, "");
  }

  function renderPrincipi(data, root) {
    var p = data.macrociclo.profilo || {};
    var box = el("aside", { className: "ciclo-principi panel-raised" });
    box.appendChild(el("h3", { text: "Come è costruita la settimana" }));
    var ul = el("ul", { className: "ciclo-principi__list" });
    [
      "3 allenamenti: Lun AB (35%) · Mer AC (25%) · Sab CB (40%). Studente: mercoledì seduta corta.",
      "AB – AC / C–B: macro-zone A (spinta), C (tirata), B (gambe). Stessi esercizi per tutta la fase.",
      "Priorità parte alta ~70% delle serie. Gambe, glutei e polpacci: solo mantenimento (già sviluppati).",
      "Fase 1 (mesi 1–3): progressivo 45→55 min, RIR 3→1, focus tecnica. Dal mese 4: max 60 min.",
      "Ogni fase = 13 settimane. Settimana 13 = deload obbligatorio (−40% volume).",
      "Esercizi scelti ad hoc per Nicola — non copiati da altri atleti."
    ].forEach(function (t) {
      ul.appendChild(el("li", { text: t }));
    });
    box.appendChild(ul);
    box.appendChild(el("p", {
      className: "ciclo-principi__meta",
      text: (p.distribuzioneGiorni || "Lun 35% · Mer 25% · Sab 40%") +
        " · " + (p.prioritaVolume || "parte alta ~70%")
    }));
    root.appendChild(box);
  }

  function renderIr(fase) {
    var ir = fase.intensitaRecupero || {};
    var wrap = el("div", { className: "admin-fase__ir" });
    if (fase.perche) {
      wrap.appendChild(el("p", {
        className: "admin-fase__perche",
        html: "<strong>A cosa serve.</strong> " + fase.perche
      }));
    }
    if (ir.intensita) {
      wrap.appendChild(el("p", { html: "<strong>Intensità.</strong> " + ir.intensita }));
    }
    if (ir.recupero) {
      wrap.appendChild(el("p", { html: "<strong>Recupero.</strong> " + ir.recupero }));
    }
    wrap.appendChild(el("p", {
      className: "admin-fase__durata",
      text: (ir.durataSeduta || "45–60 min") + " · " + (ir.deload || "settimana 13 · −40% volume")
    }));
    return wrap;
  }

  function renderDashboard(data, root) {
    root.innerHTML = "";
    root.appendChild(el("h2", { id: "ciclo-title", text: "Ciclo dell'anno" }));
    root.appendChild(el("p", {
      className: "ciclo-lead",
      text: formatDate(data.macrociclo.inizio) + " → " + formatDate(data.macrociclo.fine) +
        " · 4 fasi × 13 settimane · Lun/Mer/Sab · parte alta ~70%"
    }));

    renderPrincipi(data, root);

    var timeline = el("div", { className: "admin-timeline" });
    data.fasi.forEach(function (fase, i) {
      var block = el("section", { className: "admin-fase panel-raised", id: fase.id });
      var head = el("div", { className: "admin-fase__head" });
      head.innerHTML =
        "<span class=\"admin-fase__num\">Fase " + (i + 1) + "</span>" +
        "<h3>" + fase.nome.replace(/^Fase \d+ · /, "") + "</h3>" +
        "<p class=\"admin-fase__dates\">" + formatDate(fase.inizio) + " – " + formatDate(fase.fine) +
        " · " + fase.settimane + " settimane</p>";
      block.appendChild(head);
      block.appendChild(renderIr(fase));

      var faseActions = el("div", { className: "admin-fase__actions" });
      faseActions.innerHTML =
        "<a class=\"btn btn-primary\" href=\"" + u("/admin/fase/pdf/?fase=" + encodeURIComponent(fase.id)) +
        "\" target=\"_blank\" rel=\"noopener\">PDF settimana (AB+AC+CB)</a>";
      if (fase.id === "ipertrofia-accumulo") {
        faseActions.innerHTML +=
          " <a class=\"btn btn-ghost\" href=\"" + u("/admin/metodo-blocco1/") + "\">Metodo Blocco 1</a>" +
          " <a class=\"btn btn-ghost\" href=\"" + u("/admin/metodo-blocco1/pdf/") + "\" target=\"_blank\" rel=\"noopener\">PDF metodo</a>";
      }
      block.appendChild(faseActions);

      var grid = el("div", { className: "admin-sessioni-grid admin-sessioni-grid--3" });
      SESSIONI.forEach(function (key) {
        var s = fase.sessioni[key];
        if (!s) return;
        var wrap = el("article", { className: "scheda-mini" });
        wrap.appendChild(el("span", { className: "scheda-mini__key", text: key.toUpperCase() }));
        wrap.appendChild(el("strong", { text: shortName(s) }));
        var meta = (s.giorno || "") + " · " + (s.quotaVolume || "") + " · " + s.esercizi.length + " esercizi";
        wrap.appendChild(el("p", { text: meta }));
        if (s.notaSeduta) wrap.appendChild(el("p", { className: "scheda-mini__nota", text: s.notaSeduta }));
        var actions = el("div", { className: "scheda-mini__actions" });
        actions.appendChild(el("a", {
          className: "btn btn-ghost",
          href: u("/admin/sessione/?ciclo=" + encodeURIComponent(fase.id) + "&sessione=" + key),
          text: "Apri scheda"
        }));
        actions.appendChild(el("a", {
          className: "btn btn-primary",
          href: u("/admin/sessione/pdf/?ciclo=" + encodeURIComponent(fase.id) + "&sessione=" + key),
          target: "_blank",
          rel: "noopener",
          text: "Scarica PDF"
        }));
        wrap.appendChild(actions);
        grid.appendChild(wrap);
      });
      block.appendChild(grid);
      timeline.appendChild(block);
    });
    root.appendChild(timeline);
  }

  function init() {
    var root = document.getElementById("admin-dashboard");
    if (!root) return;
    fetch(DATA_URL)
      .then(function (r) {
        if (!r.ok) throw new Error("JSON " + r.status);
        return r.json();
      })
      .then(function (data) { renderDashboard(data, root); })
      .catch(function (err) {
        root.innerHTML = "<p class=\"status error\">Errore: " + err.message + "</p>";
      });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
