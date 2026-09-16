# Koine Drill — maintenance notes

Two-file flashcard app: `koine-drill.html` (markup/CSS/engine) + `cards-data.js`
(deck/vocab/paradigm content, loaded via `<script src="cards-data.js">` right
before the engine script — see "Data file split" below). 26 decks: 22 paradigms
(439 slots) + 403 vocabulary words, covering Biblingo lessons 1–16.

This file is the maintainer-facing record for this repo and is meant to be the
complete engineering history — if a change to the app happened, it's documented
here, not only in a Claude-side chat log. Keep it that way: any session working on
this app should update this file, in the repo, as part of the change, not as an
afterthought somewhere else.

## Hosting and sync: verify against the code

Hosting moved from the claude.ai Artifact to GitHub + Cloudflare (2026-09-12).
Earlier notes claimed sync was rewritten to a general mechanism, but the HTML
inspected during hosting setup still used `window.claude.use("db")`, with
browser-local storage as its fallback. Treat the sync rewrite as **unverified**
until the current repository code proves otherwise. Read the actual code before
touching sync behavior.

**2026-09-15/16 exception:** for two sessions (the μι Verbs expansion and the
Present Medio-Passive expansion, both described below) John asked to work
directly against the published claude.ai Artifact
(`https://claude.ai/artifact/Qb6RbvCHqRbPWAAZud6xjv`) instead of this repo, so
those two features were built and verified there first. Resolved 2026-09-16 by
diffing the Artifact copy against this repo directly: the repo's only unique
change since the fork point was the GFS Neohellenic font commit (`456dc4e`);
everything else was just this repo missing the Artifact's later vmi/vmp work.
Both were merged into one file (see "Data file split" below). The Artifact is
no longer the working copy — this repo is.

## Local clones — where the authoritative copy actually is

As of 2026-09-16 there are (at least) two separate local copies of this repo on
John's machine, and they are **not** in sync with each other:

- `Desktop\Biblingo Koine Greek\Koine Drill\` — a plain folder (not a git
  working tree) that every Claude session has been treating as the working
  copy: read from and written to directly, then dragged/uploaded to GitHub by
  hand. This is current as of this file's last edit.
- `C:\Users\John\koine-drill` — an actual `git clone` of this repo with an
  `origin` remote, i.e. real push credentials. As of 2026-09-16 it is
  checked out around commit `456dc4e` (the GFS Neohellenic commit) — meaning
  it predates the vmi/vmp expansions *and* the `cards-data.js` split below. Its
  `koine-drill.html` is a single-file ~255KB version, not the current split
  pair. It also has a `.git/cursor/` directory, meaning the Cursor IDE has its
  own working state there.

Net effect: the clone with push access is stale, and the folder that's actually
current has no push access. Until this is reconciled (bring `~/koine-drill` up
to date with the Desktop folder, or start pushing from wherever John's git
credentials actually live), **the Desktop folder is the one every session
should read from and write to**, and getting it onto GitHub is a manual
drag/upload rather than a git push. If a future session gets asked to fix this
properly, that's a deliberate sync task of its own — see "GitHub divergence"
below for the history of how it drifted the first time.

## Data file split (2026-09-16)

The old single-file version kept a "DECK DATA" block (CASES/NUMS/GENS/PERSONS/
GROUPS/ARG_POOL, the `r()`/`n()`/`v()`/`dim*()` row-builder helpers, DECKS, VOCAB,
VOCAB2, WORDS, CLAUSES, NOUNSETS, NOUN_PARADIGMS, VERBSETS, VERB_DECKS, MI_VERBS,
VMP_VERBS) inside the engine's `(function(){"use strict";...})()` IIFE. That block
now lives verbatim in `cards-data.js` as top-level (global) `var` statements in
its own `<script src>` tag, loaded before the engine `<script>` so the IIFE still
resolves them as free variables. Not converted to literal JSON: DECKS builds 394
rows via function calls, not object literals, and the data carries ~190 lines of
`//` documentation comments — both incompatible with JSON. Don't reorder the two
script tags; the engine depends on the data script running first.

