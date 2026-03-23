# Guardian Gauntlet

## Current State
The app is a mobile-first React app with mock/simulated data for:
- Bluetooth connection status (toggled via buttons)
- Helmet worn / sobriety check (randomized every 4s)
- Battery levels (decrementing over time)
- GPS map (mocked position)
- SOS modal with countdown
- Settings for emergency contacts

## Requested Changes (Diff)

### Add
- `useWebBluetooth` hook: wraps the Web Bluetooth API to scan, connect, and read data from BLE hardware devices
- Helmet BLE device connection: connect to a BLE device named "GuardianHelmet" (or user-chosen device), read battery level (standard BLE Battery Service 0x180F / 0x2A19) and a custom characteristic for helmet-worn status (service 0xFF01, char 0xFF02)
- Bike BLE device connection: connect to a BLE device named "GuardianBike" (or user-chosen device), read battery level and a custom characteristic for sobriety/lock status (service 0xFF01, char 0xFF03)
- "Connect Hardware" button in Dashboard: opens the browser's native BLE device picker
- Live data feed: when BLE device is connected, replace mock values with real values from the device
- Graceful fallback: if Web Bluetooth is unsupported (non-Chrome) or device not found, show a clear message and keep mock data mode working
- Connection info panel: show device name and signal strength (RSSI if available) when connected

### Modify
- Dashboard connectivity cards: replace the simple toggle buttons with "Scan & Connect" buttons that trigger BLE pairing; show real connected device name when paired
- Dashboard system checks: when real data is available, read from BLE characteristics instead of random simulation
- Dashboard battery bars: when connected, use battery level from BLE Battery Service

### Remove
- Random simulation interval for helmetWorn and sobrietyPass (replaced by real BLE data when connected; still runs as fallback when not connected)

## Implementation Plan
1. Create `src/frontend/src/hooks/useBluetooth.ts` - Web Bluetooth hook with:
   - `isSupported`: boolean
   - `connectHelmet()` / `connectBike()`: open BLE picker and connect
   - `disconnectHelmet()` / `disconnectBike()`
   - `helmetData`: `{ connected, deviceName, battery, worn }` 
   - `bikeData`: `{ connected, deviceName, battery, sobrietyPass }`
   - Characteristic notifications for live updates
2. Update `Dashboard.tsx` to use the hook, showing real data when connected and mock data when not
3. Show a browser-compatibility notice if Web Bluetooth is not supported
4. Add a visual indicator (e.g. "LIVE" badge) when showing real hardware data
