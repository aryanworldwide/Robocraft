import React from 'react';
import TinkercadLab from '@/components/lab/tinkercad/TinkercadLab';

export default function Lab() {
  return <TinkercadLab onExit={() => window.history.back()} />;
}
