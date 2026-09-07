/** Stampa scheda palestra — log minimo */
(function () {
  var printBtn = document.getElementById("scheda-print-btn");
  if (printBtn) {
    printBtn.addEventListener("click", function () {
      window.print();
    });
  }
})();
