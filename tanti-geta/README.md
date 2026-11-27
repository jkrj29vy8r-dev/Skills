# Tanti Geta: Bârfa științifică

Tanti Geta e vecina de la etajul 3, cu halat înflorat, bigudiuri, ochelari roșii, papuci pufoși și cafeaua în mână. Povestește istorie, fapte ciudate și comparații din natură, în cadre rapide, ca în seria *Weird History* a lui Gus.

Totul e făcut în cod (HTML, Canvas și Web Audio): personajul, obiectele animate, efectele, sunetele și muzica. Nu folosește imagini sau servicii externe.

| Fișier | Ce e |
|---|---|
| `index.html` | **Studioul principal, în stilul Gus:** fundal crem, obiect animat în centru, subtitrări scurte cu cuvântul-cheie galben, Tanti Geta jos în stânga, ștampile și etichete |
| `geam.html` | Stilul vechi, cu Tanti Geta la geamul blocului |
| `STRATEGIE.md` | Biblia personajului, hook-uri, strategia pentru TikTok și YouTube Shorts |

## Cum faci un clip

1. Deschide `index.html` în Chrome, pe calculator.
2. Alege un episod gata scris sau scrie-ți scriptul.
3. Alege de unde vine vocea:
   - **Fișierul meu audio** (recomandat): înregistrezi tot episodul cu vocea ta, de exemplu cu reportofonul de pe telefon, și îl încarci. Studioul găsește singur porțiunile în care vorbești și potrivește subtitrările pe ele.
   - **Microfon live:** citești din prompterul de sub butoane. Subtitrările merg înainte cât timp vorbești și te așteaptă când faci pauză. Cu Space sau atingând imaginea sari la următoarea. Pune-ți căști.
   - **Automat, fără voce:** pentru probă, sau dacă pui vocea după, în CapCut.
4. Apasă **⏺ Înregistrează**. După numărătoarea inversă iese clipul 1080×1920, cu efectele în el.

Ține tabul deschis cât înregistrezi.

## Clip complet din cod (cu voce, fără să înregistrezi nimic)

`render/render.js` face tot clipul singur:
- vocea lui Tanti Geta, sintetizată local (espeak-ng + vocea românească MBROLA ro1), cu ton și viteză diferite pe fiecare expresie
- animațiile, randate cadru cu cadru la 30 fps
- efectele sonore și muzica, generate cu Web Audio
- montajul în MP4, cu volumul normalizat pentru TikTok și Shorts

```bash
# o singură dată (Ubuntu/Debian): voce + ffmpeg + Playwright
sudo apt install espeak-ng mbrola mbrola-ro1 ffmpeg
npm i -g playwright && npx playwright install chromium

cd tanti-geta/render
node render.js "#6 Războiul porcului ⭐" porc.mp4 --music
node render.js episodul-meu.txt clip.mp4        # sau propriul tău script
```

`--music` adaugă muzica de fundal, iar `--green` pune fundal verde. Vocea sintetică e bună pentru probe și pentru clipuri rapide. Pentru clipurile importante, vocea ta (modul „Fișierul meu audio”) sună mult mai natural.

## Cum se scrie scriptul

```
# Cuza, ales de două ori
!serie BÂRFA ȘTIINȚIFICĂ | #1
@harta MOLDOVA | 1859
[explică] În *1859*, | Moldova își alege domn.
+stamp galben ALES!
[veselă] Pe *Alexandru Ioan Cuza*.
@unire MOLDOVA | ȚARA ROMÂNEASCĂ | UN SINGUR DOMN
[râde badumts] Un domn. | Două țări. | *Zero întrebări*.
@urmeaza 🐦 EMU | 🪖 ARMATA
+eticheta galben FOLLOW
[bănuitoare] Data viitoare: | cum a pierdut o armată | cu niște *păsări*.
```

| Ce scrii | Ce face |
|---|---|
| `# Titlu` | Numele fișierului video |
| `!serie TEXT \| #1` | Eticheta roz din colț și numărul episodului |
| `@obiect argumente` | Schimbă obiectul din centru (vezi lista de mai jos) |
| `+stamp culoare TEXT` | Ștampilă pe obiect, de la replica următoare |
| `+eticheta culoare TEXT \| SUBTEXT` | Etichetă în dreapta-jos, cât ține replica următoare (ex. `FOLLOW`, `FALS.`) |
| `[expresie efecte] Text` | Replică. `*cuvinte*` ies galbene, `\|` taie subtitrarea unde vrei |

