# Koine Drill — maintenance notes

Self-contained HTML flashcard app. Project notes report 26 decks: 22 paradigms (295 slots) + 403 vocabulary words, covering Biblingo lessons 1–16.

## Hosting and sync: verify against the code

Hosting is being moved from the claude.ai Artifact to GitHub + Cloudflare (2026-09-12). The supplied notes say sync was rewritten to a general mechanism, but the HTML inspected during hosting setup still used `window.claude.use("db")`, with browser-local storage as its fallback. Treat the sync rewrite as **unverified** until the current repository code proves otherwise. Read the actual code before touching sync behavior; these notes do not yet document a general sync implementation.

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

`CLAUSES` holds example sentences keyed `<deckId>|<dim>|<dim>|...`. `NOUNSETS` holds per-paradigm word lists for n1/n2/n3 (up to 3 words each, `{g, f:[8 forms], ex:[8 sentences], exEn:[8 glosses]}`, one slot per case×number). `NOUN_PARADIGMS` drives the dropdown labels. `VERBSETS`/`VERB_DECKS` are the verb-side counterpart for the six rotating verb decks only (μι Verbs is excluded — its 3 verbs never rotate).

Adding a word to `NOUNSETS`: cap at 3 words per paradigm, all already taught (check lesson PDFs + `WORDS`/`VOCAB`). Write all 8 sentences (one per case×number slot) using the accent rules below.

## Stable progress IDs

Forward (Parse→Form): `<deck>|F|<dim values>`. Reverse (Form→Parse): `<deck>|R|<dim values of every row this form covers, joined by ~>` — not the form itself, because rotating decks change forms every session and keying by form would throw away scheduling. Anything touching progress records must build the id this same way.

## Greek language checks

- Oxytone words take a grave instead of acute when not sentence-final, full acute when they are (θεός → θεὸς mid-clause).
- Paroxytone/proparoxytone/circumflex-accented words never shift.
- Neuter-plural subjects take a singular verb.
- Monosyllabic 3rd-declension nouns (e.g. σάρξ) take accent-on-ultima in oblique cases.

## Filters and queue behavior

`passesFilter(c)` opens with `if(!singleDeck()) return true` — no filter chip and no control built on `st.filters` has ever narrowed anything except while that exact single deck (not "All decks", not a group) is selected. Before adding a new filter-backed control, check whether it mutates row data directly (`rollNouns()`/`rollVerbs()` — safe at any scope) or filters existing rows (`st.filters` — safe ONLY at the exact single deck). Verify against the actual built queue (`st.queue`), not just DOM/UI state — a control can render correctly and still do nothing.

Rebuild = reshuffles queue, throws away current card. Only toggles that change which cards exist should do this.

Rebuilds: Drill direction, Session (Due/Full), deck buttons, filter chips, Reset progress, Archive/Restore toggle, per-deck reset, noun/verb word-set dropdowns.

Does not rebuild: Answer by (Recall/Reveal), Stop-after timer, Missed cards toggle, Word highlight style, Ambiguous-forms mode, Shade depth, text size, Greek face.

`seg()` takes an optional soft callback that runs instead of `build()`. Clear view doesn't go through `build()` at all — it zeroes session-scoped state directly, leaves deck/filters/archive/progress untouched.

## Panels and answer leakage

Panels rebuilt from scratch on every answer (deck-rail groups, per-deck reference charts, archived-word groups, filter-chip blocks) must use `foldable()`. Setting `.open` at render time fires a toggle event — a plain listener would record that auto-open as a real user choice and the panel would incorrectly stay open forever after. `foldable()` cancels the summary's default action and toggles `.open` itself. Open-state lives in module-level maps (`groupOpen`, `refGroupOpen`, `refOpen`, `archOpen`, `filtOpen`) since it can't live in the DOM.

Form→Parse prompts show no Greek lemma, no English gloss (case-marked glosses like "to/for the X" reveal the case), and no gender coloring — all three were found leaking the answer at various points. `colorOf()`/`COLOR` is where gender-based styling would be re-added if ever revisited; `COLOR` is currently empty. `--neut` CSS var is reused by the accuracy heat-map — don't delete it when touching gender colors.

## Validation

Extract the data block by marker, not line number. This example uses Bash:

```bash
A=$(grep -n '^  var CASES' koine-drill.html | cut -d: -f1)
B=$(( $(grep -n '// ENGINE' koine-drill.html | cut -d: -f1) - 2 ))
sed -n "${A},${B}p" koine-drill.html > data.js
echo 'module.exports={DECKS,VOCAB,VOCAB2,WORDS,CLAUSES,NOUNSETS,NOUN_PARADIGMS};' >> data.js
```

Check in Node: row count = product of dim value counts, no duplicate slot keys, every dim value legal, form/gloss non-empty, no row where form equals one of its own dim values. For `NOUNSETS`: 3 words/paradigm, entry 0 = deck default, every array length 8, no duplicates, keys match `NOUN_PARADIGMS` 1:1. Pair with an accent-consistency check (Unicode NFD, strip accents, confirm the declined form's letters appear in its own sentence) whenever a form or sentence changes.

Render check: headless browser, assert no page errors, drive the UI and check actual behavior — a passing DOM assertion isn't proof a `st.filters`-backed control actually changed `st.queue`.

## Ideas, not authorized work

1. Anki export of vocab decks — offered, not taken up.
2. Chapters beyond 16, as taught — add deck data, standard process.
3. Context clauses for verb decks (beyond the six rotating decks' own sentences) and μι Verbs. Vocab isn't lesson-gated (all 403 words already taught); author as static data, no live generation; don't leak the answer via word order.
4. A second Prev/Next pair under the card, mobile-only — raised then dropped, revisit only if it comes back up.
