// src/components/MetricCard.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, FONTS } from '../theme';

const MetricCard = ({ label, value, unit, delta, color = COLORS.accent }) => {
  const deltaPositive = delta > 0;
  const showDelta = delta !== null && delta !== undefined && delta !== 0;

  return (
    <View style={styles.card}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.valueRow}>
        <Text style={[styles.value, { color }]}>{value ?? '—'}</Text>
        {unit ? <Text style={styles.unit}>{unit}</Text> : null}
      </View>
      {showDelta && (
        <Text style={[styles.delta, deltaPositive ? styles.deltaUp : styles.deltaDown]}>
          {deltaPositive ? '▲ +' : '▼ '}
          {Math.abs(delta).toFixed(1)}{unit}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: 14,
    marginHorizontal: 4,
    borderWidth: 0.5,
    borderColor: COLORS.border,
  },
  label: {
    fontSize: 10,
    color: COLORS.textMuted,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    marginBottom: 8,
    fontFamily: FONTS.mono,
  },
  valueRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 3,
  },
  value: {
    fontSize: 24,
    fontWeight: '600',
    fontFamily: FONTS.mono,
  },
  unit: {
    fontSize: 12,
    color: COLORS.textMuted,
    fontFamily: FONTS.mono,
  },
  delta: {
    fontSize: 11,
    marginTop: 4,
    fontFamily: FONTS.mono,
  },
  deltaUp:   { color: '#4ADE80' },
  deltaDown: { color: '#F87171' },
});

export default MetricCard;
