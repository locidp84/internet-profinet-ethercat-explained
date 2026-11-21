# Internet vs PROFINET vs EtherCAT — the animated explainer / az animált magyarázó

**EN:** Three ways to move data over the same Ethernet cable, explained with a **bureaucrat** (TCP/IP),
a **motorcycle courier** (PROFINET RT) and a **sushi belt** (EtherCAT). Plain HTML/CSS/JS, no build step, no dependencies.
Bilingual: Hungarian (default) / English.

**HU:** Három módja annak, hogy adatot mozgassunk ugyanazon az Ethernet-kábelen: egy **bürokrata** (TCP/IP),
egy **motoros futár** (PROFINET RT) és egy **sushi-futószalag** (EtherCAT) segítségével. Sima HTML/CSS/JS, nincs build, nincsenek függőségek.
Kétnyelvű: magyar (alapértelmezett) / angol.

| Page / Oldal | Story / Történet |
|------|-------|
| `index.html` | Menu / Menü |
| `1-tcpip.html` | The Bureaucracy / A bürokrácia — S-shaped road, handshake, 3 layers of forms, switch vs router (MAC vs IP, TTL), ACK, retransmission |
| `2-profinet.html` | The Motorcycle Couriers / A motoros futárok — Ethernet frame only (0x8892), one frame per device, priority lane, cyclic, jitter |
| `3-ethercat.html` | The Sushi Belt / A sushi-futószalag — one frame (0x88A4) visits all devices, processing on the fly |
| `4-showdown.html` | Race + scoreboard + "which one for what" / Futam + eredményjelző + „melyiket mire” |

## Language / Nyelv

Hungarian is the default. Use the 🌐 button, or add `?lang=en` / `?lang=hu` to any URL, e.g. `1-tcpip.html?lang=en`.
The choice is remembered in the browser. / Az alapnyelv magyar. Használd a 🌐 gombot, vagy tegyél `?lang=en` / `?lang=hu` paramétert bármelyik URL végére. A választást a böngésző megjegyzi.

## Controls / Kezelés

`→` / `Space` / click = next step · `←` = back · `H` = hide the control bar · `R` = restart · `Home`/`End` = first/last step.
Jump straight to a step with `#n` in the URL (e.g. `3-ethercat.html#3`). Add `?clean` to hide controls and hint entirely.

## Recording a video / Videófelvétel

The stage is a fixed 16:9 canvas (1280×720) that scales to the window. Open a scene in a 16:9 browser window
(or full screen), press `H` to hide the control bar, start your screen recorder and click through the steps.
A fix 16:9 vászon a böngészőablakhoz igazodik: nyiss meg egy jelenetet teljes képernyőn, nyomj `H`-t, indítsd a felvételt, és kattints végig.

## Notes on accuracy / Szakmai megjegyzés

The analogies are deliberately simplified. Timings (≈0.1 ms / ≈1 ms / ≥10 ms) are typical orders of magnitude, not a benchmark.
A hasonlatok szándékosan egyszerűsítettek. Az időadatok (≈0,1 ms / ≈1 ms / ≥10 ms) tipikus nagyságrendek, nem mérési eredmények.
