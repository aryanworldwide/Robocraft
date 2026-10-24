# Protecting the app

Short version: an APK you hand to the public can always be opened, read and
changed by someone determined. Android has no setting that prevents it. What
follows is what actually raises the bar, in the order it is worth doing.

## What is already done

- **No secrets in the app.** The Firebase keys and the Worker URL are public
  identifiers by design — they identify the project, they do not grant access.
  What protects a student's data is the Firestore rules in
  `backend/firestore.rules`, which run on Google's servers where nobody can
  edit them. Someone who repackages the APK still cannot read another
  student's progress.
- **No source maps ship.** The JavaScript in the APK is minified, so the
  original file and variable names are not in it.
- **No backup of app data.** `android:allowBackup="false"` stops a phone's
  saved work from being pulled off over adb or into a cloud backup.
- **No plain HTTP.** `android:usesCleartextTraffic="false"`; the app serves its
  own files over https inside the WebView.

## What to do before publishing

1. **Publish through Google Play with Play App Signing.** This is the single
   most useful thing. Google holds the real signing key, so a modified copy of
   the app can never be installed as an update over yours, and Play will not
   serve a repackaged build to anyone. Keep the upload key private; if it ever
   leaks, Google can reset it without you losing the app.
2. **Only hand out release-signed APKs.** When `ANDROID_KEYSTORE_BASE64` is set
   in the repository secrets, the build signs the APK with your key. Without
   it the build falls back to a debug-signed APK, which is signed with a key
   everyone in the world has — anyone can change it and re-sign it, and it
   looks just as valid. Set the secret.
3. **Keep the keystore and its passwords out of the repository.** They belong
   in GitHub secrets, nowhere else.

## What is not worth doing

- **Code obfuscation (R8/ProGuard) on the Android shell.** The Java side of a
  Capacitor app is a thin wrapper around a WebView; the app itself is the
  JavaScript in `assets/public`, which R8 never touches. It would add real risk
  of breaking plugins at runtime in exchange for hiding almost nothing.
- **Heavy JavaScript obfuscation.** It slows the app on the cheap phones most
  students own, and anyone able to read minified code is not stopped by it.

## If you want to go further

**Play Integrity API** is the supported way to detect a repackaged or tampered
copy at runtime. The app asks Google for a signed verdict, your Cloudflare
Worker checks it, and the Worker refuses to answer AI requests when the verdict
says the app is not the genuine one from Play. It is free at the usual volumes
and it is the only check an attacker cannot simply patch out, because the
decision is made on your server rather than on the phone. It is a day of work
and it only matters once the app is popular enough for someone to bother.

## What none of this stops

Anyone can unzip an APK and read the HTML, CSS and JavaScript inside it. That
is true of every app built this way, including large commercial ones. Treat the
client as public, keep anything that must stay private on the server, and let
copyright — not technical measures — be what stops someone republishing the
app as their own.
