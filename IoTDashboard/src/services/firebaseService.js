
import {
  ref,
  onValue,
  off,
  set,
  push,
  get,
  serverTimestamp,
  query,
  orderByChild,
  limitToLast,
} from 'firebase/database';
import { db } from '../config/firebase';

// ── 1. Escuchar cambios en tiempo real (/sensores) ────────────────────────────
/**
 * Suscribe un listener en tiempo real al nodo /sensores.
 * Devuelve una función `unsubscribe` para cancelar.
 *
 * @param {(data: object|null) => void} onData    
 * @param {(error: Error)     => void} onError   
 * @returns {() => void} unsubscribe
 */
export const listenSensores = (onData, onError) => {
  const sensoresRef = ref(db, 'sensores');

  onValue(
    sensoresRef,
    (snapshot) => {
      onData(snapshot.exists() ? snapshot.val() : null);
    },
    (error) => {
      onError?.(error);
    }
  );

  // Devuelve función de limpieza
  return () => off(sensoresRef, 'value');
};

// ── 2. Leer una sola vez (/sensores) ──────────────────────────────────────────
export const getSensoresOnce = async () => {
  const snapshot = await get(ref(db, 'sensores'));
  return snapshot.exists() ? snapshot.val() : null;
};

// ── 3. Escribir/actualizar datos de sensores ──────────────────────────────────
/**
 * Escribe datos en /sensores (sobreescribe el nodo completo).
 * Útil para simular datos desde la app o para dispositivos que
 * envíen al mismo nodo.
 */
export const setSensores = async (data) => {
  await set(ref(db, 'sensores'), {
    ...data,
    lastUpdate: Date.now(),
  });
};

// ── 4. Guardar snapshot en historial ─────────────────────────────────────────
/**
 * Agrega una entrada al nodo /historial con push (clave única automática).
 */
export const pushHistorial = async (data) => {
  await push(ref(db, 'historial'), {
    ...data,
    ts: Date.now(),
  });
};

// ── 5. Leer últimas N entradas del historial ──────────────────────────────────
export const getHistorial = async (limit = 20) => {
  const q = query(
    ref(db, 'historial'),
    orderByChild('ts'),
    limitToLast(limit)
  );
  const snapshot = await get(q);
  if (!snapshot.exists()) return [];

  // Convertir objeto a array ordenado por ts
  return Object.values(snapshot.val()).sort((a, b) => a.ts - b.ts);
};

// ── 6. Escuchar historial en tiempo real ──────────────────────────────────────
export const listenHistorial = (limit = 20, onData, onError) => {
  const q = query(
    ref(db, 'historial'),
    orderByChild('ts'),
    limitToLast(limit)
  );

  onValue(
    q,
    (snapshot) => {
      if (!snapshot.exists()) { onData([]); return; }
      const arr = Object.values(snapshot.val()).sort((a, b) => a.ts - b.ts);
      onData(arr);
    },
    (error) => onError?.(error)
  );

  return () => off(q, 'value');
};
