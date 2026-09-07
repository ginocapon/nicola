/**
 * Rigenera sessioni AB/AC/CB con split:
 * Lun 35% parte alta completa · Mer 25% gambe (no polpacci) + bicipiti 3×8 · Sab 40% parte alta completa
 */
import { readFileSync, writeFileSync } from "fs";

const path = "admin/data/macrociclo-2026-2027.json";
const data = JSON.parse(readFileSync(path, "utf8"));

const upperA = {
  f1: [
    { nome: "Panca piana bilanciere", gruppo: "Petto", serie: 4, ripetizioni: "8–10", peso: "—", recupero: "150 sec", rir: "3→2", progressione: true, note: "Fondamentale *. Petto piatto — apre la settimana parte alta." },
    { nome: "Trazioni presa neutra", gruppo: "Dorsali", serie: 3, ripetizioni: "6–8", peso: "—", recupero: "150 sec", rir: "3→2", progressione: true, note: "Fondamentale *. Tirata verticale. Elastico se serve — rep pulite." },
    { nome: "Panca inclinata manubri 25°", gruppo: "Petto alto", serie: 3, ripetizioni: "8–10", peso: "—", recupero: "120 sec", rir: "2", progressione: false, note: "Angolo basso, focus petto alto." },
    { nome: "Alzate laterali manubri", gruppo: "Deltoide laterale", serie: 3, ripetizioni: "12–15", peso: "—", recupero: "60 sec", rir: "2", progressione: false, note: "Spalle laterali." },
    { nome: "Face pull al cavo", gruppo: "Deltoide posteriore", serie: 2, ripetizioni: "15–20", peso: "—", recupero: "60 sec", rir: "2", progressione: false, note: "Posteriori spalla — equilibrio petto/schiena." },
    { nome: "Dip alle parallele", gruppo: "Petto / tricipiti", serie: 3, ripetizioni: "6–10", peso: "—", recupero: "120 sec", rir: "2", progressione: false, note: "Chiusura spinta. Leggera inclinazione busto per il petto." },
    { nome: "Pushdown corda al cavo", gruppo: "Tricipiti", serie: 2, ripetizioni: "12–15", peso: "—", recupero: "60 sec", rir: "2", progressione: false, note: "Tricipiti." },
    { nome: "Curl martello manubri", gruppo: "Bicipiti / brachiale", serie: 2, ripetizioni: "10–12", peso: "—", recupero: "60 sec", rir: "2", progressione: false, note: "Richiamo bicipiti (focus 3×8 mercoledì)." }
  ],
  f2: [
    { nome: "Panca piana bilanciere", gruppo: "Petto", serie: 4, ripetizioni: "6–8", peso: "—", recupero: "180 sec", rir: "1–2", progressione: true, note: "Progressione carico." },
    { nome: "Trazioni presa neutra", gruppo: "Dorsali", serie: 3, ripetizioni: "4–6", peso: "—", recupero: "180 sec", rir: "1–2", progressione: true, note: "Forza tirata." },
    { nome: "Panca inclinata manubri 25°", gruppo: "Petto alto", serie: 3, ripetizioni: "6–8", peso: "—", recupero: "120 sec", rir: "1–2", progressione: false, note: "Petto alto." },
    { nome: "Alzate laterali manubri", gruppo: "Deltoide laterale", serie: 3, ripetizioni: "10–12", peso: "—", recupero: "60 sec", rir: "1–2", progressione: false, note: "Spalle." },
    { nome: "Face pull al cavo", gruppo: "Deltoide posteriore", serie: 2, ripetizioni: "12–15", peso: "—", recupero: "60 sec", rir: "1–2", progressione: false, note: "Posteriori." },
    { nome: "Dip alle parallele", gruppo: "Petto / tricipiti", serie: 3, ripetizioni: "5–8", peso: "—", recupero: "120 sec", rir: "1–2", progressione: false, note: "Zavorra leggera se 8+ rep pulite." },
    { nome: "Pushdown corda al cavo", gruppo: "Tricipiti", serie: 2, ripetizioni: "10–12", peso: "—", recupero: "60 sec", rir: "1–2", progressione: false, note: "Tricipiti." },
    { nome: "Curl martello manubri", gruppo: "Bicipiti", serie: 2, ripetizioni: "8–10", peso: "—", recupero: "60 sec", rir: "1–2", progressione: false, note: "Bicipiti." }
  ],
  f3: [
    { nome: "Panca piana bilanciere", gruppo: "Petto", serie: 4, ripetizioni: "8–10", peso: "—", recupero: "150 sec", rir: "1–2", progressione: true, note: "Volume ipertrofico." },
    { nome: "Trazioni presa neutra", gruppo: "Dorsali", serie: 4, ripetizioni: "6–8", peso: "—", recupero: "150 sec", rir: "1–2", progressione: true, note: "+1 serie dorsali." },
    { nome: "Panca inclinata manubri 25°", gruppo: "Petto alto", serie: 3, ripetizioni: "8–10", peso: "—", recupero: "120 sec", rir: "1–2", progressione: false, note: "Petto alto." },
    { nome: "Alzate laterali manubri", gruppo: "Deltoide laterale", serie: 3, ripetizioni: "12–15", peso: "—", recupero: "60 sec", rir: "1", progressione: false, note: "Spalle." },
    { nome: "Face pull al cavo", gruppo: "Deltoide posteriore", serie: 3, ripetizioni: "15", peso: "—", recupero: "60 sec", rir: "1", progressione: false, note: "+1 serie." },
    { nome: "Dip alle parallele", gruppo: "Petto / tricipiti", serie: 3, ripetizioni: "8–10", peso: "—", recupero: "120 sec", rir: "1–2", progressione: false, note: "Dip." },
    { nome: "Pushdown corda al cavo", gruppo: "Tricipiti", serie: 3, ripetizioni: "12–15", peso: "—", recupero: "60 sec", rir: "1", progressione: false, note: "+1 serie tricipiti." },
    { nome: "Curl martello manubri", gruppo: "Bicipiti", serie: 2, ripetizioni: "10–12", peso: "—", recupero: "60 sec", rir: "1", progressione: false, note: "Bicipiti." }
  ],
  f4: [
    { nome: "Panca piana bilanciere", gruppo: "Petto", serie: 3, ripetizioni: "10–12", peso: "—", recupero: "120 sec", rir: "2–3", progressione: false, note: "Moderato, niente cedimento." },
    { nome: "Trazioni presa neutra", gruppo: "Dorsali", serie: 3, ripetizioni: "8–10", peso: "—", recupero: "120 sec", rir: "2–3", progressione: false, note: "Moderato." },
    { nome: "Panca inclinata manubri 25°", gruppo: "Petto alto", serie: 3, ripetizioni: "10–12", peso: "—", recupero: "120 sec", rir: "2–3", progressione: false, note: "Petto alto." },
    { nome: "Alzate laterali manubri", gruppo: "Deltoide laterale", serie: 3, ripetizioni: "15", peso: "—", recupero: "60 sec", rir: "2", progressione: false, note: "Spalle." },
    { nome: "Face pull al cavo", gruppo: "Deltoide posteriore", serie: 2, ripetizioni: "15", peso: "—", recupero: "60 sec", rir: "2", progressione: false, note: "Posteriori." },
    { nome: "Dip alle parallele", gruppo: "Petto / tricipiti", serie: 2, ripetizioni: "10–12", peso: "—", recupero: "90 sec", rir: "2–3", progressione: false, note: "Corpo libero o assistiti." },
    { nome: "Pushdown corda al cavo", gruppo: "Tricipiti", serie: 2, ripetizioni: "15", peso: "—", recupero: "60 sec", rir: "2", progressione: false, note: "Tricipiti." },
    { nome: "Curl martello manubri", gruppo: "Bicipiti", serie: 2, ripetizioni: "12", peso: "—", recupero: "60 sec", rir: "2", progressione: false, note: "Bicipiti." }
  ]
};

