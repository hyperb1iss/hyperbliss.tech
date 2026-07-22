# Loop Engineering — Image Storyboard

Art direction for `content/posts/2026.07.21_loop-engineering.md`. Five images: one hero plus four inline, matching the how-i-ai density (hero + 3) with one optional extra. Palette locked to the site system: cosmic purple `#a259ff`, neon pink `#ff75d8`, digital cyan `#00fff0`, void black `#0a0a14`. Style thread from the how-i-ai hero: cyberpunk elegance, editorial sci-fi illustration, clean and luminous, never gritty or corporate. Every prompt ends with the same negative guidance because generators mangle text.

Shared prompt suffix (append to every generation):

> Elegant editorial sci-fi illustration, cinematic lighting, deep void-black background (#0a0a14), glowing accents in electric purple (#a259ff), neon pink (#ff75d8), and cyan (#00fff0). Clean composition, high contrast, subtle film grain. No readable text, no letters, no numbers, no logos, no watermarks, no UI gibberish.

Target format: generate large (2048px+ wide), export as webp into `public/images/blog/`.

---

## 1. Hero — The Loop Runs Itself

**File:** `/images/blog/loop-engineering-hero.webp` · **Aspect:** 16:9 (or 3:2 to match how-i-ai)
**Placement:** after the "None of this is a demo" paragraph, before "🌀 The Name Finally Caught Up" (same slot as the how-i-ai hero).

**Concept:** the trilogy's visual continuity. The how-i-ai hero was a developer haloed by orbiting agent panels, human at the center steering. This one evolves the scene: the developer has stepped back from the desk — standing to the side with a drink, watching — while the holographic panels now orbit _each other_ in a closed luminous circuit, output streams from one panel arcing into the input of the next. The loop is visibly self-feeding. One thin bright thread still runs from the loop to the developer's hand: the steering line.

**Generator prompt:**

> A developer stands relaxed to one side of a dark workspace, coffee in hand, calmly watching their desk from a few steps away. Above the empty chair, a ring of translucent holographic terminal panels orbits in a perfect circle, each panel pouring a ribbon of glowing light into the next panel around the ring, forming one continuous luminous cycle like a neon ouroboros of screens. A single fine thread of light runs from the ring to the developer's fingertips. Sense of calm mastery and motion, the machine working while the human watches.

**Alt text:** A developer stands back from their desk holding a coffee, watching a ring of holographic terminal panels orbit above the chair, each panel feeding a ribbon of light into the next in a continuous glowing cycle, with a single thin thread of light connecting the ring to the developer's hand.

**Caption:** `The loop runs itself. The steering thread stays in your hand.`

---

## 2. The Eval Loop — Eleven Arms, One Survivor

**File:** `/images/blog/loop-engineering-eval.webp` · **Aspect:** 16:9
**Placement:** in "🧪 The Eval Loop", after the exposure-scores code block.

**Concept:** the experiment campaign as a laboratory of parallel glass chambers. Eleven vertical translucent columns in a row, each running a glowing simulation — most dimming to embers (the retired hypotheses), one blazing bright (the survivor), with its light flowing out of the chamber and back into the machinery that feeds all of them. Science, not magic: readout panels, measurement instruments, precision.

**Generator prompt:**

> A dark laboratory hall with a row of eleven tall glass cylinders, each containing a swirling luminous experiment. Most cylinders glow faintly in fading violet embers, dimming out. One cylinder near the center blazes with brilliant cyan-and-pink light, and a stream of its light flows out through transparent conduits back into the machinery at the base of all the cylinders, closing the circuit. Thin instrument arms and measurement probes surround each cylinder. Mood of rigorous science in a cyberpunk observatory.

**Alt text:** A dark laboratory with eleven tall glass cylinders in a row, most glowing with faint dying embers while one blazes bright with cyan and pink light, its energy flowing through conduits back into the machinery feeding all the cylinders.

**Caption:** `Eleven arms, five retired with receipts, one survivor. The loop feeds the win back in.`

---

## 3. Review Convergence — The Descending Staircase

**File:** `/images/blog/loop-engineering-convergence.webp` · **Aspect:** 16:9, wide and short
**Placement:** in "🔮 Review Loops", after the `17 → 9 → 8 → ... → PASS` code block.

**Concept:** the convergence ledger as terrain. A descending staircase of glowing bar-monoliths falling left to right toward a calm horizon — with one deliberate anomaly near the end where a step jumps back _up_ (the round-nine regression) before settling to a final serene flat plane bathed in success-green-adjacent cyan. Two small robed-in-light figures (the two models) walk the staircase together.

**Generator prompt:**

> A surreal landscape at night: a giant staircase of luminous rectangular monoliths descends from left to right, each step shorter than the last, glowing purple and pink against a void-black sky. Near the end of the descent, one single step rises unexpectedly higher again before the stairs settle into a final flat plane of calm cyan light stretching to the horizon. Two small figures made of light walk down the steps side by side. Vast scale, quiet drama, sense of approaching resolution.

**Alt text:** A surreal night landscape where a staircase of glowing monoliths descends toward a calm cyan horizon, one late step rising unexpectedly higher before the final flat plane, with two small figures of light walking down together.

**Caption:** `17 → 9 → 8 → 4 → 3 → 2 → 1 → 1 → 4 → 1 → 1 → PASS. Round nine is why you graph it.`

---

## 4. The Babysitter — Sentinel Over the Grid

**File:** `/images/blog/loop-engineering-vigil.webp` · **Aspect:** 16:9
**Placement:** in "🛠️ The Babysitter", after the "loop logic is maybe a fifth of the code" paragraph and its rails list.

**Concept:** vigil as a lighthouse-drone hovering over a city grid of floating cards (the PRs), sweeping a soft cone of cyan light across them. Cards in the beam glow in five distinct state-colors; a few cards trail small repair-drones actively working on them; one card is lifted out of the grid on a beam toward the viewer (escalated to the human). Watchfulness, order, and delegation in one frame.

**Generator prompt:**

> A serene cyberpunk scene: a sleek geometric drone shaped like a floating lantern hovers above an endless dark grid of glowing rectangular cards arranged like a city seen from above. The drone sweeps a wide soft cone of cyan light across the grid. Cards touched by the beam glow in distinct hues of purple, pink, cyan, amber, and deep blue. Tiny spark-like repair drones tend to a few individual cards. One single card rises out of the grid on a vertical beam of bright light toward the foreground. Calm, orderly, vigilant atmosphere.

**Alt text:** A lantern-like drone hovers over a dark grid of glowing cards, sweeping a cyan beam across them; cards glow in five distinct colors, tiny repair drones tend to some, and one card rises out of the grid on a beam of light.

**Caption:** `1,785 sessions in five days: poll, classify, dispatch, learn. The irreversible stuff rides the beam up to you.`

---

## 5. Loops That Feed the Loops — The Dreaming Garden (optional but 🔥)

**File:** `/images/blog/loop-engineering-dream.webp` · **Aspect:** 16:9
**Placement:** in "🌙 Loops That Feed the Loops", after the forgetting-is-a-loop paragraph.

**Concept:** the nightly consolidation + usage-gardened forgetting as a bioluminescent garden at night. A vast knowledge-graph forest: nodes as glowing blossoms connected by light-vines. A moon hangs overhead. Some blossoms burn bright where thin recall-threads from distant terminals touch them (used memory surviving); untouched blossoms fade to grey ash and drift away as particles (decay). A quiet gardener figure made of moonlight prunes and grafts (the dream cycle), working while everything sleeps.

**Generator prompt:**

> A bioluminescent garden at night under a large pale moon: a forest of glowing flower-like nodes connected by vines of light, forming a vast network. Threads of light reach in from beyond the frame and touch some blossoms, which flare bright purple and cyan; untouched blossoms fade to grey and dissolve into drifting ash particles. A translucent figure woven from moonlight tends the garden, pruning faded vines and grafting bright ones. Dreamlike, tender, quietly alive.

**Alt text:** A bioluminescent night garden of glowing networked blossoms under a pale moon; threads of light make some blossoms flare bright while untouched ones fade to ash, as a translucent moonlight figure prunes and grafts the vines.

**Caption:** `Recall feeds the bloom, silence feeds the ash. The garden gardens itself at 3:30am.`

---

## 6. Proof at Scale — The Seam (added post-draft)

**File:** `/images/blog/loop-engineering-scale.webp` · **Aspect:** 16:9
**Placement:** in "🎯 Proof at Scale", closing the section after the "Build it like that's true" paragraph.

**Concept:** the Bun rewrite as civil engineering at night. A monumental lattice bridge mid-rebuild: the left span fading amber (the Zig codebase dimming out), the right span luminous purple-cyan (the Rust port coming alive), and sixty-four tiny light-figures swarming the seam where old becomes new. Paired inspector-drones sweep scrutiny beams over every fresh strut — the two adversarial reviewers per task, made literal. One human silhouette on a control platform, watching. Restrained, industrial, no hero worship: the interesting thing is the seam, not the monument.

**Generator prompt:**

> A vast monumental lattice bridge seen at night, mid-rebuild. The left span glows in fading warm amber light, dimming toward embers; the right span is newly rebuilt and radiates luminous electric purple and cyan. At the seam where old becomes new, a swarm of sixty-four tiny figures of light works in coordinated crews. Distinct paired inspector-drones sweep narrow scrutiny beams across each freshly placed strut. On a small control platform in the foreground, a single human silhouette watches the operation. Vast scale, calm industrial precision, relentless coordinated motion.

**Alt text:** A monumental lattice bridge at night, its left span fading to amber embers and its right span glowing electric purple and cyan, with dozens of tiny figures of light rebuilding the seam between them while paired inspector drones sweep scrutiny beams over new struts and a lone human watches from a control platform.

**Caption:** `Sixty-four builders, two adversarial readers per beam, one human steering. The tests don't care what you call it.`

---

## Markdown snippets (paste-ready once images land)

```markdown
![A developer stands back from their desk holding a coffee, watching a ring of holographic terminal panels orbit above the chair, each panel feeding a ribbon of light into the next in a continuous glowing cycle, with a single thin thread of light connecting the ring to the developer's hand.](/images/blog/loop-engineering-hero.webp 'The loop runs itself. The steering thread stays in your hand.')

![A dark laboratory with eleven tall glass cylinders in a row, most glowing with faint fading embers while one blazes bright with cyan and pink light, its energy flowing through conduits back into the machinery feeding all the cylinders.](/images/blog/loop-engineering-eval.webp 'Eleven arms, five retired with receipts, one survivor. The loop feeds the win back in.')

![A surreal night landscape where a staircase of glowing monoliths descends toward a calm cyan horizon, one late step rising unexpectedly higher before the final flat plane, with two small figures of light walking down together.](/images/blog/loop-engineering-convergence.webp '17 → 9 → 8 → 4 → 3 → 2 → 1 → 1 → 4 → 1 → 1 → PASS. Round nine is why you graph it.')

![A lantern-like drone hovers over a dark grid of glowing cards, sweeping a cyan beam across them; cards glow in five distinct colors, tiny repair drones tend to some, and one card rises out of the grid on a beam of light.](/images/blog/loop-engineering-vigil.webp '1,785 sessions in five days: poll, classify, dispatch, learn. The irreversible stuff rides the beam up to you.')

![A bioluminescent night garden of glowing networked blossoms under a pale moon; threads of light make some blossoms flare bright while untouched ones fade to ash, as a translucent moonlight figure prunes and grafts the vines.](/images/blog/loop-engineering-dream.webp 'Recall feeds the bloom, silence feeds the ash. The garden gardens itself at 3:30am.')
```

## Notes

- Hero continuity matters most: same palette and human-plus-holograms language as the how-i-ai hero, evolved so the human has stepped back and the panels feed each other. Readers of the trilogy should feel the progression at a glance.
- If trimming to three inline images, keep eval + convergence, drop vigil before dream — the dream garden is the emotional beat of the post.
- The convergence caption carries the only numbers; the image itself must stay number-free (generators butcher glyphs).
- If the generator fights the "one step rises again" anomaly in image 3, generate the clean descent and add the round-nine bump as a manual edit — that detail is load-bearing for the caption's joke.
