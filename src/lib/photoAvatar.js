// The "your own photo" avatar.
//
// The picture never leaves the phone. It is shrunk to a small square, stored
// on the device only, and shown only to the student who chose it — the
// leaderboard, which other students can see, always falls back to an emoji.
// Nothing is uploaded, nothing is synced, and no copy exists on any server.

const KEY = 'robocraft_avatar_photo';
const SIZE = 160;           // enough for a crisp 40px badge on any screen
const MAX_SOURCE_BYTES = 12 * 1024 * 1024;

/** The saved photo as a data URL, or null. */
export function getPhotoAvatar() {
  try { return localStorage.getItem(KEY); } catch { return null; }
}

export function clearPhotoAvatar() {
  try { localStorage.removeItem(KEY); } catch { /* nothing to clear */ }
}

/**
 * Shrink a chosen image to a centred square and keep it on the device.
 * Resolves to the data URL, or rejects with a message worth showing.
 */
export function savePhotoAvatar(file) {
  return new Promise((resolve, reject) => {
    if (!file) return reject(new Error('No picture chosen.'));
    if (!/^image\//.test(file.type)) return reject(new Error('That file is not a picture.'));
    if (file.size > MAX_SOURCE_BYTES) return reject(new Error('That picture is very large. Try one under 12 MB.'));

    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      try {
        // Centre-crop to a square so faces are not squashed.
        const side = Math.min(img.width, img.height);
        const sx = (img.width - side) / 2, sy = (img.height - side) / 2;
        const canvas = document.createElement('canvas');
        canvas.width = SIZE; canvas.height = SIZE;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, sx, sy, side, side, 0, 0, SIZE, SIZE);
        const data = canvas.toDataURL('image/jpeg', 0.82);
        try {
          localStorage.setItem(KEY, data);
        } catch {
          return reject(new Error('This device has no room left to save the picture.'));
        }
        resolve(data);
      } catch {
        reject(new Error('That picture could not be read.'));
      } finally {
        URL.revokeObjectURL(url);
      }
    };
    img.onerror = () => { URL.revokeObjectURL(url); reject(new Error('That picture could not be opened.')); };
    img.src = url;
  });
}