**Culori pentru ștampile și etichete:** `galben`, `rosu`, `negru`, `verde`, `albastru`, `roz`, `alb`, `stampila` (contur roșu, ca o ștampilă adevărată).

**Expresii:** `normal`, `mirată`, `bănuitoare`, `veselă`, `supărată`, `explică` (ridică degetul), `șocată` (mâinile la obraji), `râde`, `șoptește` (mâna la gură, zoom), `umeri` (ridică din umeri).

**Efecte:** `zoom`, `shake`, `flash`, `boom`, `whoosh`, `pop`, `ding`, `badumts`, `tobe`, `tada`, `scratch`, `trist`, `boing`, `tic`, `stamp`, `kaching`, `confetti`, `ploaie`.

Subtitrările se taie automat în bucăți de 2–4 cuvinte. Numerele ies automat galbene dacă nu marchezi nimic cu `*`.

### Obiecte

| Obiect | Exemplu | Ce face |
|---|---|---|
| emoji | `@emoji 🐊 🐊` sau `@🐊` | Emoji mari care plutesc |
| ceas | `@ceas 9:00 \| GATA` | Limbile se învârt până la ora dată |
| cronometru | `@cronometru 38:00` | Numără până la timp |
| grafic | `@grafic Pauza mea=60 MIN \| Războiul=38 MIN` | Bare care cresc |
| buletin | `@buletin BULETIN \| NUME: GETA \| FUNCȚIA: VECINĂ` | Card de identitate cu poza ei |
| pergament | `@pergament ULTIMATUM \| rând \| rând \| Semnat: X` | Rândurile apar pe rând |
| factura | `@factura FACTURĂ \| Obuze \| Mai multe \| TOTAL: MULT` | Bon cu total roșu |
| carnet | `@carnet CARNETUL CU BÂRFE \| „text” \| – Geta` | Text care se scrie singur, de mână |
| trofeu | `@trofeu 38 \| MIN \| RECORD` | Trofeu auriu cu sclipiri |
| harta | `@harta ZANZIBAR \| 1896` | Insulă cu nume și an |
| unire | `@unire MOLDOVA \| ȚARA ROMÂNEASCĂ \| ROMÂNIA` | Două bucăți de pământ care se unesc în tricolor |
| text | `@text BUM!` | Explozie de text |
| vs | `@vs 🐊 CROCODIL \| 🐊 ALIGATOR` | Comparație |
| urmeaza | `@urmeaza 🐊 CROCODIL \| 🐊 ALIGATOR` | Ecranul „Data viitoare:” |
| ziar | `@ziar GAZETA BLOCULUI \| TITLU \| subtitlu \| 📰` | Ziar cu titlu |
| mesaj | `@mesaj COSTEL \| text` | Telefon: „scrie…” apoi apare mesajul |
| an | `@an 1897 \| subtitlu` | Calendar care numără până la an |
| porc | `@porc` sau `@porc ÎNGER` | Porc care râmă în grădina cu cartofi, sau înger cu aripi și aureolă |
| corabii | `@corabii 5 \| FLOTA BRITANICĂ` | Corăbii de război care intră pe rând |
| gol | `@gol` | Nimic în centru |

În `@buletin`, dacă titlul începe cu un emoji (`@buletin 👑 ARBITRU | ...`), poza din buletin devine emoji-ul. Altfel e Tanti Geta.

## Profil și banner

În studio, la „Profil și banner”, poți descărca oricând:
- **Poza de profil** 1080×1080, cu Tanti Geta privind pieziș, cu cafeaua în mână. Se decupează bine în cerc pe TikTok, YouTube și Instagram.
- **Bannerul YouTube** 2560×1440. Textul și personajul sunt în zona de 1546×423 din centru, care se vede pe toate dispozitivele.

Variantele gata exportate sunt în `branding/`.

## Episoade gata scrise

0. ⭐ **Războiul porcului** (1859): războiul în care singura victimă a fost un porc. *Episodul recomandat pentru lansare.*

1. **Cuza, ales de două ori** (unirea din 1859)
2. **Războiul cu emu** (Australia, 1932)
3. **Crocodil sau aligator?**
4. **Dracula n-a fost vampir**
5. **Petrache Poenaru și stiloul**

Fiecare se termină cu „Eu sunt Tanti Geta” și „Data viitoare:” cu episodul următor. Așa se leagă într-o serie.

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
