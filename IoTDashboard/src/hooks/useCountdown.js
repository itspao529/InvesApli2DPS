// src/hooks/useCountdown.js
import { useState, useEffect, useRef } from 'react';

/**
 * Hook que devuelve el progreso (0–1) hacia el próximo fetch.
 * @param {number} interval  - Igual que el intervalo de useIoTData (ms)
 * @param {number} fetchCount - Cambia con cada fetch para reiniciar el timer
 */
const useCountdown = (interval = 5000, fetchCount = 0) => {
  const [progress, setProgress] = useState(1);
  const startRef = useRef(Date.now());

  useEffect(() => {
    startRef.current = Date.now();
    setProgress(1);

    const tick = setInterval(() => {
      const elapsed = Date.now() - startRef.current;
      const remaining = Math.max(0, 1 - elapsed / interval);
      setProgress(remaining);
    }, 100);

    return () => clearInterval(tick);
  }, [fetchCount, interval]);

  return progress; // 1.0 → 0.0
};

export default useCountdown;
