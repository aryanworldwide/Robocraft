import React from 'react';
import { useNavigate } from 'react-router-dom';
import TinkercadLab from '@/components/lab/tinkercad/TinkercadLab';

export default function Lab() {
  const navigate = useNavigate();
  // Go back inside the app; if the Lab was opened directly (shared link), go Home.
  const exit = () => ((window.history.state?.idx ?? 0) > 0 ? navigate(-1) : navigate('/'));
  return <TinkercadLab onExit={exit} />;
}
