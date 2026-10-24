import React from 'react';
import { equippedItems } from '@/lib/gamification';
import { getPhotoAvatar } from '@/lib/photoAvatar';

/**
 * A student's avatar inside their equipped frame.
 * The photo, when they have chosen one, is read from this device — it is never
 * synced and never shown to anyone else.
 */
export default function AvatarBadge({ progress, size = 48, fallback = null }) {
  const { avatar, frame } = equippedItems(progress);
  const chosen = progress?.shop?.avatar;
  const photo = avatar?.photo ? getPhotoAvatar() : null;

  if (!chosen && fallback) {
    // Nothing bought yet: keep the app's own mark, still inside the ring.
    return (
      <div className="rounded-full p-[3px] shrink-0" style={{ width: size, height: size, background: frame?.value || 'transparent' }}>
        <div className="w-full h-full rounded-full glass-strong flex items-center justify-center overflow-hidden">{fallback}</div>
      </div>
    );
  }

  return (
    <div className="rounded-full p-[3px] shrink-0" style={{ width: size, height: size, background: frame?.value || 'transparent' }}>
      <div className="w-full h-full rounded-full glass-strong flex items-center justify-center overflow-hidden" style={{ fontSize: size * 0.5 }}>
        {photo
          ? <img src={photo} alt="" className="w-full h-full object-cover rounded-full" />
          : <span aria-hidden>{avatar?.emoji || '🤖'}</span>}
      </div>
    </div>
  );
}
