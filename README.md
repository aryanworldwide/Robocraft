# RoboCraft

**Learn Robotics. Build Robots. Control Them.**

A robotics learning app for Class 9–11 students: lessons, quizzes, flashcards,
a virtual circuit lab, Arduino/ESP32 projects, revision PDFs and an AI mentor.

Built with React, Vite and Tailwind CSS, packaged for Android with Capacitor.

## Run locally

```bash
npm install
cp .env.example .env.local   # fill in your values
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
