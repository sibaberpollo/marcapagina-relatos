import { useRef, useEffect, useState } from 'react';

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

export function useTurnstile(sitekey: string) {
  const captchaRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [attempts, setAttempts] = useState(0);
  const [isReady, setIsReady] = useState(false);

  // Función para inicializar Turnstile
  const initTurnstile = () => {
    console.log('Intentando inicializar Turnstile...', {
      turnstileExists: !!window.turnstile,
      captchaRefExists: !!captchaRef.current,
      widgetIdExists: !!widgetIdRef.current,
      isReady
    });
    
    // Solo intentar inicializar si tenemos todas las condiciones necesarias
    if (!window.turnstile) {
      console.log('Turnstile no está disponible en window, esperando...');
      return;
    }
    
    if (!captchaRef.current) {
      console.log('El ref del captcha no está disponible, esperando...');
      return;
    }
    
    if (widgetIdRef.current) {
      console.log('Ya existe un widget, se eliminará primero');
      try {
        window.turnstile.remove(widgetIdRef.current);
        widgetIdRef.current = null;
        // También limpiar el token al eliminar el widget
        setToken(null);
      } catch (error) {
        console.error('Error al eliminar widget existente:', error);
      }
    }
    
    // Pequeño retraso para asegurar que el DOM esté listo
    setTimeout(() => {
      if (window.turnstile && captchaRef.current && widgetIdRef.current === null) {
        console.log('Renderizando widget de Turnstile');
        try {
          const onTokenCallback = (t: string) => {
            console.log('Callback de Turnstile ejecutado con token:', t ? 'Token recibido' : 'Token vacío');
            // Guardar el token en el estado y también en sessionStorage como respaldo
            setToken(t);
            if (t) {
              try {
                sessionStorage.setItem('turnstileToken', t);
                console.log('Token guardado en sessionStorage');
              } catch (err) {
                console.error('Error al guardar token en sessionStorage', err);
              }
            }
          };
          
          const id = window.turnstile.render(captchaRef.current, {
            sitekey: sitekey,
            callback: onTokenCallback,
          });
          widgetIdRef.current = id;
          console.log('Widget de Turnstile renderizado con ID:', id);
          setIsReady(true);
          
          // Verificar si hay un token en sessionStorage que podamos recuperar
          try {
            const storedToken = sessionStorage.getItem('turnstileToken');
            if (storedToken && !token) {
              console.log('Recuperando token de sessionStorage');
              setToken(storedToken);
            }
          } catch (err) {
            console.error('Error al recuperar token de sessionStorage', err);
          }
        } catch (error) {
          console.error('Error al renderizar Turnstile:', error);
        }
      } else {
        console.log('No se puede inicializar Turnstile ahora, condiciones:', {
          turnstileExists: !!window.turnstile,
          captchaRefExists: !!captchaRef.current,
          widgetIdExists: !!widgetIdRef.current
        });
      }
    }, 500);
  };

  // Efecto para marcar el componente como listo después de que se monte
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setIsReady(true);
    }, 500);
    
    return () => clearTimeout(timeoutId);
  }, []);

  // Intentar inicializar Turnstile cuando el componente está listo y en intentos posteriores
  useEffect(() => {
    if (isReady && !token) {
      const timeoutId = setTimeout(() => {
        initTurnstile();
      }, Math.min(attempts * 500, 3000)); // Espera incremental entre intentos con un máximo
      
      return () => clearTimeout(timeoutId);
    }
  }, [isReady, attempts, token, sitekey]);

  // Si después de varios intentos no se inicializa, programar más intentos
  useEffect(() => {
    if (isReady && !token && attempts < 10) {
      const intervalId = setInterval(() => {
        setAttempts(prev => prev + 1);
      }, 2000);
      
      return () => clearInterval(intervalId);
    }
  }, [isReady, token, attempts]);

  const resetTurnstile = () => {
    if (widgetIdRef.current && window.turnstile) {
      try {
        window.turnstile.reset(widgetIdRef.current);
        setToken(null);
        // También limpiar el token en sessionStorage
        try {
          sessionStorage.removeItem('turnstileToken');
        } catch (err) {
          console.error('Error al eliminar token de sessionStorage', err);
        }
      } catch (error) {
        console.error('Error al resetear Turnstile:', error);
      }
    }
  };

  const removeTurnstile = () => {
    if (widgetIdRef.current && window.turnstile) {
      try {
        window.turnstile.remove(widgetIdRef.current);
        widgetIdRef.current = null;
        setToken(null);
        // También limpiar el token en sessionStorage
        try {
          sessionStorage.removeItem('turnstileToken');
        } catch (err) {
          console.error('Error al eliminar token de sessionStorage', err);
        }
      } catch (error) {
        console.error('Error al eliminar Turnstile:', error);
      }
    }
  };

  // Función para obtener el token manualmente (como respaldo)
  const getTokenManual = () => {
    // Intentar obtener el token de sessionStorage
    try {
      const storedToken = sessionStorage.getItem('turnstileToken');
      if (storedToken) {
        console.log('Obteniendo token de sessionStorage:', storedToken ? 'Token encontrado' : 'No hay token');
        setToken(storedToken);
        return storedToken;
      }
    } catch (err) {
      console.error('Error al obtener token de sessionStorage', err);
    }
    return token;
  };

  // Función para verificar e inicializar Turnstile
  const verificarTurnstile = () => {
    // Si ya existe un widget, removemos para recrearlo
    if (widgetIdRef.current && window.turnstile) {
      try {
        window.turnstile.remove(widgetIdRef.current);
        widgetIdRef.current = null;
      } catch (error) {
        console.error('Error al eliminar widget existente en verificarTurnstile:', error);
      }
    }
    
    // Tratar de inicializar
    if (window.turnstile && captchaRef.current) {
      initTurnstile();
      return true; // Éxito
    }
    return false; // Fallo
  };

  return { 
    captchaRef, 
    token,
    setToken,
    initTurnstile, 
    resetTurnstile, 
    removeTurnstile,
    verificarTurnstile,
    widgetIdRef,
    isReady,
    getTokenManual
  };
} 