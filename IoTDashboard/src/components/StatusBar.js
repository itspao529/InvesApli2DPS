// src/components/StatusBar.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, FONTS } from '../theme';

const AppStatusBar = ({ status, progress, fetchCount, lastUpdate }) => {
  const statusConfig = {
    live:    { color: '#4ADE80', label: '● LIVE' },
    paused:  { color: '#FBBF24', label: '⏸ PAUSADO' },
    error:   { color: '#F87171', label: '✕ ERROR' },
    loading: { color: '#60A5FA', label: '○ CARGANDO' },
  };

  const cfg = statusConfig[status] ?? statusConfig.live;
  const timeStr = lastUpdate
    ? lastUpdate.toLocaleTimeString('es', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
    : '--:--:--';

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <Text style={[styles.statusLabel, { color: cfg.color }]}>{cfg.label}</Text>
        <Text style={styles.meta}>
          {fetchCount} fetch{fetchCount !== 1 ? 'es' : ''} · {timeStr}
        </Text>
      </View>

      {/* Barra de progreso hacia el próximo fetch */}
      <View style={styles.trackWrap}>
        <Text style={styles.trackLabel}>Próximo fetch</Text>
        <View style={styles.track}>
          <View style={[styles.fill, { width: `${progress * 100}%` }]} />
        </View>
        <Text style={styles.trackSec}>{(progress * 5).toFixed(1)}s</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.surface,
    borderRadius: 10,
    padding: 12,
    borderWidth: 0.5,
    borderColor: COLORS.border,
    marginBottom: 16,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  statusLabel: {
    fontFamily: FONTS.mono,
    fontSize: 12,
    fontWeight: '600',
  },
  meta: {
    fontFamily: FONTS.mono,
    fontSize: 11,
    color: COLORS.textMuted,
  },
  trackWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  trackLabel: {
    fontSize: 10,
    color: COLORS.textMuted,
    fontFamily: FONTS.mono,
    width: 80,
  },
  track: {
    flex: 1,
    height: 4,
    backgroundColor: COLORS.border,
    borderRadius: 2,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    backgroundColor: '#1D9E75',
    borderRadius: 2,
  },
  trackSec: {
    fontFamily: FONTS.mono,
    fontSize: 10,
    color: COLORS.textMuted,
    width: 30,
    textAlign: 'right',
  },
});

export default AppStatusBar;
