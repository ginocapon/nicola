/* Sito Nicola - shell comune: menu a schermo intero, barra mobile, marchio Foto AI.
   Percorsi relativi alla base del sito (tag <base> impostato nella pagina). */
(function () {
  "use strict";
  var body = document.body;
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.querySelector(".site-nav");
  var mobileMq = window.matchMedia("(max-width: 900px)");
  var path = location.pathname;
  var base = window.FQ_BASE || window.ND_BASE || "";
  var rel = base && path.indexOf(base) === 0 ? path.slice(base.length) : path;
  rel = rel.replace(/index\.html$/, "");
  if (rel.charAt(0) !== "/") rel = "/" + rel;

  var isAdmin = rel.indexOf("/admin") === 0;
  if (!isAdmin) body.classList.add("site-shell");

  var ITEMS = [
    { href: "./", label: "Home", num: "[01]", icon: "../img/icon-sessioni.svg", cur: rel === "/" },
    { href: "chi-sono/", label: "Chi sono", num: "[02]", icon: "../img/icon-diario.svg", cur: rel.indexOf("/chi-sono") === 0 },
    { href: "diario/", label: "Diario", num: "[03]", icon: "../img/icon-diario.svg", cur: rel.indexOf("/diario") === 0 },
    { href: "allenamenti/", label: "Allenamenti", num: "[04]", icon: "../img/icon-allenamenti.svg", cur: rel.indexOf("/allenamenti") === 0 || rel.indexOf("/sessioni") === 0 },
    { href: "schede/", label: "Schede", num: "[05]", icon: "../img/icon-schede.svg", cur: rel.indexOf("/schede") === 0 || rel.indexOf("/admin") === 0 }
  ];

  var ul = nav && nav.querySelector("ul");
  if (ul && !isAdmin) {
    ul.innerHTML = "";
    ITEMS.forEach(function (it) {
      var li = document.createElement("li");
      var a = document.createElement("a");
      a.href = it.href; a.textContent = it.label;
      if (it.cur) a.setAttribute("aria-current", "page");
      li.appendChild(a); ul.appendChild(li);
    });
  }

  document.querySelectorAll("img[data-ai]").forEach(function (img) {
    if (img.closest(".ai-photo-wrap")) return;
    var wrap = document.createElement("span");
    wrap.className = "ai-photo-wrap";
    var mark = document.createElement("span");
    mark.className = "ai-photo-mark";
    mark.setAttribute("aria-hidden", "true");
    mark.textContent = "Foto AI";
    var parent = img.parentNode;
    parent.insertBefore(wrap, img);
    wrap.appendChild(img);
    wrap.appendChild(mark);
  });

  if (toggle && !isAdmin) initOverlayMenu(toggle, mobileMq);

  function initOverlayMenu(openBtn, mq) {
    if (document.getElementById("fq-overlay")) return;
    var dim = document.createElement("div");
    dim.className = "fq-overlay-dim"; dim.id = "fq-overlay-dim"; dim.setAttribute("aria-hidden", "true");
    var overlay = document.createElement("div");
    overlay.className = "fq-overlay"; overlay.id = "fq-overlay";
    overlay.setAttribute("role", "dialog"); overlay.setAttribute("aria-modal", "true");
    overlay.setAttribute("aria-label", "Menu"); overlay.setAttribute("aria-hidden", "true");
    var cells = ITEMS.map(function (it) {
      var cur = it.cur ? ' aria-current="page"' : "";
      return '<a href="' + it.href + '"' + cur + ' style="--fq-cell-photo:url(\'' + it.icon + '\')">' +
        '<span class="fq-overlay-shade" aria-hidden="true"></span>' +
        '<span class="fq-overlay-num">' + it.num + '</span>' +
        '<span class="fq-overlay-label">' + it.label + '</span></a>';
    }).join("");
    overlay.innerHTML =
      '<div class="fq-overlay-bar">' +
        '<a class="fq-overlay-bar__brand" href="./"><span class="fq-overlay-mark" aria-hidden="true"></span> Nicola</a>' +
        '<button class="fq-overlay-close" type="button" id="fq-close-menu">Chiudi <span aria-hidden="true">\u00d7</span></button>' +
      '</div>' +
      '<nav class="fq-overlay-nav" aria-label="Sezioni">' + cells + '</nav>' +
      '<div class="fq-overlay-foot"><p>Forza, settimana dopo settimana</p></div>';
    document.body.appendChild(dim);
    document.body.appendChild(overlay);
    openBtn.setAttribute("aria-controls", "fq-overlay");
    if (!openBtn.querySelector(".fq-menu-dots")) {
      openBtn.innerHTML = 'Menu <span class="fq-menu-dots" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i></span>';
    }
    var closeBtn = document.getElementById("fq-close-menu");
    var menuOpen = false, peekAcc = 0, lastTouchY = null, lastFocus = null;
    var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    function scrollPage(dy) { window.scrollBy(0, dy); }
    function openMenu() {
      menuOpen = true; peekAcc = 0; lastFocus = document.activeElement;
      document.body.classList.add("fq-menu-open"); document.body.classList.remove("is-peeking");
      dim.setAttribute("aria-hidden", "false"); overlay.setAttribute("aria-hidden", "false");
      dim.classList.add("is-open"); overlay.classList.add("is-open");
      openBtn.setAttribute("aria-expanded", "true");
      if (closeBtn) closeBtn.focus();
    }
    function closeMenu() {
      menuOpen = false; peekAcc = 0;
      document.body.classList.remove("fq-menu-open"); document.body.classList.remove("is-peeking");
      dim.classList.remove("is-open"); overlay.classList.remove("is-open");
      dim.setAttribute("aria-hidden", "true"); overlay.setAttribute("aria-hidden", "true");
      openBtn.setAttribute("aria-expanded", "false");
      if (lastFocus && lastFocus.focus) lastFocus.focus();
    }
    function onPeekDelta(dy) {
      if (reduce) return;
      peekAcc += Math.abs(dy);
      if (peekAcc > 48) document.body.classList.add("is-peeking");
    }
    openBtn.addEventListener("click", function (e) { e.preventDefault(); if (menuOpen) closeMenu(); else openMenu(); });
    if (closeBtn) closeBtn.addEventListener("click", closeMenu);
    dim.addEventListener("click", closeMenu);
    document.addEventListener("keydown", function (e) {
      if (!menuOpen) return;
      if (e.key === "Escape") { e.preventDefault(); closeMenu(); return; }
      if (e.key !== "Tab") return;
      var f = overlay.querySelectorAll("a[href], button");
      if (!f.length) return;
      var first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    });
    function onWheel(e) { if (!menuOpen) return; e.preventDefault(); scrollPage(e.deltaY); onPeekDelta(e.deltaY); }
    overlay.addEventListener("wheel", onWheel, { passive: false });
    dim.addEventListener("wheel", onWheel, { passive: false });
    overlay.addEventListener("touchstart", function (e) { if (e.touches[0]) lastTouchY = e.touches[0].clientY; }, { passive: true });
    overlay.addEventListener("touchmove", function (e) {
      if (!menuOpen || lastTouchY == null || !e.touches[0]) return;
      var y = e.touches[0].clientY, dy = lastTouchY - y; lastTouchY = y;
      e.preventDefault(); scrollPage(dy); onPeekDelta(dy);
    }, { passive: false });
    mq.addEventListener("change", function () { if (menuOpen) closeMenu(); });
  }

  /* Barra mobile: Indietro, Sezione, Menu (pagine interne) */
  if (isAdmin || rel === "/" || rel === "") return;
  if (document.querySelector(".fq-backbar")) return;
  function parentOf(p) {
    var parts = p.split("/").filter(Boolean); parts.pop();
    return parts.length ? parts.join("/") + "/" : "";
  }
  var labels = { "diario/": "Diario", "allenamenti/": "Allenamenti", "sessioni/": "Sessioni", "schede/": "Schede" };
  var up = parentOf(rel);
  var upLabel = labels[up] || (up === "" ? "Home" : "Su");
  var bar = document.createElement("nav");
  bar.className = "fq-backbar no-print";
  bar.setAttribute("aria-label", "Navigazione rapida");
  var back = document.createElement("button");
  back.type = "button"; back.innerHTML = '<span aria-hidden="true">\u2190</span> Indietro';
  back.addEventListener("click", function () {
    var same = document.referrer && document.referrer.indexOf(location.origin) === 0;
    if (same && history.length > 1) history.back(); else location.href = (up || "./");
  });
  bar.appendChild(back);
  var upLink = document.createElement("a");
  upLink.href = up || "./"; upLink.innerHTML = '<span aria-hidden="true">\u2191</span> ' + upLabel;
  bar.appendChild(upLink);
  var menu = document.createElement("button");
  menu.type = "button"; menu.innerHTML = '<span aria-hidden="true">\u2630</span> Menu';
  menu.addEventListener("click", function () { var t = document.querySelector(".nav-toggle"); if (t) t.click(); });
  bar.appendChild(menu);
  document.body.appendChild(bar);
})();
