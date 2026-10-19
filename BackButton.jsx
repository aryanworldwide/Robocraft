import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useBackStack } from '@/hooks/useBackStack';

export default function BackButton({ className = '', label = 'Back' }) {
  const { canGoBack, goBack } = useBackStack();

  if (!canGoBack) return null;

  return (
    <button onClick={goBack} className={`flex items-center gap-1 text-sm text-muted-foreground hover:text-cyan-400 transition-colors ${className}`}>
      <ArrowLeft className="w-4 h-4" /> {label}
    </button>
  );
}