const legsWed = {
  f1: [
    { nome: "Hack squat o pressa 45°", gruppo: "Quadricipiti", serie: 3, ripetizioni: "10–12", peso: "—", recupero: "120 sec", rir: "3", progressione: false, note: "Richiamo gambe — quad. ROM completo, niente cedimento." },
    { nome: "Leg curl seduto", gruppo: "Femorali", serie: 3, ripetizioni: "10–12", peso: "—", recupero: "90 sec", rir: "3", progressione: false, note: "Femorali — mantenimento." },
    { nome: "Hip thrust macchina o bilanciere", gruppo: "Glutei", serie: 3, ripetizioni: "10–12", peso: "—", recupero: "90 sec", rir: "3", progressione: false, note: "Glutei — richiamo generale. Già sviluppati: stimolo, non crescita." },
    { nome: "Leg extension leggero", gruppo: "Quadricipiti", serie: 2, ripetizioni: "12–15", peso: "—", recupero: "75 sec", rir: "3", progressione: false, note: "Finisher quad — carico moderato." },
    { nome: "Curl bilanciere EZ", gruppo: "Bicipiti", serie: 3, ripetizioni: "8", peso: "—", recupero: "75 sec", rir: "2", progressione: false, note: "3×8 bicipiti fissi — unica parte alta del mercoledì. Gomiti fermi, no slancio." }
  ],
  f2: [
    { nome: "Hack squat o pressa 45°", gruppo: "Quadricipiti", serie: 3, ripetizioni: "8–10", peso: "—", recupero: "120 sec", rir: "2", progressione: false, note: "Richiamo quad." },
    { nome: "Leg curl seduto", gruppo: "Femorali", serie: 3, ripetizioni: "8–10", peso: "—", recupero: "90 sec", rir: "2", progressione: false, note: "Femorali." },
    { nome: "Hip thrust macchina o bilanciere", gruppo: "Glutei", serie: 3, ripetizioni: "8–10", peso: "—", recupero: "90 sec", rir: "2", progressione: false, note: "Glutei." },
    { nome: "Leg extension leggero", gruppo: "Quadricipiti", serie: 2, ripetizioni: "10–12", peso: "—", recupero: "75 sec", rir: "2", progressione: false, note: "Quad." },
    { nome: "Curl bilanciere EZ", gruppo: "Bicipiti", serie: 3, ripetizioni: "8", peso: "—", recupero: "75 sec", rir: "1–2", progressione: false, note: "3×8 bicipiti — carico progressivo se la forma resta pulita." }
  ],
  f3: [
    { nome: "Hack squat o pressa 45°", gruppo: "Quadricipiti", serie: 3, ripetizioni: "10–12", peso: "—", recupero: "120 sec", rir: "2", progressione: false, note: "Richiamo quad." },
    { nome: "Leg curl seduto", gruppo: "Femorali", serie: 3, ripetizioni: "10–12", peso: "—", recupero: "90 sec", rir: "2", progressione: false, note: "Femorali." },
    { nome: "Hip thrust macchina o bilanciere", gruppo: "Glutei", serie: 3, ripetizioni: "10–12", peso: "—", recupero: "90 sec", rir: "2", progressione: false, note: "Glutei." },
    { nome: "Leg extension leggero", gruppo: "Quadricipiti", serie: 2, ripetizioni: "12–15", peso: "—", recupero: "75 sec", rir: "2", progressione: false, note: "Quad." },
    { nome: "Curl bilanciere EZ", gruppo: "Bicipiti", serie: 3, ripetizioni: "8", peso: "—", recupero: "75 sec", rir: "1–2", progressione: false, note: "3×8 bicipiti." }
  ],
  f4: [
    { nome: "Hack squat o pressa 45°", gruppo: "Quadricipiti", serie: 3, ripetizioni: "12", peso: "—", recupero: "120 sec", rir: "3", progressione: false, note: "Gambe leggere." },
    { nome: "Leg curl seduto", gruppo: "Femorali", serie: 3, ripetizioni: "12", peso: "—", recupero: "90 sec", rir: "3", progressione: false, note: "Femorali." },
    { nome: "Hip thrust macchina o bilanciere", gruppo: "Glutei", serie: 2, ripetizioni: "12", peso: "—", recupero: "90 sec", rir: "3", progressione: false, note: "Glutei." },
    { nome: "Leg extension leggero", gruppo: "Quadricipiti", serie: 2, ripetizioni: "15", peso: "—", recupero: "75 sec", rir: "3", progressione: false, note: "Quad." },
    { nome: "Curl bilanciere EZ", gruppo: "Bicipiti", serie: 3, ripetizioni: "8", peso: "—", recupero: "75 sec", rir: "2", progressione: false, note: "3×8 bicipiti — seduta breve post-lezioni." }
  ]
};

