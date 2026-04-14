
import { useState, useEffect, useRef, useCallback } from 'react';
import { listenSensores, pushHistorial } from '../services/firebaseService';

const FIREBASE_CONFIGURED =
  !['TU_API_KEY', '', undefined].includes(
    process.env.FIREBASE_API_KEY ?? 'TU_API_KEY'
  );

/**
 * @param {object}  options
 * @param {boolean} options.saveHistorial       - Guardar cada update en /historial
 * @param {number}  options.historialInterval   - Cada cuántos ms guardar (ms, default 30000)
 *
 * @returns {{ data, loading, error, connected, updateCount, lastUpdate }}
 */
const useFirebaseIoT = ({
  saveHistorial     = false,
  historialInterval = 30_000,
} = {}) => {
  const [data,        setData]        = useState(null);
  const [loading,     setLoading]     = useState(true);
  const [error,       setError]       = useState(null);
  const [connected,   setConnected]   = useState(false);
  const [updateCount, setUpdateCount] = useState(0);
  const [lastUpdate,  setLastUpdate]  = useState(null);

  const lastHistorialRef = useRef(0);
  const unsubRef         = useRef(null);

  const handleData = useCallback((incoming) => {
    if (!incoming) return;

    setData(incoming);
    setLoading(false);
    setError(null);
    setConnected(true);
    setLastUpdate(new Date());
    setUpdateCount((c) => c + 1);

    // Guardar en historial según intervalo
    if (saveHistorial) {
      const now = Date.now();
      if (now - lastHistorialRef.current >= historialInterval) {
        lastHistorialRef.current = now;
        pushHistorial(incoming).catch(console.warn);
      }
    }
  }, [saveHistorial, historialInterval]);

  const handleError = useCallback((err) => {
    setError(err.message ?? 'Error de Firebase');
    setConnected(false);
    setLoading(false);
  }, []);

  useEffect(() => {
    setLoading(true);

    try {
      // Suscribir listener en tiempo real
      unsubRef.current = listenSensores(handleData, handleError);
    } catch (err) {
      handleError(err);
    }

    return () => {
      unsubRef.current?.();
    };
  }, [handleData, handleError]);

  return { data, loading, error, connected, updateCount, lastUpdate };
};

export default useFirebaseIoT;
