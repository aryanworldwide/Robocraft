# RoboCraft — Code Review Notes

Collected file-by-file and reviewed. File names/locations follow what was given;
a few unlabelled files were named by matching their imports (all 197 source imports resolve).

Assumed names: `src/lib/safeReturnTo.js`, `src/lib/lab/experiments.js`,
`src/components/ui/radio-group.jsx` was pasted twice (the second copy may have been meant as `resizable.jsx`).
Missing: `public/` folder (e.g. `manifest.json` referenced by `index.html`) and `.env.local`.


## Fixed in this version

- Lesson page crash (`hasSpeech()` → `hasSpeech`) — `src/pages/LessonDetail.jsx`
- True/false quiz crash (adds True/False options) and quiz reshuffling every render — `src/pages/Quiz.jsx`
- Lost progress/XP from stale state (progress ref) — `src/lib/AppContext.jsx`
- Chapter notes PDF (`await makeDoc()`) — `src/lib/revision/exportRevisionPdf.js`
- `/reset-password` route added; offline no longer blocks the app (banner instead) — `src/App.jsx`
- Backend unreachable → guest mode still works — `src/lib/AuthContext.jsx`
- Register "Continue as Guest" — `src/pages/Register.jsx`
- Inter font `@import` moved to the top — `src/index.css`
- Pro Insight keyword matching is whole-word (47 distinct insights instead of 11) — `src/lib/lesson/parseTheory.js`
- Shared 5V/GND no longer flagged as a conflict — `src/lib/lab/freeBuild.js`
- Android app: Capacitor config, native PDF/file saving via share sheet, GitHub Actions APK build (see BUILD_APK.md)

Everything else below is still open.

## Critical — found in review

| # | File | Problem | Fix |
|---|------|---------|-----|
| 1 | `src/pages/LessonDetail.jsx` (line 104) | `hasSpeech()` called, but `hasSpeech` is a boolean → every lesson page crashes | `hidden: !hasSpeech` |
| 2 | `src/pages/Quiz.jsx` | True/false questions have no `options` → `.map` crash (89 questions, 29 lessons) | Treat `tf` as `['True','False']` |
| 3 | `src/lib/AppContext.jsx` | Several `updateProgress` calls per action use stale state → only the last write survives (lost lessons/XP, free mystery boxes) | Use a ref + `setProgress(prev => …)` |
| 4 | `src/lib/revision/exportRevisionPdf.js` (line 185) | `makeDoc()` not awaited → lesson notes PDF never downloads | `const pdf = await makeDoc();` |
| 5 | `src/App.jsx` | No `/reset-password` route → reset email links 404 | Add route for `ResetPassword` |
| 6 | `src/lib/lab/freeBuild.js` | Shared 5V/GND flagged as error; "Help Me Build" wires motor straight to Arduino pins, sensor to VIN, LED cathode to D1 | Allow shared power rails; route motors via driver, power via 5V/3V3 |
| 7 | `src/pages/Settings.jsx` | "Delete Account" only clears local data (Google Play requires real deletion) | Call a backend delete function |

## Important

- `src/pages/Quiz.jsx` / `LessonDetail.jsx`: `getQuizForLesson` returns a new array every render → quiz reshuffles; "Retry wrong" shows random questions. Memoise on `[selectedClass, id]`.
- `src/lib/AppContext.jsx`: `robocraft_data` is not in `base44/entities/User.jsonc` → cross-device sync silently fails.
- `src/lib/lesson/parseTheory.js`: substring keyword match (`can`, `power`, `sensor`…) → 11 generic insights reused across 94 lessons (43× "sensor readings…"). Use whole-word match or per-lesson `notes`.
- `src/lib/curriculum/quizGenerator.js`: correct answer always option 0 (fine in Quiz page which shuffles; not in revision PDF answer key); distractors from other lessons.
- `src/lib/gamification.js`: "Game On" badge awarded immediately; "Card Master" after one deck; "Fast Learner" unreachable; weekly missions never recorded; "Earn 100 XP Today" uses total XP; dates in UTC.
- `src/pages/Register.jsx`: "Continue as Guest" doesn't call `continueAsGuest()`.
- `src/App.jsx`: offline → whole app replaced by OfflineScreen even though lessons are local.
- `src/index.css`: Google Fonts `@import` after `@tailwind` → ignored by browsers; move to line 1.
- `src/lib/lab/*`: three separate experiment systems and four component libraries with different pin names; simulations ignore actual wiring; ESP32 code uses `Servo.h` and `A34`.
- `src/lib/buildsheet/*` + `src/lib/circuit/*`: diagram lacks pins used by 19/22 projects; `validateCircuit` false warnings; `sanitizeCode` strips `#include <time.h>`; frontend cache uses `asServiceRole`.

## Safety (students under 18)

- `pinMaps` / `extraProjects`: A4988 VDD on 12V; 5V IR array into ESP32 inputs; ESP32 GPIO12 strapping pin; mains wiring in a Class 10 project; drone on LiPo via `analogWrite`.
- `buildChallenges.js`: LED on D13 without resistor (its own tip says to use one).

## Smaller

- Lowercase "class 9" (`replace('_',' ')`) in Layout/Home/Learn/Progress/Search.
- Two badge systems (Home vs Progress page).
- Splash: 2.5 s cap cuts first-launch animation; navigation without `replace`.
- Engineering Challenges: no back button from an open challenge; no class filtering.
- Revision Mode: typing the first 4 letters counts as correct; unstarted lessons marked "weak".
- `realWorldData.js`: Lifts icon is the text " elevator".
- `FinalStage`: Perseverance "millions of km" claim is wrong.