const upperB = {
  f1: [
    { nome: "Rematore bilanciere prona", gruppo: "Dorsali", serie: 4, ripetizioni: "6–8", peso: "—", recupero: "150 sec", rir: "2→1", progressione: true, note: "Fondamentale *. Schiena — seduta principale del sabato." },
    { nome: "Lat machine presa larga", gruppo: "Dorsali", serie: 3, ripetizioni: "10–12", peso: "—", recupero: "120 sec", rir: "2", progressione: false, note: "Tirata verticale — completa il lavoro dorsali." },
    { nome: "Panca piana manubri", gruppo: "Petto", serie: 3, ripetizioni: "8–10", peso: "—", recupero: "120 sec", rir: "2", progressione: false, note: "Petto — variante rispetto al lunedì col bilanciere." },
    { nome: "Arnold press manubri seduto", gruppo: "Deltoide", serie: 3, ripetizioni: "8–10", peso: "—", recupero: "120 sec", rir: "2", progressione: false, note: "Spalle complete — anteriori e laterali." },
    { nome: "Alzate posteriori manubri", gruppo: "Deltoide posteriore", serie: 3, ripetizioni: "12–15", peso: "—", recupero: "60 sec", rir: "2", progressione: false, note: "Posteriori spalla — bilancia il volume spinta." },
    { nome: "French press bilanciere EZ", gruppo: "Tricipiti", serie: 3, ripetizioni: "10–12", peso: "—", recupero: "75 sec", rir: "2", progressione: false, note: "Tricipiti." },
    { nome: "Curl inclinato manubri", gruppo: "Bicipiti", serie: 3, ripetizioni: "10–12", peso: "—", recupero: "60 sec", rir: "2", progressione: false, note: "Bicipiti — complemento al martello del lunedì." },
    { nome: "Croci ai cavi alti", gruppo: "Petto", serie: 2, ripetizioni: "12–15", peso: "—", recupero: "60 sec", rir: "2", progressione: false, note: "Finisher petto — pump controllato." }
  ],
  f2: [
    { nome: "Rematore bilanciere prona", gruppo: "Dorsali", serie: 4, ripetizioni: "4–6", peso: "—", recupero: "180 sec", rir: "1–2", progressione: true, note: "Progressione principale fase 2." },
    { nome: "Lat machine presa larga", gruppo: "Dorsali", serie: 3, ripetizioni: "8–10", peso: "—", recupero: "120 sec", rir: "1–2", progressione: false, note: "Dorsali." },
    { nome: "Panca piana manubri", gruppo: "Petto", serie: 3, ripetizioni: "6–8", peso: "—", recupero: "120 sec", rir: "1–2", progressione: false, note: "Petto." },
    { nome: "Arnold press manubri seduto", gruppo: "Deltoide", serie: 3, ripetizioni: "6–8", peso: "—", recupero: "120 sec", rir: "1–2", progressione: false, note: "Spalle." },
    { nome: "Alzate posteriori manubri", gruppo: "Deltoide posteriore", serie: 3, ripetizioni: "10–12", peso: "—", recupero: "60 sec", rir: "1–2", progressione: false, note: "Posteriori." },
    { nome: "French press bilanciere EZ", gruppo: "Tricipiti", serie: 3, ripetizioni: "8–10", peso: "—", recupero: "75 sec", rir: "1–2", progressione: false, note: "Tricipiti." },
    { nome: "Curl inclinato manubri", gruppo: "Bicipiti", serie: 3, ripetizioni: "8–10", peso: "—", recupero: "60 sec", rir: "1–2", progressione: false, note: "Bicipiti." },
    { nome: "Croci ai cavi alti", gruppo: "Petto", serie: 2, ripetizioni: "10–12", peso: "—", recupero: "60 sec", rir: "1–2", progressione: false, note: "Petto." }
  ],
  f3: [
    { nome: "Rematore bilanciere prona", gruppo: "Dorsali", serie: 4, ripetizioni: "8–10", peso: "—", recupero: "150 sec", rir: "1–2", progressione: true, note: "Volume schiena." },
    { nome: "Lat machine presa larga", gruppo: "Dorsali", serie: 3, ripetizioni: "10–12", peso: "—", recupero: "120 sec", rir: "1–2", progressione: false, note: "Dorsali." },
    { nome: "Panca piana manubri", gruppo: "Petto", serie: 4, ripetizioni: "8–10", peso: "—", recupero: "120 sec", rir: "1–2", progressione: false, note: "+1 serie petto." },
    { nome: "Arnold press manubri seduto", gruppo: "Deltoide", serie: 3, ripetizioni: "8–10", peso: "—", recupero: "120 sec", rir: "1–2", progressione: false, note: "Spalle." },
    { nome: "Alzate posteriori manubri", gruppo: "Deltoide posteriore", serie: 3, ripetizioni: "12–15", peso: "—", recupero: "60 sec", rir: "1", progressione: false, note: "Posteriori." },
    { nome: "French press bilanciere EZ", gruppo: "Tricipiti", serie: 3, ripetizioni: "10–12", peso: "—", recupero: "75 sec", rir: "1", progressione: false, note: "Tricipiti." },
    { nome: "Curl inclinato manubri", gruppo: "Bicipiti", serie: 3, ripetizioni: "10–12", peso: "—", recupero: "60 sec", rir: "1", progressione: false, note: "Bicipiti." },
    { nome: "Croci ai cavi alti", gruppo: "Petto", serie: 3, ripetizioni: "12–15", peso: "—", recupero: "60 sec", rir: "1", progressione: false, note: "+1 serie finisher petto." }
  ],
  f4: [
    { nome: "Rematore bilanciere prona", gruppo: "Dorsali", serie: 3, ripetizioni: "10–12", peso: "—", recupero: "120 sec", rir: "2–3", progressione: false, note: "Moderato." },
    { nome: "Lat machine presa larga", gruppo: "Dorsali", serie: 3, ripetizioni: "10–12", peso: "—", recupero: "120 sec", rir: "2–3", progressione: false, note: "Dorsali." },
    { nome: "Panca piana manubri", gruppo: "Petto", serie: 3, ripetizioni: "10–12", peso: "—", recupero: "120 sec", rir: "2–3", progressione: false, note: "Petto." },
    { nome: "Arnold press manubri seduto", gruppo: "Deltoide", serie: 2, ripetizioni: "10", peso: "—", recupero: "90 sec", rir: "2–3", progressione: false, note: "Spalle." },
    { nome: "Alzate posteriori manubri", gruppo: "Deltoide posteriore", serie: 2, ripetizioni: "15", peso: "—", recupero: "60 sec", rir: "2", progressione: false, note: "Posteriori." },
    { nome: "French press bilanciere EZ", gruppo: "Tricipiti", serie: 2, ripetizioni: "12", peso: "—", recupero: "75 sec", rir: "2", progressione: false, note: "Tricipiti." },
    { nome: "Curl inclinato manubri", gruppo: "Bicipiti", serie: 2, ripetizioni: "12", peso: "—", recupero: "60 sec", rir: "2", progressione: false, note: "Bicipiti." },
    { nome: "Croci ai cavi alti", gruppo: "Petto", serie: 2, ripetizioni: "15", peso: "—", recupero: "60 sec", rir: "2", progressione: false, note: "Petto." }
  ]
};

