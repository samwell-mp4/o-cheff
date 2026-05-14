import React from 'react';
import { useTracker } from '../hooks/useTracker';

const EventTracker = () => {
  // O hook useTracker já possui um useEffect que monitora visualizações de página
  useTracker();
  
  return null; // Componente invisível
};

export default EventTracker;
