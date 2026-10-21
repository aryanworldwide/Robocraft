# RoboCraft

**Learn Robotics. Build Robots. Control Them.**

## 📲 Get the app

| | |
|---|---|
| **🤖 Android** | [**⬇️ Download RoboCraft.apk**](https://github.com/aryanworldwide/Robocraft/releases/latest/download/RoboCraft.apk) |
| **🍎 iPhone / iPad** | [**▶️ Open RoboCraft**](https://aryanworldwide.github.io/Robocraft/) then add it to your Home Screen |
| **💻 Laptop / any browser** | [**▶️ Open RoboCraft**](https://aryanworldwide.github.io/Robocraft/) |

### Android: install
1. Tap **Download RoboCraft.apk** and open the downloaded file.
2. If asked, allow **Install unknown apps** for your browser, then tap **Install**.
3. If Play Protect warns you, tap **More details → Install anyway**.

### iPhone: install
1. Open the link in **Safari**.
2. Tap the **Share** button (square with an arrow ⬆️, in the bottom bar — on iOS 26 tap **•••** first).
3. Tap **Add to Home Screen → Add**. RoboCraft appears on your home screen and works offline.

---

A robotics learning app for Class 9–11 students: lessons, quizzes, flashcards,
a virtual circuit lab, Arduino/ESP32 projects, revision PDFs and an AI mentor.

Built with React, Vite and Tailwind CSS, packaged for Android with Capacitor.

## Features

- 105 chapters for Classes 9–11 covering the CISCE syllabus (ICSE IX–X Robotics & AI, ISC XI Robotics)
- Full textbook notes in every chapter with 71 labelled diagrams, key terms and a Diagram Bank
- Exam Corner (525 board-style questions with model answers) and timed sample papers with PDF answer keys
- Quizzes, flashcards, games, revision mode and chapter-notes PDFs
- Story map, reward shop, weekly leaderboard, daily reminders and in-app Python practice
- 22 build projects with wiring tables, Arduino/ESP32 code and build sheets
- Virtual circuit lab with simulation
- Accounts with cloud-saved progress (or guest mode, saved on the device)
- AI: RoboMentor chat, "explain simpler", AI podcast, AI project creator, lab helper — with study-only safety rules
- Works offline for lessons, quizzes and the lab

## How it runs (all free)

- **Accounts & cloud progress:** Firebase · **AI:** Cloudflare Workers AI (`backend/worker.js`) · **Voice:** the device's own text-to-speech
- Settings live in `src/config/services.js`; see [BUILD_APK.md](BUILD_APK.md) for details.

## Run locally

```bash
npm install
npm run dev
```

## Build

```bash
npm run build                # web build → dist/
```

Android APK: see [BUILD_APK.md](BUILD_APK.md). Pushing to `main` also builds the
APK automatically with GitHub Actions (Actions tab → Artifacts).

## Project layout

- `src/pages` — screens (Home, Learn, Lesson, Quiz, Projects, Lab, Revision…)
- `src/components` — UI, lab, lesson, learning and splash components
- `src/lib/curriculum` — all lesson, quiz and project content (works offline)
- `src/lib/lab`, `src/lib/circuit`, `src/lib/buildsheet` — circuit lab, wiring and build sheets
- `backend-schema` — data model for the hosted backend