const phaseKey = ["f1", "f2", "f3", "f4"];
const phaseIds = ["ipertrofia-accumulo", "tensione-forza", "ipertrofia-ii", "ricondizionamento"];

const sessionMeta = {
  f1: {
    ab: { nota: "Parte alta completa: petto, schiena, spalle, braccia. Zero gambe. Target 48–52 min.", durata: { obiettivo: 50, tetto: 55 } },
    ac: { nota: "Seduta breve post-lezioni: richiamo gambe generali (quad, femorali, glutei). Nessun polpaccio. Bicipiti 3×8 fissi.", durata: { obiettivo: 35, tetto: 42 } },
    cb: { nota: "Parte alta completa del weekend — volume maggiore (40%). Tutti i distretti del busto, zero gambe.", durata: { obiettivo: 52, tetto: 58 } }
  },
  f2: {
    ab: { nota: "Parte alta completa — fase forza. Stessi movimenti, rep più basse sui *.", durata: { obiettivo: 55, tetto: 60 } },
    ac: { nota: "Gambe richiamo + bicipiti 3×8. Max 40 min.", durata: { obiettivo: 38, tetto: 42 } },
    cb: { nota: "Parte alta completa — seduta principale settimana. Max 60 min.", durata: { obiettivo: 58, tetto: 60 } }
  },
  f3: {
    ab: { nota: "Volume ipertrofico parte alta. Gambe solo mercoledì.", durata: { obiettivo: 58, tetto: 60 } },
    ac: { nota: "Gambe + bicipiti 3×8. Seduta compatta.", durata: { obiettivo: 40, tetto: 45 } },
    cb: { nota: "Volume massimo busto — 40% settimana.", durata: { obiettivo: 60, tetto: 60 } }
  },
  f4: {
    ab: { nota: "Parte alta moderata — chiudere l'anno integri.", durata: { obiettivo: 48, tetto: 55 } },
    ac: { nota: "Gambe leggere + bicipiti 3×8. Breve.", durata: { obiettivo: 35, tetto: 40 } },
    cb: { nota: "Parte alta completa senza spingere al limite.", durata: { obiettivo: 52, tetto: 55 } }
  }
};