**GitHub divergence, how it happened:** this repo forked before the vmi/vmp
expansions were built (those went into the claude.ai Artifact instead — see the
exception above), so its `koine-drill.html` was missing both. It did have one
commit the Artifact copy lacked: `456dc4e`, "Add GFS Neohellenic as a Greek type
option" (font import line, one `:root[data-grk="neohellenic"]` rule, one
settings button, one `FONTS` array entry). That font option was ported into the
merged file so it wasn't lost, and the merge was verified via headless Chromium
against both prior versions: identical button/deck inventory, identical
due-counts on every deck, zero page errors, correct dropdown option counts
(μι Verbs 11, Present Medio-Passive 17), Neohellenic font button toggling
`data-grk` correctly.

**Where that merge stands:** a push of the merged commit from a throwaway
sandbox clone was refused (`access denied ... not in this session's authorized
repository set` — being public only unblocks anonymous *read*, not write). As
of the font-picker change below (2026-09-16), a direct fetch of this repo's
`main` branch shows `koine-drill.html` and `cards-data.js` both already present
and matching the split version described here — so the merge did make it to
GitHub `main` by some route since the sandbox push was refused (a manual
upload, most likely), just not documented anywhere. If you're reading this
and know how that happened, it's worth a line here so the next person doesn't
have to re-derive it.

## Data structures

```js
// paradigm deck
{ id, group, name, lemma, cite?, en, tag, sem?, lesson,
  dims: [ {k:"cs", label:"Case", values:[...]},                  // asked in both directions
          {k:"pd", label:"Paradigm", values:[...], ask:false} ], // shown, never asked
  table: {row, col, split?} | null,
  words?: { <pd|gd|cs value>: "θύρα — door" },
  short?: { <dim value>: "η ης" },   // per-deck chip/option label override
  note, rows: [ {cs,nu,gd|pn|pd, form, gloss, extra?} ] }

// vocabulary word
["ὀφθαλμός, ὁ", "eye", "noun", "1.2"]   // greek, english, category, lesson
```

The paradigm structure above is schematic, not executable JavaScript.

`shortOf(value, deck)` resolves the deck's own short map first, then the global `SHORT` abbreviations — must be passed the deck, since "masculine"/"feminine" mean different things in n1 vs n2.

`CLAUSES` holds example sentences keyed `<deckId>|<dim>|<dim>|...`. `NOUNSETS` holds per-paradigm word lists for n1/n2/n3 (up to 3 words each, `{g, f:[8 forms], ex:[8 sentences], exEn:[8 glosses]}`, one slot per case×number). `NOUN_PARADIGMS` drives the dropdown labels. `VERBSETS`/`VERB_DECKS` are the verb-side counterpart for the five rotating verb decks only — μι Verbs (vmi) and Present Medio-Passive (vmp) are both permanently excluded and shown side-by-side instead of rotating (see below for both).

Adding a word to `NOUNSETS`: cap at 3 words per paradigm, all already taught (check lesson PDFs + `WORDS`/`VOCAB`). Write all 8 sentences (one per case×number slot) using the accent rules below.

## μι Verbs deck (vmi) — expanded 2026-09-15

Carries all 11 -μι verbs taught through lesson 16, not just the original 3
(δίδωμι, τίθημι, ἵστημι — 9.4/10.4, the only ones Biblingo gives a full
present-tense paradigm table for). The other 8 are vocabulary-only in Biblingo
(lemma + gloss, no conjugation table): ἀποδίδωμι "give back" (10.1), προστίθημι
"add" (10.1), ἀνίστημι "stand up" (15.4, 16.1), ἀφίημι "leave" (9.4), συνίημι
"understand" (15.1), δείκνυμι "show" (9.4), πίμπλημι "fill" (10.3), ἀπόλλυμι
"destroy" (15.3). Their present-tense forms in `rows` were filled in from
standard Koine morphology per conjugation family (δίδωμι-type, τίθημι-type,
ἵστημι-type, the non-reduplicating -νυμι class for δείκνυμι/ἀπόλλυμι, the ἵημι
family for ἀφίημι/συνίημι with its 3rd-plural -ᾶσι(ν)) — cross-checked against
each vocab table's lemma, **not** copied from a Biblingo table, since none
exists for these 8. Worth re-verifying against another grammar if it ever
matters. These 8 have no `ex`/`exEn` example sentences (`v()`'s last two args
are optional; render code handles their absence).

