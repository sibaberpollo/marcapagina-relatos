import { useRef, useState } from 'react';

// Definición global para TypeScript
declare global {
  interface Window {
    turnstile: {
      render: (
        container: HTMLElement,
        options: { sitekey: string; callback: (token: string) => void }
      ) => string
      reset: (widgetId: string) => void
      remove: (widgetId: string) => void
    }
  }
}

// Evitar múltiples inicializaciones con una variable global
let isInitialized = false;

export function useTurnstile(sitekey: string) {
  const captchaRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | null>(null);
  const [token, setToken] = useState<string | null>(null);

  // Función simple para inicializar Turnstile solo una vez por instancia
  const initTurnstile = () => {
    // Si no hay un elemento ref o ya hay un widget, no continuar
    if (!captchaRef.current || widgetIdRef.current !== null || isInitialized) {
      return;
    }

    // Marcar como inicializado
    isInitialized = true;
    
    // Solo inicializar si el API de Turnstile está disponible
    if (window.turnstile) {
      try {
        const id = window.turnstile.render(captchaRef.current, {
          sitekey: sitekey,
          callback: t => setToken(t),
        });
        widgetIdRef.current = id;
        console.log('Turnstile inicializado correctamente');
      } catch (error) {
        console.error('Error al inicializar Turnstile:', error);
        isInitialized = false; // Resetear si hay un error
      }
    }
  };

  // Resetear el widget de Turnstile
  const resetTurnstile = () => {
    if (widgetIdRef.current && window.turnstile) {
      try {
        window.turnstile.reset(widgetIdRef.current);
        setToken(null);
      } catch (error) {
        console.error('Error al resetear Turnstile:', error);
      }
    }
  };

  // Eliminar el widget de Turnstile
  const removeTurnstile = () => {
    if (widgetIdRef.current && window.turnstile) {
      try {
        window.turnstile.remove(widgetIdRef.current);
        widgetIdRef.current = null;
        setToken(null);
        isInitialized = false; // Permitir reinicializar
      } catch (error) {
        console.error('Error al eliminar Turnstile:', error);
      }
    }
  };

  // Función de verificación para desarrollo
  const simulateVerification = () => {
    if (process.env.NODE_ENV === 'development') {
      setToken('dev_simulated_token_for_testing');
      return true;
    }
    return false;
  };

  return { 
    captchaRef, 
    token,
    setToken,
    initTurnstile, 
    resetTurnstile, 
    removeTurnstile,
    widgetIdRef,
    simulateVerification
  };
} 