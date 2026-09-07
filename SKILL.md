# SKILL — Nicola · Macrociclo 2026–2027

> **Questo repo** è il ciclo annuale di **Nicola** (bodybuilder giovane, studente). Default: `/`. Non inventare dati clinici se non forniti.

---

## 1. Chi è e cosa non si inventa

| Campo | Valore |
|-------|--------|
| Nome in pagina | Nicola |
| Nome in PDF stampa | **vuoto** (`Atleta: _______________`) |
| Altezza | 176 cm |
| Peso | 73 kg |
| Torace | 83 cm |
| Braccio | 30 cm |
| Età / infortuni / anni palestra | solo se forniti |
| Punto di forza | Gambe, glutei, polpacci già molto sviluppati |
| Obiettivo | Parte alta ~70% del volume |

Riferimento estetico: immagine illustrativa AI in `admin/img/nicola/riferimento-estetico.webp` — etichetta «Foto AI» obbligatoria.

---

## 2. Gerarchia (non si cambia)

```
MACROCICLO  ≈ 52 settimane
  MESOCICLO = 1 fase ≈ 13 settimane (4 fasi)
    MICROCICLO = 1 settimana = 3 sedute AB · AC · CB
```

- **4 fasi × 13 settimane.** Deload = **settimana 13 (−40% volume)**.
- Stessi esercizi per tutta la fase. Cambiano serie, rep, RIR, recupero.
- **Esercizi scelti ad hoc per Nicola** — non copiare liste da Michele o altri atleti.

---

## 3. Settimana: 3 sedute, distribuzione volume

| Giorno | Scheda | Quota | Contenuto |
|--------|--------|-------|-----------|
| **Lunedì** | AB | 35% | **Parte alta completa** — petto, schiena, spalle, braccia (zero gambe) |
| **Mercoledì** | AC | 25% | **Gambe generali** (quad, femorali, glutei) — **no polpacci** — + **bicipiti 3×8** |
| **Sabato** | CB | 40% | **Parte alta completa** — tutti i distretti del busto (zero gambe) |

**Priorità volume:** ~**75% serie sul busto**. Gambe solo richiamo mercoledì. **Polpacci esclusi** (già molto sviluppati).

Lun e Sab coprono insieme tutti i muscoli della parte alta con esercizi complementari. Mer resta la seduta più breve (studente).

---

## 4. Durata seduta

| Periodo | Durata |
|---------|--------|
| Fase 1, sett. 1–4 | ~45 min |
| Fase 1, sett. 5–8 | ~50 min |
| Fase 1, sett. 9–12 | ~55 min |
| **Dal mese 4 (fase 2+)** | **max 60 min** |

Studente: mercoledì deve restare la seduta più breve.

---

## 5. Le 4 fasi

### Fase 1 · Ipertrofia + tecnica (set–dic)
Costruire tessuto e imparare i fondamentali del busto. RIR 3→1. Non inseguire PR.

### Fase 2 · Tensione + forza (dic–mar)
Stessi esercizi, 4–8 rep sui *, max 60 min.

### Fase 3 · Ipertrofia II (mar–giu)
8–12 rep, volume pieno sul busto. Deload 13.

### Fase 4 · Ricondizionamento (giu–ago)
RIR 2–3, niente cedimento. Chiudere l'anno integri.

---

## 6. PDF e schede

| Cosa | Path |
|------|------|
| Ciclo (home) | `/` |
| Scheda online | `/admin/sessione/?ciclo=<fase>&sessione=ab\|ac\|cb` |
| PDF sessione | `/admin/sessione/pdf/?ciclo=<fase>&sessione=ab` |

PDF: A4, kg vuoti, **Atleta: _______________**, log serie a penna.

Dati: `admin/data/macrociclo-2026-2027.json`

---

## 7. Checklist nuova fase

- [ ] 13 settimane, deload 13
- [ ] 3 sessioni ab ac cb, Lun/Mer/Sab
- [ ] Parte alta ~70% serie
- [ ] Gambe volume minimo
- [ ] Fase 1 progressiva; fase 2+ max 60 min
- [ ] Esercizi originali Nicola (non copiati)
- [ ] PDF anonimo, riferimento AI etichettato
