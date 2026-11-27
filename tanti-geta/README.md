# Tanti Geta: personaj 2D pentru content în română

**Bârfa științifică cu Tanti Geta.** Vecina de la geam, cu halat înflorat, bigudiuri, ochelari roșii, perna pe pervaz, covor pe perete și mușcate, îți bârfește fapte adevărate din istorie, natură și viață, cu comparații de tipul „crocodil vs. aligator”.

Totul e făcut în cod (HTML, Canvas și Web Audio): personajul, animațiile, efectele video, sunetele și muzica. Nu folosește imagini sau servicii externe. Deschizi `index.html` în Chrome și ai studioul.

**Biblia personajului, formule de hook-uri și strategia pentru TikTok și YouTube Shorts sunt în [STRATEGIE.md](STRATEGIE.md).**

## Cum faci un clip

1. Deschide `index.html` în Chrome (pe calculator merge cel mai bine).
2. Alege un episod gata scris sau scrie-ți scriptul în căsuță.
3. Alege de unde vine vocea:
   - **Microfon live** (recomandat): apeși Înregistrează și citești replicile pe măsură ce apar. Gura ei se mișcă după vocea ta. Treci la replica următoare cu **Space** sau atingând imaginea. **Pune-ți căști**, ca efectele să nu intre în microfon.
   - **Fișierul meu audio**: înregistrezi vocea separat, o încarci, iar replicile se împart pe durata fișierului.
   - **Automat, fără voce**: gura se mișcă după text. Bun pentru probă sau dacă pui vocea după, în CapCut.
4. Apasă **⏺ Înregistrează**. După o numărătoare de 3 secunde, clipul se face singur, cu efectele și muzica în el.
5. Descarcă clipul (1080×1920). În Chrome iese de obicei .mp4. Unele browsere scot .webm.

Ține tabul deschis cât înregistrezi, altfel animația se oprește.

**Opțiuni la „Aspect și sunet”:** fundal verde (chroma key) pentru CapCut, subtitrări și carduri pornite sau oprite, sunete automate (whoosh la card nou, pop la subtitrare), muzică de fundal (se dă mai încet automat când vorbește).

## Cum se scrie scriptul

```
# Crocodil sau aligator?
!serie BÂRFA ȘTIINȚIFICĂ · EP. 1
!hook 🐊 | CROCODIL SAU ALIGATOR?
[șocată] Dacă te mușcă ăsta, măcar să știi cine te-a mușcat!
[șoptește] Psst. Vino la geam.
!vs 📐 | Crocodil | Bot ascuțit, ca un V || 🥄 | Aligator | Bot lat, ca un U
[explică] Unu: botul.
[râde badumts] Ca Costel.
[veselă tada] Tanti Geta închide geamul. Pa!
```

| Ce scrii | Ce face |
|---|---|
| `# Titlu` | Titlul afișat sus |
| `!serie TEXT` | Eticheta roz de sus (ex. `BÂRFA ȘTIINȚIFICĂ · EP. 7`) |
| `!hook emoji \| TEXT` | Text uriaș galben care intră cu „BUM” și tremur, pentru primele secunde |
| `!card emoji \| titlu \| detaliu` | Card cu o singură idee (intră din dreapta cu whoosh) |
| `!vs emoji \| titlu \| detaliu \|\| emoji \| titlu \| detaliu` | Card de comparație |
| `[expresie efecte] text` | O replică, cu expresie și oricâte efecte |
| `// ceva` | Comentariu, nu apare în clip |

**Expresii:** `normal`, `mirată`, `bănuitoare`, `veselă`, `supărată`, `explică` (ridică degetul), `șocată` (mâinile la obraji, gura „O”, zoom), `râde` (se scutură de râs), `șoptește` (mâna la gură, zoom mare, subtitrare roz).

**Efecte:**

| Efect | Ce face |
|---|---|
| `zoom` | zoom pe față cât ține replica |
| `shake` / `tremur` | tremură ecranul |
| `flash` | bliț alb |
| `boom` | BUM dramatic + tremur + bliț |
| `whoosh` | fâșșș de tranziție |
| `pop` | pop scurt |
| `ding` | clopoțel de „știați că” |
| `badumts` | ba-dum-ts după poantă |
| `tobe` | rafală de tobe pentru suspans |
| `tada` | ta-daaa + confetti |
| `scratch` | zgârietură de disc („stai, ce?”) |
| `trist` | trombon trist (fail) |
| `boing` | boing caraghios |
| `tic` | ceas de suspans |
| `confetti` | ploaie de confetti |
| `ploaie` | ploaie cu emoji-urile de pe cardul curent |

În studio, la „Cum scriu scriptul și efectele”, poți apăsa pe fiecare efect ca să-l auzi.

Subtitrările sunt în stil TikTok: text mare, cu contur, iar cuvântul spus acum e galben. Replicile lungi sunt tăiate automat. Sus apare o bară de progres.

## Episoade gata scrise

1. Crocodil sau aligator?
2. Albina sau viespea?
3. Dracula n-a fost vampir
4. Broasca râioasă și minciuna cu negii
5. Iepure de câmp sau de casă?
6. Stiloul și Petrache Poenaru

## Idei pentru episoade noi

**Comparații (formatul „X vs Y”)**
- Corb vs. cioară
- Fluture vs. molie
- Foca vs. leul de mare
- Leopard vs. ghepard vs. jaguar
- Ciupercă comestibilă vs. otrăvitoare („nu culegeți singuri, dragă!”)
- Gem vs. dulceață vs. magiun
- Ceață vs. smog

**Istorie, pe românește**
- De unde vine numele „sarmale” (din turcescul *sarma*, „a înfășura”)
- Henri Coandă și avionul Coandă-1910 (și de ce se tot discută dacă a zburat)
- Traian Vuia și zborul din 1906
- Ana Aslan și Gerovitalul
- De ce avem 1 Decembrie ca zi națională
- Povestea Peleșului

**Viață și obiceiuri**
- De ce punem pernă la geam (Tanti Geta e expertă)
- Superstiții de bloc: adevăr sau mit? (pisica neagră, oglinda spartă, „nu fluiera în casă”)
- De ce ne ciupesc bunicile de obraz
- Mituri de bunică verificate („curentul te omoară”, „după masă nu faci baie”)

**Povești și legende**
- Baba Dochia și cojoacele
- Ielele
- Zburătorul
- Legenda mărțișorului

Înainte să filmezi, verifică faptele din fiecare episod nou. Tanti Geta are voie să bârfească, dar nu să mintă.
