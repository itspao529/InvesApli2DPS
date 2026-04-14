// src/screens/DashboardScreen.js
import React, { useState, useCallback, useRef } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, RefreshControl, Switch,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import useIoTData from '../hooks/useIoTData';
import useCountdown from '../hooks/useCountdown';
import MetricCard from '../components/MetricCard';
import AppStatusBar from '../components/StatusBar';
import LogViewer from '../components/LogViewer';
import { COLORS, FONTS, SPACING } from '../theme';

const INTERVAL = 5000;

export default function DashboardScreen() {
  const [pollingEnabled, setPollingEnabled] = useState(true);
  const [logs, setLogs] = useState([]);
  const prevDataRef = useRef(null);

  
  const { data, loading, error, lastUpdate, fetchCount, refetch } = useIoTData(
    '/todos/1',   // ← Cambia a tu endpoint real, ej: '/sensors/status'
    INTERVAL,
    pollingEnabled
  );

  
  const progress = useCountdown(INTERVAL, fetchCount);

  
  const addLog = useCallback((msg, type = 'info') => {
    const time = new Date().toLocaleTimeString('es', {
      hour: '2-digit', minute: '2-digit', second: '2-digit',
    });
    setLogs((prev) => [...prev.slice(-29), { time, message: msg, type }]);
  }, []);

  // Registrar cada fetch
  React.useEffect(() => {
    if (fetchCount > 0) {
      addLog(`GET /todos/1 → 200 OK (fetch #${fetchCount})`, 'ok');
    }
  }, [fetchCount]);

  React.useEffect(() => {
    if (error) addLog(`Error: ${error}`, 'error');
  }, [error]);

 
  const [simData, setSimData] = useState(null);
  React.useEffect(() => {
    if (!data) return;
    const prev = prevDataRef.current;
    const next = {
      temperatura: +(18 + Math.random() * 17).toFixed(1),
      humedad:     +(30 + Math.random() * 60).toFixed(1),
      presion:     +(990 + Math.random() * 35).toFixed(1),
      cpu:         +(10 + Math.random() * 85).toFixed(1),
      memoria:     +(20 + Math.random() * 65).toFixed(1),
      bateria:     +(50 + Math.random() * 50).toFixed(1),
    };
    setSimData({ current: next, prev });
    prevDataRef.current = next;
  }, [data]);

  const cur  = simData?.current;
  const prev = simData?.prev;

  const deltaOf = (key) =>
    cur && prev ? +(cur[key] - prev[key]).toFixed(1) : null;

  
  const badgeStatus = error
    ? 'error'
    : loading && !cur
    ? 'loading'
    : !pollingEnabled
    ? 'paused'
    : 'live';

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={refetch}
            tintColor={COLORS.accent}
          />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.headerTitle}>IoT Dashboard</Text>
            <Text style={styles.headerSub}>Actualización cada 5 segundos</Text>
          </View>
          <View style={styles.toggleRow}>
            <Text style={styles.toggleLabel}>
              {pollingEnabled ? 'ON' : 'OFF'}
            </Text>
            <Switch
              value={pollingEnabled}
              onValueChange={(v) => {
                setPollingEnabled(v);
                addLog(v ? 'Polling activado' : 'Polling pausado', 'warning');
              }}
              trackColor={{ false: COLORS.border, true: COLORS.accent }}
              thumbColor={COLORS.text}
            />
          </View>
        </View>

        {/* Status bar con countdown */}
        <AppStatusBar
          status={badgeStatus}
          progress={pollingEnabled ? progress : 0}
          fetchCount={fetchCount}
          lastUpdate={lastUpdate}
        />

        {/* Métricas — Fila 1 */}
        <Text style={styles.sectionLabel}>AMBIENTE</Text>
        <View style={styles.row}>
          <MetricCard
            label="Temperatura"
            value={cur?.temperatura}
            unit="°C"
            delta={deltaOf('temperatura')}
            color={COLORS.info}
          />
          <MetricCard
            label="Humedad"
            value={cur?.humedad}
            unit="%"
            delta={deltaOf('humedad')}
            color={COLORS.accentAlt}
          />
          <MetricCard
            label="Presión"
            value={cur?.presion}
            unit=" hPa"
            delta={deltaOf('presion')}
            color={COLORS.warning}
          />
        </View>

        {/* Métricas — Fila 2 */}
        <Text style={[styles.sectionLabel, { marginTop: SPACING.md }]}>SISTEMA</Text>
        <View style={styles.row}>
          <MetricCard
            label="CPU"
            value={cur?.cpu}
            unit="%"
            delta={deltaOf('cpu')}
            color={COLORS.error}
          />
          <MetricCard
            label="Memoria"
            value={cur?.memoria}
            unit="%"
            delta={deltaOf('memoria')}
            color={COLORS.success}
          />
          <MetricCard
            label="Batería"
            value={cur?.bateria}
            unit="%"
            delta={deltaOf('bateria')}
            color={COLORS.accent}
          />
        </View>

        {/* Acciones */}
        <View style={styles.actions}>
          <TouchableOpacity style={styles.btn} onPress={refetch}>
            <Text style={styles.btnText}>↺  Forzar fetch</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.btn, styles.btnSecondary]}
            onPress={() => {
              setLogs([]);
              addLog('Log limpiado', 'info');
            }}
          >
            <Text style={[styles.btnText, { color: COLORS.textMuted }]}>
              Limpiar log
            </Text>
          </TouchableOpacity>
        </View>

        {/* Error */}
        {error && (
          <View style={styles.errorBox}>
            <Text style={styles.errorText}>⚠ {error}</Text>
          </View>
        )}

        {/* Log de actividad */}
        <LogViewer logs={logs} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe:    { flex: 1, backgroundColor: COLORS.bg },
  scroll:  { flex: 1 },
  content: { padding: SPACING.md, paddingBottom: SPACING.xl },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: SPACING.md,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: COLORS.text,
    fontFamily: FONTS.mono,
  },
  headerSub: {
    fontSize: 12,
    color: COLORS.textMuted,
    fontFamily: FONTS.mono,
    marginTop: 2,
  },
  toggleRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  toggleLabel: { fontSize: 11, color: COLORS.textMuted, fontFamily: FONTS.mono },

  sectionLabel: {
    fontSize: 10,
    color: COLORS.textMuted,
    letterSpacing: 1,
    fontFamily: FONTS.mono,
    marginBottom: 8,
  },
  row: {
    flexDirection: 'row',
    marginHorizontal: -4,
  },

  actions: {
    flexDirection: 'row',
    gap: 10,
    marginTop: SPACING.md,
  },
  btn: {
    flex: 1,
    backgroundColor: COLORS.accent,
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
  },
  btnSecondary: {
    backgroundColor: COLORS.surface,
    borderWidth: 0.5,
    borderColor: COLORS.border,
  },
  btnText: {
    color: COLORS.bg,
    fontWeight: '600',
    fontSize: 13,
    fontFamily: FONTS.mono,
  },

  errorBox: {
    backgroundColor: '#2D1212',
    borderRadius: 8,
    padding: 10,
    marginTop: SPACING.sm,
    borderWidth: 0.5,
    borderColor: COLORS.error,
  },
  errorText: {
    color: COLORS.error,
    fontFamily: FONTS.mono,
    fontSize: 12,
  },
});
