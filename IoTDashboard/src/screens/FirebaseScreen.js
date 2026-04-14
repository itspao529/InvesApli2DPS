// src/screens/FirebaseScreen.js
import React, { useState, useCallback } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, ActivityIndicator, RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import useFirebaseIoT   from '../hooks/useFirebaseIoT';
import useCountdown     from '../hooks/useCountdown';
import MetricCard       from '../components/MetricCard';
import LogViewer        from '../components/LogViewer';
import { setSensores, getHistorial } from '../services/firebaseService';
import { COLORS, FONTS, SPACING }    from '../theme';

export default function FirebaseScreen() {
  const [logs,     setLogs]     = useState([]);
  const [history,  setHistory]  = useState([]);
  const [simMode,  setSimMode]  = useState(false);

  // ── Firebase hook ────────────────────────────────────────────────────────
  const { data, loading, error, connected, updateCount, lastUpdate } =
    useFirebaseIoT({ saveHistorial: true, historialInterval: 15_000 });

  // ── Log de cada actualización ────────────────────────────────────────────
  const addLog = useCallback((msg, type = 'info') => {
    const time = new Date().toLocaleTimeString('es', {
      hour: '2-digit', minute: '2-digit', second: '2-digit',
    });
    setLogs((p) => [...p.slice(-29), { time, message: msg, type }]);
  }, []);

  React.useEffect(() => {
    if (updateCount > 0) {
      addLog(`onValue → /sensores actualizado (#${updateCount})`, 'ok');
    }
  }, [updateCount]);

  React.useEffect(() => {
    if (error) addLog(`Firebase error: ${error}`, 'error');
  }, [error]);

  // ── Simular escritura a Firebase (demo sin sensor físico) ────────────────
  const simulateWrite = async () => {
    const fake = {
      temperatura: +(18 + Math.random() * 17).toFixed(1),
      humedad:     +(30 + Math.random() * 60).toFixed(1),
      presion:     +(990 + Math.random() * 35).toFixed(1),
      cpu:         +(10 + Math.random() * 85).toFixed(1),
      memoria:     +(20 + Math.random() * 65).toFixed(1),
      bateria:     +(50 + Math.random() * 50).toFixed(1),
    };
    try {
      await setSensores(fake);
      addLog('set /sensores → OK (datos simulados)', 'ok');
    } catch (e) {
      addLog(`set /sensores → Error: ${e.message}`, 'error');
    }
  };

  // ── Cargar historial ─────────────────────────────────────────────────────
  const loadHistory = async () => {
    try {
      const h = await getHistorial(10);
      setHistory(h);
      addLog(`Historial cargado: ${h.length} entradas`, 'info');
    } catch (e) {
      addLog(`Historial error: ${e.message}`, 'error');
    }
  };

  // ── Estado visual de conexión ────────────────────────────────────────────
  const connColor = error ? COLORS.error : connected ? COLORS.success : COLORS.warning;
  const connLabel = error ? 'Error' : connected ? 'Conectado' : 'Conectando...';

  const timeStr = lastUpdate
    ? lastUpdate.toLocaleTimeString('es', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
    : '--:--:--';

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl refreshing={loading} tintColor={COLORS.accent} />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>Firebase IoT</Text>
            <Text style={styles.subtitle}>Realtime Database — push listener</Text>
          </View>
          <View style={[styles.connBadge, { borderColor: connColor }]}>
            <View style={[styles.connDot, { backgroundColor: connColor }]} />
            <Text style={[styles.connText, { color: connColor }]}>{connLabel}</Text>
          </View>
        </View>

        {/* Info row */}
        <View style={styles.infoRow}>
          <Text style={styles.infoText}>
            {updateCount} actualizaciones · {timeStr}
          </Text>
          <Text style={styles.infoText}>
            Modo: <Text style={{ color: COLORS.accent }}>onValue (push)</Text>
          </Text>
        </View>

        {/* Loading state */}
        {loading && !data && (
          <View style={styles.loadingBox}>
            <ActivityIndicator color={COLORS.accent} />
            <Text style={styles.loadingText}>
              Esperando datos de Firebase...
            </Text>
          </View>
        )}

        {/* Error state */}
        {error && (
          <View style={styles.errorBox}>
            <Text style={styles.errorTitle}>⚠ Error de Firebase</Text>
            <Text style={styles.errorText}>{error}</Text>
            <Text style={styles.errorHint}>
              Verifica tus credenciales en{' '}
              <Text style={{ color: COLORS.accent }}>src/config/firebase.js</Text>
            </Text>
          </View>
        )}

        {/* Métricas en tiempo real */}
        {data && (
          <>
            <Text style={styles.sectionLabel}>AMBIENTE — /sensores</Text>
            <View style={styles.row}>
              <MetricCard label="Temperatura" value={data.temperatura} unit="°C" color={COLORS.info} />
              <MetricCard label="Humedad"     value={data.humedad}     unit="%" color={COLORS.accentAlt} />
              <MetricCard label="Presión"     value={data.presion}     unit=" hPa" color={COLORS.warning} />
            </View>

            <Text style={[styles.sectionLabel, { marginTop: 14 }]}>SISTEMA</Text>
            <View style={styles.row}>
              <MetricCard label="CPU"     value={data.cpu}     unit="%" color={COLORS.error} />
              <MetricCard label="Memoria" value={data.memoria} unit="%" color={COLORS.success} />
              <MetricCard label="Batería" value={data.bateria} unit="%" color={COLORS.accent} />
            </View>
          </>
        )}

        {/* Acciones */}
        <View style={styles.actions}>
          <TouchableOpacity style={styles.btn} onPress={simulateWrite}>
            <Text style={styles.btnText}>↑ Escribir datos</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.btn, styles.btnSecondary]} onPress={loadHistory}>
            <Text style={[styles.btnText, { color: COLORS.textMuted }]}>📋 Ver historial</Text>
          </TouchableOpacity>
        </View>

        {/* Historial */}
        {history.length > 0 && (
          <View style={styles.historialBox}>
            <Text style={styles.sectionLabel}>HISTORIAL — /historial</Text>
            {history.slice(-5).reverse().map((entry, i) => (
              <View key={i} style={styles.histEntry}>
                <Text style={styles.histTime}>
                  {new Date(entry.ts).toLocaleTimeString('es')}
                </Text>
                <Text style={styles.histData}>
                  {entry.temperatura}°C · {entry.humedad}% · {entry.presion} hPa
                </Text>
              </View>
            ))}
          </View>
        )}

        {/* Cómo funciona */}
        <View style={styles.howBox}>
          <Text style={styles.howTitle}>¿Cómo funciona?</Text>
          <Text style={styles.howText}>
            <Text style={styles.howCode}>onValue(ref(db, 'sensores'), callback)</Text>
            {'\n\n'}
            Firebase abre un WebSocket permanente. Cada vez que cualquier
            dispositivo escribe en <Text style={styles.howCode}>/sensores</Text>,
            la app recibe los datos al instante — sin polling.
            {'\n\n'}
            Tu sensor IoT (ESP32, Raspberry Pi, etc.) escribe:
            {'\n'}
            <Text style={styles.howCode}>
              {'db.ref("sensores").set({ temperatura: 24.5, ... })'}
            </Text>
          </Text>
        </View>

        <LogViewer logs={logs} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe:    { flex: 1, backgroundColor: COLORS.bg },
  scroll:  { flex: 1 },
  content: { padding: SPACING.md, paddingBottom: 40 },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  title:    { fontSize: 20, fontWeight: '700', color: COLORS.text, fontFamily: FONTS.mono },
  subtitle: { fontSize: 11, color: COLORS.textMuted, fontFamily: FONTS.mono, marginTop: 2 },

  connBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    borderWidth: 0.5, borderRadius: 20, paddingHorizontal: 10, paddingVertical: 5,
  },
  connDot:  { width: 7, height: 7, borderRadius: 4 },
  connText: { fontSize: 11, fontFamily: FONTS.mono },

  infoRow: {
    flexDirection: 'row', justifyContent: 'space-between',
    marginBottom: 14,
  },
  infoText: { fontSize: 11, color: COLORS.textMuted, fontFamily: FONTS.mono },

  loadingBox: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    backgroundColor: COLORS.surface, borderRadius: 8, padding: 14, marginBottom: 14,
  },
  loadingText: { color: COLORS.textMuted, fontFamily: FONTS.mono, fontSize: 12 },

  errorBox: {
    backgroundColor: '#1A0A0A', borderRadius: 8, padding: 14, marginBottom: 14,
    borderWidth: 0.5, borderColor: COLORS.error,
  },
  errorTitle: { color: COLORS.error, fontFamily: FONTS.mono, fontSize: 13, fontWeight: '600', marginBottom: 4 },
  errorText:  { color: COLORS.error, fontFamily: FONTS.mono, fontSize: 12, marginBottom: 4 },
  errorHint:  { color: COLORS.textMuted, fontFamily: FONTS.mono, fontSize: 11 },

  sectionLabel: {
    fontSize: 10, color: COLORS.textMuted, letterSpacing: 1,
    fontFamily: FONTS.mono, marginBottom: 8,
  },
  row: { flexDirection: 'row', marginHorizontal: -4 },

  actions: { flexDirection: 'row', gap: 10, marginTop: SPACING.md },
  btn: {
    flex: 1, backgroundColor: COLORS.accent, borderRadius: 8,
    paddingVertical: 10, alignItems: 'center',
  },
  btnSecondary: {
    backgroundColor: COLORS.surface, borderWidth: 0.5, borderColor: COLORS.border,
  },
  btnText: { color: COLORS.bg, fontWeight: '600', fontSize: 13, fontFamily: FONTS.mono },

  historialBox: {
    backgroundColor: COLORS.surface, borderRadius: 10, padding: 12,
    borderWidth: 0.5, borderColor: COLORS.border, marginTop: SPACING.md,
  },
  histEntry: {
    flexDirection: 'row', gap: 10, paddingVertical: 5,
    borderBottomWidth: 0.5, borderBottomColor: COLORS.border,
  },
  histTime: { fontSize: 11, color: COLORS.textMuted, fontFamily: FONTS.mono, minWidth: 65 },
  histData: { fontSize: 11, color: COLORS.text, fontFamily: FONTS.mono, flex: 1 },

  howBox: {
    backgroundColor: COLORS.surface, borderRadius: 10, padding: 14,
    borderWidth: 0.5, borderColor: COLORS.border, marginTop: SPACING.md,
  },
  howTitle: { color: COLORS.text, fontFamily: FONTS.mono, fontSize: 13, fontWeight: '600', marginBottom: 8 },
  howText:  { color: COLORS.textMuted, fontFamily: FONTS.mono, fontSize: 11, lineHeight: 18 },
  howCode:  { color: COLORS.accent },
});
