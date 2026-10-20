import React from 'react';
import { Info } from 'lucide-react';

// Shown on the login / sign-up screens while accounts aren't switched on yet.
export default function AccountsComingSoon() {
  return (
    <div className="p-4 rounded-xl glass border border-cyan-500/20 text-sm flex gap-3 items-start">
      <Info className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" />
      <div>
        <p className="font-semibold text-foreground mb-1">Accounts are coming soon</p>
        <p className="text-muted-foreground text-xs leading-relaxed">
          Tap <b className="text-foreground">Continue as Guest</b> to use every lesson, quiz, project and the lab.
          Your progress is saved on this device.
        </p>
      </div>
    </div>
  );
}