data.macrociclo.descrizione =
  "Ciclo annuale Nicola: 4 fasi × 13 settimane, 3 sedute/settimana. Lun e Sab parte alta completa (35% + 40%). Mer gambe generali (no polpacci) + bicipiti 3×8. Deload sett. 13.";
data.macrociclo.lineeGuida =
  "4 fasi × 13 sett. · Lun AB parte alta 35% · Mer AC gambe + bicipiti 3×8 · Sab CB parte alta 40% · ~75% serie busto · No polpacci · Deload sett. 13";
data.macrociclo.profilo.obiettivoAnno =
  "Sviluppare parte alta (petto, schiena, spalle, braccia). Gambe solo richiamo mercoledì — polpacci esclusi.";
data.macrociclo.profilo.prioritaVolume = "parte alta ~75% · gambe richiamo mercoledì";
data.macrociclo.profilo.distribuzioneGiorni = "Lun 35% parte alta · Mer 25% gambe + bicipiti · Sab 40% parte alta";
data.macrociclo.profilo.split = "Lun/Sab parte alta · Mer gambe + bicipiti 3×8";

data.fasi.forEach((fase, i) => {
  const k = phaseKey[i];
  fase.intensitaRecupero.split = "Lun AB 35% parte alta · Mer AC gambe + bicipiti · Sab CB 40% parte alta";
  fase.sessioni.ab = {
    nome: "AB · Parte alta completa A",
    codice: "AB",
    giorno: "Lunedì",
    quotaVolume: "35%",
    accoppiamento: "Petto · schiena · spalle · braccia",
    notaSeduta: sessionMeta[k].ab.nota,
    durataMinuti: sessionMeta[k].ab.durata,
    esercizi: upperA[k]
  };
  fase.sessioni.ac = {
    nome: "AC · Gambe + bicipiti",
    codice: "AC",
    giorno: "Mercoledì",
    quotaVolume: "25%",
    accoppiamento: "Gambe generali · bicipiti 3×8",
    notaSeduta: sessionMeta[k].ac.nota,
    durataMinuti: sessionMeta[k].ac.durata,
    esercizi: legsWed[k]
  };
  fase.sessioni.cb = {
    nome: "CB · Parte alta completa B",
    codice: "CB",
    giorno: "Sabato",
    quotaVolume: "40%",
    accoppiamento: "Petto · schiena · spalle · braccia",
    notaSeduta: sessionMeta[k].cb.nota,
    durataMinuti: sessionMeta[k].cb.durata,
    esercizi: upperB[k]
  };
});

writeFileSync(path, JSON.stringify(data, null, 2) + "\n", "utf8");
console.log("OK — sessioni aggiornate per", phaseIds.join(", "));
