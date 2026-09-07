(function () {
  "use strict";
  if (localStorage.getItem("nicola-consent-v1")) return;
  var bar = document.createElement("div");
  bar.className = "cookie-bar no-print";
  bar.innerHTML =
    '<p>Questo sito non usa analytics. Solo preferenze locali. ' +
    '<a href="' + (window.fqUrl ? window.fqUrl("/trasparenza-ai/") : "/trasparenza-ai/") + '">Trasparenza AI</a></p>' +
    '<button type="button" id="cookie-ok">OK</button>';
  bar.style.cssText =
    "position:fixed;bottom:0;left:0;right:0;z-index:999;" +
    "background:#161616;border-top:1px solid rgba(201,120,58,0.4);" +
    "padding:0.75rem 1rem;display:flex;flex-wrap:wrap;gap:0.75rem;" +
    "align-items:center;justify-content:space-between;font-size:0.9rem;";
  document.body.appendChild(bar);
  document.getElementById("cookie-ok").addEventListener("click", function () {
    localStorage.setItem("nicola-consent-v1", "1");
    bar.remove();
  });
})();
