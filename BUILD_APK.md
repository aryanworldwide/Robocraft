# Build the RoboCraft Android APK

This project is set up with **Capacitor**, which packs the web app into a real
Android app. Lessons, quizzes, flashcards, the lab and progress are bundled
inside the APK and work offline. Login and AI features (Mentor, AI project
search, voice) call your hosted backend and need internet + the env values below.

## Option A — No software needed (GitHub builds it for you)

1. Create a free GitHub account and a new **private** repository.
2. Upload this whole folder to it (GitHub web: "Add file → Upload files", drag the
   unzipped folder contents in, including the hidden `.github` folder).
3. (Optional, for login/AI) Repo → Settings → Secrets and variables → Actions → add:
   - `VITE_APP_ID` — your app ID
   - `VITE_API_URL` — your hosted app URL
4. Go to the **Actions** tab → "Build Android APK" → wait ~6 minutes.
5. Open the finished run → **Artifacts → robocraft-apk** → download, unzip, install
   `app-debug.apk` on your phone (allow "Install unknown apps").

## Option B — On your own computer

Needs Node.js 20+ and Android Studio (which includes the Android SDK and Java).

```bash
npm install
cp .env.example .env.local      # fill in your values
npm run build
npx cap add android             # first time only
npx cap sync android
npx cap open android            # Android Studio → Build → Build APK(s)
```

## Notes

- The APK built this way is a **debug** build: fine for testing and sharing.
  For the Play Store, build a signed release (Android Studio → Build → Generate
  Signed Bundle) with your own keystore.
- Package id: `com.robocraft.learn` (change in `capacitor.config.json`). It is
  different from the old Appilix app (`app.base.app`), so both can be installed.
- App icon: Capacitor's default. To use your logo, put a 1024×1024 `icon.png` in
  an `assets/` folder and run `npx @capacitor/assets generate --android`.
- PDFs and `.ino` downloads open Android's share sheet (save to Files/Drive).
- "Listen" (text-to-speech) is hidden in the Android WebView, which has no
  speech engine.
