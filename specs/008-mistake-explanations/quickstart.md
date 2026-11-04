# Quickstart: Mistake Explanations

## Prerequisites

`npm ci` (see the sandbox note in project memory if npm needs a cache dir), then:

```sh
npm test          # Vitest: unit + integration
npm run lint
npm run build     # type check + PWA build
npm run dev       # for the manual checks below
```

## Automated coverage

| Area | Test | Spec |
|------|------|------|
| Words, wrong pick, grammar block per exercise type | `tests/unit/explanations.test.ts` | FR-002–FR-005 |
| Every exercise gets ≥ 1 explanation line; every grammar exercise has a valid note; notes only there | `tests/unit/courseContent.test.ts` | SC-001, SC-002, FR-005 |
| `feedback.given` stored; scoring unchanged | `tests/unit/sessionSlice.test.ts` | FR-008 |
| Sheet shows explanation on wrong, nothing extra on right; same on retry | `tests/integration/lessonFlow.test.tsx` | FR-001, US1 |
| Mixed practice session names the exercise's own lesson | `tests/integration/practiceFlow.test.tsx` | FR-004, US2-2 |

## Manual checks (`npm run dev`, Chrome DevTools)

| # | Steps | Expected |
|---|-------|----------|
| S1 | Lesson 4 (You and I), on "group / community" pick **tomo** | Correct answer kulupu; "kulupu: group / community"; "tomo means house / building / room" |
| S2 | Lesson 4, "I am strong.": build **mi li wawa** | "mi wawa"; mi and wawa meanings; "mi and sina need no li", "Lesson 4 · You and I", the note |
| S3 | Any exercise answered right | Sheet as before: "pona! Correct." only |
| S4 | 360 px wide (DevTools device toolbar), the grammar exercise with the longest explanation | No horizontal scroll; explanation scrolls inside the sheet if needed; Continue visible and tappable |
| S5 | Practice session, miss a grammar exercise from a later lesson | Sheet names that exercise's lesson |
| S-D1 | Phone (iOS Safari or Android Chrome), S2 and S4 | Same as above, sheet clear of the home indicator |

Record results (or an owner waiver) in tasks.md.
