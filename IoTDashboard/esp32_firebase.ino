/*
 * ESP32 → Firebase Realtime Database
 * Librería: Firebase ESP Client  (mobizt/Firebase-ESP-Client)
 *
 * Instalar en Arduino IDE:
 *   Herramientas → Gestor de librerías → "Firebase ESP Client"
 */

#include <WiFi.h>
#include <FirebaseESP32.h>
#include <DHT.h>

// ── Configuración ──────────────────────────────────────────────────────────
#define WIFI_SSID      "TU_WIFI"
#define WIFI_PASSWORD  "TU_PASSWORD"

#define FIREBASE_HOST  "TU_PROYECTO-default-rtdb.firebaseio.com"
#define FIREBASE_AUTH  "TU_DATABASE_SECRET"   // Firebase → Configuración → cuentas de servicio

#define DHT_PIN        4
#define DHT_TYPE       DHT22
#define INTERVAL_MS    5000   // Enviar cada 5 segundos

// ── Objetos ────────────────────────────────────────────────────────────────
FirebaseData   fbdo;
FirebaseAuth   auth;
FirebaseConfig config;
DHT            dht(DHT_PIN, DHT_TYPE);

unsigned long lastSend = 0;

void setup() {
  Serial.begin(115200);
  dht.begin();

  // Conectar WiFi
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  Serial.print("Conectando WiFi");
  while (WiFi.status() != WL_CONNECTED) { delay(300); Serial.print("."); }
  Serial.println(" OK → " + WiFi.localIP().toString());

  // Configurar Firebase
  config.host = FIREBASE_HOST;
  config.signer.tokens.legacy_token = FIREBASE_AUTH;
  Firebase.begin(&config, &auth);
  Firebase.reconnectWiFi(true);
  Serial.println("Firebase conectado");
}

void loop() {
  if (millis() - lastSend < INTERVAL_MS) return;
  lastSend = millis();

  float temperatura = dht.readTemperature();
  float humedad     = dht.readHumidity();

  if (isnan(temperatura) || isnan(humedad)) {
    Serial.println("Error leyendo DHT22");
    return;
  }

  // Escribir en /sensores
  FirebaseJson json;
  json.set("temperatura", temperatura);
  json.set("humedad",     humedad);
  json.set("presion",     1013.2);  
  json.set("bateria",     analogRead(34) / 40.95);  
  json.set("lastUpdate",  (int)millis());

  if (Firebase.setJSON(fbdo, "/sensores", json)) {
    Serial.printf("✓ Enviado → temp=%.1f°C hum=%.1f%%\n", temperatura, humedad);
  } else {
    Serial.println("✗ Error: " + fbdo.errorReason());
  }
}
