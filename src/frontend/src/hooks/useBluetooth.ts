import { useCallback, useEffect, useRef, useState } from "react";

const BATTERY_SERVICE = 0x180f;
const BATTERY_CHAR = "00002a19-0000-1000-8000-00805f9b34fb";
const HELMET_SERVICE = "0000ff01-0000-1000-8000-00805f9b34fb";
const HELMET_WORN_CHAR = "0000ff02-0000-1000-8000-00805f9b34fb";
const BIKE_SERVICE = "0000ff01-0000-1000-8000-00805f9b34fb";
const BIKE_SOBRIETY_CHAR = "0000ff03-0000-1000-8000-00805f9b34fb";

interface DeviceState {
  connected: boolean;
  deviceName: string | null;
  battery: number;
  worn: boolean;
}

interface BikeDeviceState {
  connected: boolean;
  deviceName: string | null;
  battery: number;
  sobrietyPass: boolean;
}

function isBluetoothSupported(): boolean {
  return typeof navigator !== "undefined" && "bluetooth" in navigator;
}

async function safeReadUint8(
  service: any,
  charUuid: string,
): Promise<number | null> {
  try {
    const char = await service.getCharacteristic(charUuid);
    const value = await char.readValue();
    return value.getUint8(0);
  } catch {
    return null;
  }
}

async function safeStartNotify(
  service: any,
  charUuid: string,
  handler: (e: Event) => void,
): Promise<void> {
  try {
    const char = await service.getCharacteristic(charUuid);
    char.addEventListener("characteristicvaluechanged", handler);
    await char.startNotifications();
  } catch {
    // characteristic not available, ignore
  }
}

