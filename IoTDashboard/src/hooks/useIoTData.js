// src/hooks/useIoTData.js
import { useState, useEffect, useRef, useCallback } from 'react';
import { fetchIoTData } from '../services/apiService';

/**
 * Hook personalizado para consumir datos IoT con polling automático.
 *
 * @param {string} endpoint  - Ruta del endpoint (ej: '/sensors/status')
 * @param {number} interval  - Intervalo de refresco en ms (default: 5000)
 * @param {boolean} enabled  - Si es false, detiene el polling
 *
 * @returns {{ data, loading, error, lastUpdate, fetchCount, refetch, reset }}
 */
const useIoTData = (endpoint, interval = 5000, enabled = true) => {
  const [data, setData]           = useState(null);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState(null);
  const [lastUpdate, setLastUpdate] = useState(null);
  const [fetchCount, setFetchCount] = useState(0);

  const timerRef  = useRef(null);
  const abortRef  = useRef(null);
  const mountedRef = useRef(true); // Evita setState en componentes desmontados

  // ── Función principal de fetch ─────────────────────────────────────────────
  const fetchData = useCallback(async () => {
    if (!enabled) return;

    // Cancela la petición anterior si todavía está en vuelo
    abortRef.current?.abort();
    abortRef.current = new AbortController();

    try {
      setLoading(true);

      const result = await fetchIoTData(endpoint, {
        signal: abortRef.current.signal,
      });

      if (!mountedRef.current) return; // Componente desmontado, ignorar

      setData(result);
      setError(null);
      setLastUpdate(new Date());
      setFetchCount((c) => c + 1);
    } catch (err) {
      if (!mountedRef.current) return;
      if (err.name === 'AbortError') return; // Cancelado intencionalmente

      setError(err.message ?? 'Error desconocido');
    } finally {
      if (mountedRef.current) setLoading(false);
    }
  }, [endpoint, enabled]);

  // ── Efecto: arrancar polling y limpiar al desmontar ────────────────────────
  useEffect(() => {
    mountedRef.current = true;

    fetchData(); // Fetch inmediato al montar

    if (enabled) {
      timerRef.current = setInterval(fetchData, interval);
    }

    return () => {
      mountedRef.current = false;
      clearInterval(timerRef.current);
      abortRef.current?.abort();
    };
  }, [fetchData, interval, enabled]);

  // ── Reset manual del estado ────────────────────────────────────────────────
  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setFetchCount(0);
    setLastUpdate(null);
  }, []);

  return {
    data,
    loading,
    error,
    lastUpdate,
    fetchCount,
    refetch: fetchData, // Permite refrescar manualmente
    reset,
  };
};

export default useIoTData;
