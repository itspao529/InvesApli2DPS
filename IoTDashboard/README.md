# IoT Dashboard — React Native + Expo

Dashboard en tiempo real para datos IoT con polling automático cada 5 segundos usando `fetch` y `axios`.

## Estructura del proyecto

```
IoTDashboard/
├── App.js
├── package.json
├── src/
│   ├── hooks/
│   │   ├── useIoTData.js      ← Hook principal (fetch + polling)
│   │   └── useCountdown.js    ← Barra de progreso visual
│   ├── services/
│   │   └── apiService.js      ← fetch nativo + axios configurado
│   ├── screens/
│   │   ├── DashboardScreen.js ← Pantalla principal
│   │   └── SettingsScreen.js  ← Configuración del endpoint
│   ├── components/
│   │   ├── MetricCard.js      ← Tarjeta de métrica IoT
│   │   ├── StatusBar.js       ← Indicador live/paused + countdown
│   │   └── LogViewer.js       ← Historial de peticiones
│   ├── navigation/
│   │   └── AppNavigator.js    ← Tab navigator
│   └── theme.js               ← Colores, fuentes, spacing
```

## Instalación y uso

### 1. Instalar dependencias

```bash
cd IoTDashboard
npm install
```

### 2. Correr el proyecto

```bash
# Iniciar Expo
npx expo start

# En Android
npx expo start --android

# En iOS
npx expo start --ios
```

### 3. Conectar tu API IoT real

Edita `src/services/apiService.js`:

```js
const BASE_URL = 'https://tu-api-iot.com/v1';  // ← Tu servidor
const TOKEN = 'tu-jwt-token-aqui';              // ← Si usas auth
```

Edita `src/screens/DashboardScreen.js`:

```js
const { data, loading, error } = useIoTData(
  '/sensors/status',   // ← Tu endpoint
  5000,                // ← Intervalo en ms
);
```

## Cómo funciona el hook `useIoTData`

```
┌─────────────────────────────────────────────────┐
│ useIoTData(endpoint, interval = 5000)            │
│                                                  │
│  mount → fetchData() inmediato                   │
│        → setInterval(fetchData, interval)        │
│                                                  │
│  cada fetch → AbortController cancela anterior  │
│             → setData / setError / setLoading   │
│                                                  │
│  unmount → clearInterval()                       │
│          → abortController.abort()              │
└─────────────────────────────────────────────────┘
```

## Cambiar entre fetch y axios

En `src/services/apiService.js` tienes ambas implementaciones.

En `src/hooks/useIoTData.js` cambia el import:

```js
// fetch nativo (default)
import { fetchIoTData } from '../services/apiService';

// axios
import { fetchIoTAxios as fetchIoTData } from '../services/apiService';
```

## Casos de uso reales (AR + IoT)

| Escenario | Endpoint | Intervalo |
|-----------|----------|-----------|
| Sensor temperatura | `/sensors/temp` | 3000ms |
| Estado de dispositivo | `/devices/{id}/status` | 5000ms |
| Firebase Realtime DB | REST API de Firebase | 2000ms |
| ThingSpeak | `/channels/{id}/feeds/last.json` | 5000ms |
| MQTT via HTTP bridge | `/mqtt/last-message` | 1000ms |

## Dependencias

- `expo` ~51
- `react-native` 0.74
- `axios` ^1.7
- `@react-navigation/native` + `bottom-tabs`
- `react-native-safe-area-context`
- `@expo/vector-icons`
