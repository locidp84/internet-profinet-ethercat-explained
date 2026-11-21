# Internet vs PROFINET vs EtherCAT — the animated explainer

Three ways to move data over the same Ethernet cable, explained with a **bureaucrat** (TCP/IP),
a **motorcycle courier** (PROFINET RT) and a **sushi belt** (EtherCAT). Plain HTML/CSS/JS, no build step, no dependencies.

| Page | Story |
|------|-------|
| `index.html` | Menu |
| `1-tcpip.html` | The Bureaucracy — handshake, 3 layers of forms, router re-labelling, ACK, retransmission |
| `2-profinet.html` | The Motorcycle Couriers — Ethernet frame only (0x8892), one frame per device, priority lane, cyclic, jitter |
| `3-ethercat.html` | The Sushi Belt — one frame (0x88A4) visits all devices, processing on the fly |
| `4-showdown.html` | Race + scoreboard + "which one for what" |

## Controls

`→` / `Space` / click = next step · `←` = back · `H` = hide the control bar · `R` = restart · `Home`/`End` = first/last step.
Jump straight to a step with `#n` in the URL (e.g. `3-ethercat.html#3`). Add `?clean` to hide controls and hint entirely.

## Recording a video

The stage is a fixed 16:9 canvas (1280×720) that scales to the window. Open a scene in a 16:9 browser window
(or full screen), press `H` to hide the control bar, start your screen recorder and click through the steps.

## Notes on accuracy

The analogies are deliberately simplified. Timings (≈0.1 ms / ≈1 ms / ≥10 ms) are typical orders of magnitude, not a benchmark.
