import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';

// Obtém ou cria uma sessão única para o navegador
const getSessionId = () => {
  let sessionId = localStorage.getItem('chefao_session_id');
  if (!sessionId) {
    sessionId = crypto.randomUUID();
    localStorage.setItem('chefao_session_id', sessionId);
  }
  return sessionId;
};

export const useTracker = () => {
  const location = useLocation();

  const trackEvent = async (eventType, metadata = {}) => {
    try {
      const sessionId = getSessionId();
      const { data: { session } } = await supabase.auth.getSession();
      
      await supabase.from('user_events').insert([{
        session_id: sessionId,
        user_id: session?.user?.id || null,
        event_type: eventType,
        page_url: window.location.pathname,
        item_name: metadata.itemName || null,
        metadata: {
          ...metadata,
          userAgent: navigator.userAgent,
          timestamp: new Date().toISOString()
        }
      }]);
    } catch (error) {
      // Falha silenciosa para não atrapalhar o usuário
    }
  };

  // Rastreia visualizações de página automaticamente ao mudar de rota
  useEffect(() => {
    trackEvent('page_view');
  }, [location.pathname]);

  return { trackEvent };
};