Two dropdowns (Settings panel, Reference panel) cover all 11 verbs, both reading
from a single hoisted `MI_VERBS` array (`{v: pd-key, g: lemma}` shape) so they
can't drift out of sync.

## Present Medio-Passive deck (vmp) — converted to side-by-side and expanded 2026-09-16

Through 2026-09-15 `vmp` was a **rotating** deck (in `VERBSETS`/`VERB_DECKS`,
like vpres/vfut/etc.): one fixed set of 6 rows (ἔρχομαι's paradigm), with a
3-word pool (ἔρχομαι/ἐργάζομαι/βαπτίζομαι) swapped in and out via a Settings
dropdown. John asked for every medio-passive verb taught through chapter 16,
plus a selection dropdown in both Settings and the Reference/Charts panel.
Since the rotating architecture only ever shows one word's paradigm at a time
in Reference, adding a Reference-panel filter dropdown required first
converting the deck to vmi's **side-by-side** architecture (all verbs' rows
always present, `table.split:"pd"`, a `dimPara("Verb",[...])` dimension) —
this drops the old random-rotation drilling behavior and resets vmp's saved
progress (card ids change with the new `pd` dimension); confirmed with John
before doing it.

`vmp` now carries all 17 deponent/medio-passive verbs taught through lesson 16
— Biblingo's own definition of "deponent" (medio-passive form, no active
counterpart, per the 8.2/8.4 glossary) plus two true middle/passive uses of
verbs that also exist in the active (βαπτίζομαι "be baptized", στρέφομαι "turn
around"), since John asked for "all medio-passive verbs," not strictly "all
deponents":

| verb | gloss | lesson |
|---|---|---|
| ἔρχομαι | come | 7.1, 8.2 |
| ἀπέρχομαι | leave | 13.4 |
| εἰσέρχομαι | move into | 10.4 |
| προσέρχομαι | approach | 14.3 |
| πορεύομαι | go | — |
| διαπορεύομαι | travel through | 14.3 |
| γεύομαι | taste | — |
| ἅπτομαι | touch | — |
| ἀσπάζομαι | greet | — |
| ἐργάζομαι | work | 12.2 (ὀργίζομαι nearby) |
| δέχομαι | receive | 11.2 |
| γίνομαι | become | 13.1 |
| ὀργίζομαι | be angry | 12.2 |
| στρέφομαι | turn around | 10.3 |
| βαπτίζομαι | be baptized | 14.4 |
| βούλομαι | want | 16.1 |
| κάθημαι | sit | 14.2 |

κάθημαι is athematic (κάθη-σαι/κάθη-ται, not the -ῃ/-εται pattern the other 16
follow) and is flagged in the deck's own note. Only 3 of the 17 verbs
(ἔρχομαι, ἐργάζομαι, βαπτίζομαι) carry `ex`/`exEn` example sentences, reused
verbatim from the old rotation pool — the other 14 verbs' 84 rows don't (same
scope gap as 8 of vmi's 11 verbs).

`vmp` was removed from `VERB_DECKS`/`VERBSETS` entirely and given its own
hoisted roster array, `VMP_VERBS` (same `{v,g}` shape as `MI_VERBS`). Two
dropdowns mirror vmi's exactly: a Settings-panel "Medio-Passive verb" dropdown
gated to `st.deck==="vmp"` (see "Filters and queue behavior" below for why),
and a Reference-panel "Show verb" display-only filter (module-level state
`refVmpPd`, not wired to `st.filters`).

## Stable progress IDs

Forward (Parse→Form): `<deck>|F|<dim values>`. Reverse (Form→Parse): `<deck>|R|<dim values of every row this form covers, joined by ~>` — not the form itself, because rotating decks change forms every session and keying by form would throw away scheduling. Anything touching progress records must build the id this same way.

## Greek language checks

- Oxytone words take a grave instead of acute when not sentence-final, full acute when they are (θεός → θεὸς mid-clause).
- Paroxytone/proparoxytone/circumflex-accented words never shift.
- Neuter-plural subjects take a singular verb.
- Monosyllabic 3rd-declension nouns (e.g. σάρξ) take accent-on-ultima in oblique cases.
- Compound verbs (ἀποδίδωμι, προστίθημι, ἀνίστημι, compounds of ἔρχομαι/πορεύομαι, etc.) keep the base verb's own accent — it never recedes onto the prepositional prefix.

## Filters and queue behavior

`passesFilter(c)` opens with `if(!singleDeck()) return true` — no filter chip and no control built on `st.filters` has ever narrowed anything except while that exact single deck (not "All decks", not a group) is selected. Before adding a new filter-backed control, check whether it mutates row data directly (`rollNouns()`/`rollVerbs()` — safe at any scope) or filters existing rows (`st.filters` — safe ONLY at the exact single deck). Verify against the actual built queue (`st.queue`), not just DOM/UI state — a control can render correctly and still do nothing. This is why both vmi's and vmp's Settings dropdowns are gated to their exact deck id, not to "all"/"g:verb" like the five rotating decks' dropdowns.

Rebuild = reshuffles queue, throws away current card. Only toggles that change which cards exist should do this.

Rebuilds: Drill direction, Session (Due/Full), deck buttons, filter chips, Reset progress, Archive/Restore toggle, per-deck reset, noun/verb word-set dropdowns (including vmi/vmp).

Does not rebuild: Answer by (Recall/Reveal), Stop-after timer, Missed cards toggle, Word highlight style, Ambiguous-forms mode, Shade depth, text size, Greek face, the vmi/vmp Reference-panel "Show verb" dropdowns (display-only, call `renderRef()` not `build()`).

`seg()` takes an optional soft callback that runs instead of `build()`. Clear view doesn't go through `build()` at all — it zeroes session-scoped state directly, leaves deck/filters/archive/progress untouched.

## Panels and answer leakage

Panels **rebuilt from scratch on every answer** (deck-rail groups, per-deck
reference charts, archived-word groups, filter-chip blocks) must use
`foldable()`. Setting `.open` at render time fires a toggle event — a plain
listener would record that auto-open as a real user choice and the panel would
incorrectly stay open forever after. `foldable()` cancels the summary's default
action and toggles `.open` itself. Open-state lives in module-level maps
(`groupOpen`, `refGroupOpen`, `refOpen`, `archOpen`, `filtOpen`) since it can't
live in the DOM. Static `<details>` blocks written once in markup and never
re-created (`settingsPanel`, `statusPanel`, `archivedPanel`, the terms
glossary, `fontGuidePanel`) don't need this — a plain `.open =` set by JS is
safe on those.

Form→Parse prompts show no Greek lemma, no English gloss (case-marked glosses like "to/for the X" reveal the case), and no gender coloring — all three were found leaking the answer at various points. `colorOf()`/`COLOR` is where gender-based styling would be re-added if ever revisited; `COLOR` is currently empty. `--neut` CSS var is reused by the accuracy heat-map — don't delete it when touching gender colors.

## Greek-type font picker (2026-09-16)

Expanded from 5 to 10 Greek faces: added EB Garamond, Noto Serif, Old Standard TT,
Alegreya Sans, Arimo (keys `garamond`/`notoserif`/`oldstandard`/`alegreya`/`arimo`)
alongside the existing Gentium Book Plus (default)/Cardo/GFS Didot/GFS
Neohellenic/Noto Sans. Each new font is wired the same way the existing ones were:
one `&family=` entry on the Google Fonts `<link>`, one
`:root[data-grk="<key>"]{--grk:"<Font>","Gentium Book Plus",Georgia,serif}` rule,
one `<option>`. Weight/style request matches the existing fonts' pattern
(`:ital,wght@0,400;0,700;1,400`) for all 5 new ones; Noto Sans was already
`0,400;0,600;1,400` and was left alone.

The picker itself changed from a `.seg` button row (`#fontGentium` etc., toggled via
`aria-pressed`) to a single `<select id="fontSelect">` holding all 10 options;
`applyFont()` now reads `.value` instead of walking a `FONTS` array. `st.font==="gentium"`
still means "no `data-grk` attribute" — same default-face behavior as before. Still
doesn't call `build()`; Greek face was already a non-rebuilding toggle. This is the
first *static*-markup `<select>` in the file — the vmi/vmp word-set pickers are all
built dynamically in JS with the same `class="btn"` styling convention.

Added a static `<details id="fontGuidePanel">` (reuses the `.terms` dl/dt/dd CSS from
"What the terms mean" rather than new styling) listing all 10 fonts with a one-line
description and a live sample word (ἄνθρωπος) set in that font's own `font-family`, so
all 10 can be compared side by side regardless of which face is active site-wide. A
"What's the difference?" button next to the select opens the panel and scrolls to it.
No URL/hash routing exists anywhere in this app, so this in-page open-and-scroll is the
closest equivalent to a "route" within the current architecture.

`cards-data.js` untouched — this was a font/UI-only change, no card data involved.

Verified via headless Chromium: zero page errors on load; `#fontSelect` has exactly
10 options with the expected values; selecting each sets `data-grk` correctly (and
`gentium` removes the attribute, as before); computed `--grk` resolves to the right
stack; the guide button correctly opens the panel; the panel has exactly 10 entries.

## Validation

The data no longer needs extracting from the HTML — `cards-data.js` already is that
file. Validate it directly in Node, e.g.:

```bash
node -e "
require('./cards-data.js');
// or: eval(require('fs').readFileSync('cards-data.js','utf8'));
"
```

(`cards-data.js` declares plain top-level `var`s, so `require`ing it as CommonJS
attaches nothing to `module.exports` — either wrap it in an IIFE that returns the
names you need, or `eval` its source in a scope where you then read the globals.)

Check: row count = product of dim value counts, no duplicate slot keys, every dim value legal, form/gloss non-empty, no row where form equals one of its own dim values. For `NOUNSETS`: 3 words/paradigm, entry 0 = deck default, every array length 8, no duplicates, keys match `NOUN_PARADIGMS` 1:1. For `vmi`: 66 rows (11×6), `MI_VERBS` matches the deck's `pd` values 1:1. For `vmp`: 102 rows (17×6), `VMP_VERBS` matches 1:1. Pair with an accent-consistency check (Unicode NFD, strip accents, confirm the declined form's letters appear in its own sentence) whenever a form or sentence changes.

Render check: headless browser, assert no page errors, drive the UI and check actual behavior — a passing DOM assertion isn't proof a `st.filters`-backed control actually changed `st.queue`. For a new dropdown, click the relevant deck button first (state only renders once that deck is selected), then read `<select>` option counts/values; for a display-filter dropdown confirm the rendered table count actually changes on `change`. Regression-check every other verb deck still renders after touching `VERB_DECKS`/`VERBSETS`.

## Ideas, not authorized work

1. Anki export of vocab decks — offered, not taken up.
2. Chapters beyond 16, as taught — add deck data, standard process.
3. Context clauses for verb decks (beyond the five rotating decks' own sentences), 8 of the 11 μι Verbs, and 14 of the 17 Medio-Passive verbs (only each deck's original word(s) have sentences). Vocab isn't lesson-gated (all 403 words already taught); author as static data, no live generation; don't leak the answer via word order.
4. A second Prev/Next pair under the card, mobile-only — raised then dropped, revisit only if it comes back up.
5. Reconciling the two local clones described above so `~/koine-drill` can actually push — not started.
