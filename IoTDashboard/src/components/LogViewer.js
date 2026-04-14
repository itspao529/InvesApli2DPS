// src/components/LogViewer.js
import React, { useRef, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { COLORS, FONTS } from '../theme';

const LogViewer = ({ logs }) => {
  const scrollRef = useRef(null);

  useEffect(() => {
    // Auto-scroll al final con cada nuevo log
    setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100);
  }, [logs]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>LOG DE PETICIONES</Text>
      <ScrollView
        ref={scrollRef}
        style={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        {logs.length === 0 && (
          <Text style={styles.empty}>Sin actividad aún...</Text>
        )}
        {logs.map((entry, i) => (
          <View key={i} style={styles.entry}>
            <Text style={styles.time}>{entry.time}</Text>
            <Text style={[styles.msg, styles[entry.type] ?? styles.info]}>
              {entry.message}
            </Text>
          </View>
        ))}
      </ScrollView>
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
    marginTop: 16,
  },
  title: {
    fontSize: 10,
    color: COLORS.textMuted,
    fontFamily: FONTS.mono,
    letterSpacing: 0.8,
    marginBottom: 8,
  },
  scroll:  { maxHeight: 120 },
  entry:   { flexDirection: 'row', gap: 8, marginBottom: 3 },
  time:    { fontSize: 11, fontFamily: FONTS.mono, color: COLORS.textMuted, minWidth: 70 },
  msg:     { fontSize: 11, fontFamily: FONTS.mono, flex: 1 },
  ok:      { color: '#4ADE80' },
  error:   { color: '#F87171' },
  info:    { color: '#60A5FA' },
  warning: { color: '#FBBF24' },
  empty:   { fontSize: 11, color: COLORS.textMuted, fontFamily: FONTS.mono },
});

export default LogViewer;