export default function useBluetooth() {
  const isSupported = isBluetoothSupported();

  const [helmetDevice, setHelmetDevice] = useState<DeviceState>({
    connected: false,
    deviceName: null,
    battery: 0,
    worn: false,
  });

  const [bikeDevice, setBikeDevice] = useState<BikeDeviceState>({
    connected: false,
    deviceName: null,
    battery: 0,
    sobrietyPass: false,
  });

  const helmetDeviceRef = useRef<any>(null);
  const bikeDeviceRef = useRef<any>(null);

  const connectHelmet = useCallback(async () => {
    if (!isSupported) return;
    try {
      let device: any;
      try {
        device = await (navigator as any).bluetooth.requestDevice({
          filters: [{ namePrefix: "GuardianHelmet" }],
          optionalServices: [BATTERY_SERVICE, HELMET_SERVICE],
        });
      } catch {
        device = await (navigator as any).bluetooth.requestDevice({
          acceptAllDevices: true,
          optionalServices: [BATTERY_SERVICE, HELMET_SERVICE],
        });
      }

      if (!device) return;
      helmetDeviceRef.current = device;

      device.addEventListener("gattserverdisconnected", () => {
        setHelmetDevice((prev) => ({ ...prev, connected: false }));
      });

      const server = await device.gatt.connect();

      let battery = 0;
      try {
        const batterySvc = await server.getPrimaryService(BATTERY_SERVICE);
        const val = await safeReadUint8(batterySvc, BATTERY_CHAR);
        if (val !== null) battery = val;
        await safeStartNotify(batterySvc, BATTERY_CHAR, (e: Event) => {
          const target = e.target as any;
          if (target.value) {
            setHelmetDevice((prev) => ({
              ...prev,
              battery: target.value.getUint8(0),
            }));
          }
        });
      } catch {
        // no battery service
      }

      let worn = false;
      try {
        const helmetSvc = await server.getPrimaryService(HELMET_SERVICE);
        const val = await safeReadUint8(helmetSvc, HELMET_WORN_CHAR);
        if (val !== null) worn = val === 1;
        await safeStartNotify(helmetSvc, HELMET_WORN_CHAR, (e: Event) => {
          const target = e.target as any;
          if (target.value) {
            setHelmetDevice((prev) => ({
              ...prev,
              worn: target.value.getUint8(0) === 1,
            }));
          }
        });
      } catch {
        // no helmet service
      }

      setHelmetDevice({
        connected: true,
        deviceName: device.name ?? "Unknown Helmet",
        battery,
        worn,
      });
    } catch (err: any) {
      if (err?.name === "NotFoundError" || err?.name === "AbortError") return;
      console.error("Helmet BLE connect error:", err);
    }
  }, [isSupported]);

  const connectBike = useCallback(async () => {
    if (!isSupported) return;
    try {
      let device: any;
      try {
        device = await (navigator as any).bluetooth.requestDevice({
          filters: [{ namePrefix: "GuardianBike" }],
          optionalServices: [BATTERY_SERVICE, BIKE_SERVICE],
        });
      } catch {
        device = await (navigator as any).bluetooth.requestDevice({
          acceptAllDevices: true,
          optionalServices: [BATTERY_SERVICE, BIKE_SERVICE],
        });
      }

      if (!device) return;
      bikeDeviceRef.current = device;

      device.addEventListener("gattserverdisconnected", () => {
        setBikeDevice((prev) => ({ ...prev, connected: false }));
      });

      const server = await device.gatt.connect();

      let battery = 0;
      try {
        const batterySvc = await server.getPrimaryService(BATTERY_SERVICE);
        const val = await safeReadUint8(batterySvc, BATTERY_CHAR);
        if (val !== null) battery = val;
        await safeStartNotify(batterySvc, BATTERY_CHAR, (e: Event) => {
          const target = e.target as any;
          if (target.value) {
            setBikeDevice((prev) => ({
              ...prev,
              battery: target.value.getUint8(0),
            }));
          }
        });
      } catch {
        // no battery service
      }

      let sobrietyPass = false;
      try {
        const bikeSvc = await server.getPrimaryService(BIKE_SERVICE);
        const val = await safeReadUint8(bikeSvc, BIKE_SOBRIETY_CHAR);
        if (val !== null) sobrietyPass = val === 1;
        await safeStartNotify(bikeSvc, BIKE_SOBRIETY_CHAR, (e: Event) => {
          const target = e.target as any;
          if (target.value) {
            setBikeDevice((prev) => ({
              ...prev,
              sobrietyPass: target.value.getUint8(0) === 1,
            }));
          }
        });
      } catch {
        // no bike service
      }

      setBikeDevice({
        connected: true,
        deviceName: device.name ?? "Unknown Bike",
        battery,
        sobrietyPass,
      });
    } catch (err: any) {
      if (err?.name === "NotFoundError" || err?.name === "AbortError") return;
      console.error("Bike BLE connect error:", err);
    }
  }, [isSupported]);

  const disconnectHelmet = useCallback(() => {
    if (helmetDeviceRef.current?.gatt?.connected) {
      helmetDeviceRef.current.gatt.disconnect();
    }
    setHelmetDevice({
      connected: false,
      deviceName: null,
      battery: 0,
      worn: false,
    });
  }, []);

  const disconnectBike = useCallback(() => {
    if (bikeDeviceRef.current?.gatt?.connected) {
      bikeDeviceRef.current.gatt.disconnect();
    }
    setBikeDevice({
      connected: false,
      deviceName: null,
      battery: 0,
      sobrietyPass: false,
    });
  }, []);

  useEffect(() => {
    return () => {
      if (helmetDeviceRef.current?.gatt?.connected) {
        helmetDeviceRef.current.gatt.disconnect();
      }
      if (bikeDeviceRef.current?.gatt?.connected) {
        bikeDeviceRef.current.gatt.disconnect();
      }
    };
  }, []);

  return {
    isSupported,
    helmetDevice,
    bikeDevice,
    connectHelmet,
    connectBike,
    disconnectHelmet,
    disconnectBike,
  };
}
