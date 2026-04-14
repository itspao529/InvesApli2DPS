// src/screens/SettingsScreen.js
import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, ScrollView, Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, FONTS, SPACING } from '../theme';

const PRESETS = [
  { label: 'JSONPlaceholder (demo)', url: 'https://jsonplaceholder.typicode.com/todos/1' },
  { label: 'Open-Meteo (clima)', url: 'https://api.open-meteo.com/v1/forecast?latitude=13.69&longitude=-89.19&current_weather=true' },
  { label: 'ThingSpeak IoT', url: 'https://api.thingspeak.com/channels/PUBLIC_CHANNEL/feeds/last.json' },
];

export default function SettingsScreen() {
  const [url, setUrl]       = useState('https://jsonplaceholder.typicode.com');
  const [interval, setInterval_] = useState('5000');
  const [token, setToken]   = useState('');

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>

        <Text style={styles.title}>Configuración API</Text>

        {/* URL base */}
        <View style={styles.group}>
          <Text style={styles.label}>BASE URL</Text>
          <TextInput
            style={styles.input}
            value={url}
            onChangeText={setUrl}
            placeholder="https://api.tuservidor.io/v1"
            placeholderTextColor={COLORS.textMuted}
            autoCapitalize="none"
            autoCorrect={false}
          />
        </View>

        {/* Interval */}
        <View style={styles.group}>
          <Text style={styles.label}>INTERVALO (ms)</Text>
          <TextInput
            style={styles.input}
            value={interval}
            onChangeText={setInterval_}
            keyboardType="numeric"
            placeholder="5000"
            placeholderTextColor={COLORS.textMuted}
          />
          <Text style={styles.hint}>
            Recomendado: 3000–10000 ms para IoT en tiempo real
          </Text>
        </View>

        {/* Token */}
        <View style={styles.group}>
          <Text style={styles.label}>BEARER TOKEN (opcional)</Text>
          <TextInput
            style={styles.input}
            value={token}
            onChangeText={setToken}
            placeholder="eyJhbGciOi..."
            placeholderTextColor={COLORS.textMuted}
            secureTextEntry
            autoCapitalize="none"
          />
        </View>

        {/* Presets */}
        <Text style={styles.sectionTitle}>ENDPOINTS DEMO</Text>
        {PRESETS.map((p, i) => (
          <TouchableOpacity
            key={i}
            style={styles.preset}
            onPress={() => {
              setUrl(p.url.replace(/\/[^/]+$/, ''));
              Alert.alert('Preset cargado', p.label);
            }}
          >
            <Text style={styles.presetLabel}>{p.label}</Text>
            <Text style={styles.presetUrl} numberOfLines={1}>{p.url}</Text>
          </TouchableOpacity>
        ))}

        {/* Guardar */}
        <TouchableOpacity
          style={styles.saveBtn}
          onPress={() => Alert.alert('Guardado', 'Configuración actualizada.\nReinicia el dashboard para aplicar.')}
        >
          <Text style={styles.saveBtnText}>Guardar configuración</Text>
        </TouchableOpacity>

        {/* Info */}
        <View style={styles.infoBox}>
          <Text style={styles.infoTitle}>¿Cómo conectar tu API real?</Text>
          <Text style={styles.infoText}>
            1. Abre <Text style={styles.code}>src/services/apiService.js</Text>{'\n'}
            2. Cambia <Text style={styles.code}>BASE_URL</Text> a tu servidor{'\n'}
            3. Agrega tu token en el header <Text style={styles.code}>Authorization</Text>{'\n'}
            4. En <Text style={styles.code}>DashboardScreen.js</Text> ajusta el endpoint y el intervalo
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe:    { flex: 1, backgroundColor: COLORS.bg },
  scroll:  { flex: 1 },
  content: { padding: SPACING.md, paddingBottom: 40 },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.text,
    fontFamily: FONTS.mono,
    marginBottom: SPACING.lg,
  },
  group:  { marginBottom: SPACING.md },
  label: {
    fontSize: 10,
    color: COLORS.textMuted,
    letterSpacing: 1,
    fontFamily: FONTS.mono,
    marginBottom: 6,
  },
  input: {
    backgroundColor: COLORS.surface,
    borderWidth: 0.5,
    borderColor: COLORS.border,
    borderRadius: 8,
    padding: 12,
    color: COLORS.text,
    fontFamily: FONTS.mono,
    fontSize: 13,
  },
  hint: {
    fontSize: 11,
    color: COLORS.textMuted,
    fontFamily: FONTS.mono,
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: 10,
    color: COLORS.textMuted,
    letterSpacing: 1,
    fontFamily: FONTS.mono,
    marginBottom: 10,
    marginTop: SPACING.sm,
  },
  preset: {
    backgroundColor: COLORS.surface,
    borderWidth: 0.5,
    borderColor: COLORS.border,
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  presetLabel: { color: COLORS.text, fontFamily: FONTS.mono, fontSize: 13 },
  presetUrl:   { color: COLORS.textMuted, fontFamily: FONTS.mono, fontSize: 10, marginTop: 2 },
  saveBtn: {
    backgroundColor: COLORS.accent,
    borderRadius: 8,
    padding: 14,
    alignItems: 'center',
    marginTop: SPACING.md,
  },
  saveBtnText: { color: COLORS.bg, fontWeight: '700', fontFamily: FONTS.mono, fontSize: 14 },
  infoBox: {
    backgroundColor: COLORS.surface,
    borderRadius: 8,
    padding: 14,
    marginTop: SPACING.md,
    borderWidth: 0.5,
    borderColor: COLORS.border,
  },
  infoTitle: { color: COLORS.text, fontFamily: FONTS.mono, fontSize: 13, fontWeight: '600', marginBottom: 8 },
  infoText:  { color: COLORS.textMuted, fontFamily: FONTS.mono, fontSize: 12, lineHeight: 20 },
  code:      { color: COLORS.accent },
});
