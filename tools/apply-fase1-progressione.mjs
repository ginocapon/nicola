/**
 * Fase 1 — serie di partenza basse + progressione settimanale documentata.
 * La scheda stampata mostra il volume sett. 1–4; da sett. 5 si sale come indicato.
 */
import { readFileSync, writeFileSync } from "fs";

const path = "admin/data/macrociclo-2026-2027.json";
const data = JSON.parse(readFileSync(path, "utf8"));
const fase = data.fasi.find((f) => f.id === "ipertrofia-accumulo");

const bump = [
  // AB
  ["ab", "Panca piana bilanciere", 3, 4, 5],
  ["ab", "Trazioni presa neutra", 3, 3, null],
  ["ab", "Panca inclinata manubri 25°", 2, 3, 5],
  ["ab", "Alzate laterali manubri", 2, 3, 5],
  ["ab", "Face pull al cavo", 2, 2, null],
  ["ab", "Dip alle parallele", 2, 3, 5],
  ["ab", "Pushdown corda al cavo", 2, 2, null],
  ["ab", "Curl martello manubri", 2, 2, null],
  // AC
  ["ac", "Hack squat o pressa 45°", 2, 3, 5],
  ["ac", "Leg curl seduto", 2, 3, 5],
  ["ac", "Hip thrust macchina o bilanciere", 2, 3, 5],
  ["ac", "Leg extension leggero", 2, 2, null],
  ["ac", "Curl bilanciere EZ", 3, 3, null],
  // CB
  ["cb", "Rematore bilanciere prona", 3, 4, 5],
  ["cb", "Lat machine presa larga", 2, 3, 5],
  ["cb", "Panca piana manubri", 2, 3, 5],
  ["cb", "Arnold press manubri seduto", 2, 3, 5],
  ["cb", "Alzate posteriori manubri", 2, 3, 5],
  ["cb", "French press bilanciere EZ", 2, 3, 5],
  ["cb", "Curl inclinato manubri", 2, 3, 5],
  ["cb", "Croci ai cavi alti", 2, 2, null]
];

function sumSession(sessionKey) {
  return fase.sessioni[sessionKey].esercizi.reduce((a, e) => a + e.serie, 0);
}

bump.forEach(([sk, nome, start, full, fromWeek]) => {
  const ex = fase.sessioni[sk].esercizi.find((e) => e.nome === nome);
  if (!ex) throw new Error("Missing " + nome);
  ex.serie = start;
  ex.seriePieno = full;
  if (fromWeek && full > start) {
    ex.progressioneSerie = "da sett. " + fromWeek + ": " + full + " serie";
    ex.note = (ex.note || "").replace(/\s*Sett\. 1–4:.*$/, "");
    ex.note += (ex.note ? " " : "") + "Sett. 1–4: " + start + " serie · " + ex.progressioneSerie + ".";
  } else {
    delete ex.progressioneSerie;
    ex.note = (ex.note || "").replace(/\s*Sett\. 1–4:.*$/, "");
    if (nome.includes("Curl bilanciere")) {
      ex.note += " Bicipiti fissi 3×8 tutto il trimestre.";
    }
  }
});

const startTot = sumSession("ab") + sumSession("ac") + sumSession("cb");
let fullTot = 0;
["ab", "ac", "cb"].forEach((sk) => {
  fullTot += fase.sessioni[sk].esercizi.reduce((a, e) => a + (e.seriePieno || e.serie), 0);
});

fase.progressioneVolume = {
  titolo: "Progressione serie — Fase 1 (primo trimestre)",
  perche: "Nicola è giovane e studente: la scheda parte con volume ridotto (sett. 1–4) per non avere un carico recessivo. Le serie in tabella sono quelle iniziali; da sett. 5 si sale come indicato nelle note.",
  blocchi: [
    {
      settimane: "1–4",
      serieSettimanali: startTot,
      rir: "3–2",
      durata: "~45 min (Lun/Sab) · Mer ~30 min",
      azione: "Volume ridotto in scheda. Focus tecnica. Non inseguire PR."
    },
    {
      settimane: "5–8",
      serieSettimanali: fullTot,
      rir: "2",
      durata: "~50 min · Mer ~35 min",
      azione: "Aggiungi 1 serie dove indicato «da sett. 5» nelle note esercizio."
    },
    {
      settimane: "9",
      serieSettimanali: Math.round(fullTot * 0.75),
      rir: "2–3",
      durata: "~45 min",
      azione: "Micro scarico −25%: togli 1 serie dagli accessori (non dai fondamentali *)."
    },
    {
      settimane: "10–12",
      serieSettimanali: fullTot,
      rir: "1–2",
      durata: "~55 min · Mer ~38 min",
      azione: "Volume pieno fase. Picco controllato, niente cedimento."
    },
    {
      settimane: "13",
      serieSettimanali: Math.round(fullTot * 0.6),
      rir: "3+",
      durata: "~40 min",
      azione: "Deload obbligatorio −40% volume."
    }
  ],
  seriePienoPerSeduta: {
    ab: bump.filter((b) => b[0] === "ab").reduce((a, b) => a + b[3], 0),
    ac: bump.filter((b) => b[0] === "ac").reduce((a, b) => a + b[3], 0),
    cb: bump.filter((b) => b[0] === "cb").reduce((a, b) => a + b[3], 0)
  }
};

fase.obiettivo =
  "Imparare i fondamentali con volume progressivo: partenza leggera (sett. 1–4), salita graduale, picco sett. 10–12, deload 13.";
fase.sessioni.ab.notaSeduta =
  "Parte alta completa. Sett. 1–4: " + sumSession("ab") + " serie totali · pieno da sett. 5: " +
  fase.progressioneVolume.seriePienoPerSeduta.ab + " serie. Zero gambe.";
fase.sessioni.ac.notaSeduta =
  "Gambe generali + bicipiti 3×8. Sett. 1–4: " + sumSession("ac") + " serie · pieno: " +
  fase.progressioneVolume.seriePienoPerSeduta.ac + " serie. No polpacci. Seduta breve.";
fase.sessioni.cb.notaSeduta =
  "Parte alta completa weekend. Sett. 1–4: " + sumSession("cb") + " serie · pieno da sett. 5: " +
  fase.progressioneVolume.seriePienoPerSeduta.cb + " serie. Zero gambe.";

writeFileSync(path, JSON.stringify(data, null, 2) + "\n", "utf8");
console.log("Fase 1 — sett. 1-4:", startTot, "serie/sett · pieno:", fullTot);
