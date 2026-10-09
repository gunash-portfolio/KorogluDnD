# What we tested, and what broke

Judging prompt: tests, failures, and comparison with how the task is done today. Honest failures score better than silence.

There is **no automated test suite** (no Jest). Tests were **play tests**, a recorded two-minute run, cultural checks against the dastan, and shipping checks (GitHub, PowerPoint).

## What we tested

| Test | How | Result |
| --- | --- | --- |
| Two-minute live loop | Record `public/koroglu-two-minute-playthrough.webm` | Opening cards → father → ashik heal → tax riders → Ayvaz → captain → Nigar → gate |
| WebGL vs 2D | Boot on machines without a happy GPU | WebGL throw used to white-screen; now ignored, 2D valley still plays (`bootError` + `view3d.ok`) |
| Verse vs sword | Play mixed combat | Verse demoralizes; ashik heal restores HP if you ride back |
| Ally AI | Deli Hasan / Ayvaz in the same fight | They join and strike; they also bunch and overshoot (no navmesh) |
| Counsel + ending | Talk after Nigar is free; hug; Speak with Nigar | First ship: hug only, no love words. Then love talk. Then an explicit **Good ending** card |
| Cultural plot | Wikipedia Epic of Koroghlu vs our beats | Father blinded for truth, Nigar, Çamlıbel kept. We did **not** invent a new main plot |
| Video on GitHub | Commit 13 MB `.webm` | File was on `hackathon/gate-love-dialogue`. Looking at **main** made it look missing |
| PowerPoint | Open `.pptx` | First handmade OOXML would not load. Rebuilt so PowerPoint can open it |

## What broke (and still is honest)

- **No 50 Turkic models.** Horses and the keep are boxes. Proposal asked for real assets; we shipped readable low-poly so the loop could be played.
- **No mounted archery.** Proposal listed it. This build is saber + verse only. Hitboxes are distance, not a physics engine.
- **No live Azerbaijani/Turkmen dialect model.** Dialogue is scripted English trees. Region variants are a next step, not this binary.
- **WebGL is fragile.** Render errors drop you to the 2D map. The game survives; the 3D promise does not always.
- **Ally pathfinding is greedy `moveToward`.** Allies stack, clip the captain, and are hard to debug as a real FSM.
- **Auto-ride** helps the demo clip and steals the stick if a judge wants full control.
- **Ending was incomplete:** hug without Nigar speaking felt like a trophy still. That is why the good-ending talk exists.
- **No unit tests.** A regression in talk flags would only show in play.

## Comparison with how the task is done today

| Today | This prototype | Still worse than we claimed |
| --- | --- | --- |
| Recitation, lecture, Wikipedia plot | Two-minute ride with saber and verse | English-only; not a full dastan |
| Slide titled “Epic of Koroglu” | Character cards, then the valley | Cards are still slides — we only get honest after you click into play |
| Generic horse games | Koroglu’s beat: blinded father, Nigar, Çamlıbel as a home | Art is generic blocks, not museum-grade horses |
| Fixed textbook ending | Justice/revenge counsel + Nigar good ending | Cloud generative quests are not in the build |

**Sentence for judges:** we tested by playing and recording, not by a CI suite; WebGL, missing love-talk, wrong Git branch, and a broken first PowerPoint all failed in the open; we still beat today’s lecture by making the loop playable, while the proposal’s 50 models, archery, and dialect AI did not ship.
