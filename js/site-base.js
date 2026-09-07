(function () {
  "use strict";
  var p = window.location.pathname || "";
  var i = p.indexOf("/admin/");
  var base = "";
  if (i > 0) base = p.slice(0, i);
  else if (/^\/nicola(\/|$)/i.test(p)) base = "/nicola";
  window.FQ_BASE = base;
  window.fqUrl = function (path) {
    if (!path) return base || "/";
    if (path.charAt(0) !== "/") path = "/" + path;
    return base + path;
  };
})();
