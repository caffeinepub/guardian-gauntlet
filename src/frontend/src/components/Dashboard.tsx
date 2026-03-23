import {
  AlertTriangle,
  Bike,
  Bluetooth,
  CheckCircle,
  Radio,
  Shield,
  XCircle,
} from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import useBluetooth from "../hooks/useBluetooth";
import { SOSModal } from "./SOSModal";

export function Dashboard() {
  // Mock simulation state (fallback)
  const [mockHelmetConnected, setMockHelmetConnected] = useState(true);
  const [mockBikeConnected, setMockBikeConnected] = useState(true);
  const [mockHelmetWorn, setMockHelmetWorn] = useState(true);
  const [mockSobrietyPass, setMockSobrietyPass] = useState(true);
  const [mockHelmetBattery, setMockHelmetBattery] = useState(78);
  const [mockBikeBattery, setMockBikeBattery] = useState(92);
  const [sosOpen, setSosOpen] = useState(false);
  const tickRef = useRef(0);

  const {
    isSupported,
    helmetDevice,
    bikeDevice,
    connectHelmet,
    connectBike,
    disconnectHelmet,
    disconnectBike,
  } = useBluetooth();

  // Derived values: use live BLE data if connected, else mock
  const helmetConnected = helmetDevice.connected || mockHelmetConnected;
  const bikeConnected = bikeDevice.connected || mockBikeConnected;
  const helmetWorn = helmetDevice.connected
    ? helmetDevice.worn
    : mockHelmetWorn;
  const sobrietyPass = bikeDevice.connected
    ? bikeDevice.sobrietyPass
    : mockSobrietyPass;
  const helmetBattery = helmetDevice.connected
    ? helmetDevice.battery
    : mockHelmetBattery;
  const bikeBattery = bikeDevice.connected
    ? bikeDevice.battery
    : mockBikeBattery;

  useEffect(() => {
    const interval = setInterval(() => {
      tickRef.current += 1;
      if (tickRef.current % 4 === 0) {
        setMockHelmetWorn(() => Math.random() > 0.2);
        setMockSobrietyPass(() => Math.random() > 0.15);
      }
      if (tickRef.current % 30 === 0) {
        setMockHelmetBattery((prev) => Math.max(0, prev - 1));
        setMockBikeBattery((prev) => Math.max(0, prev - 1));
      }
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleHelmetToggle = () => {
    if (helmetDevice.connected) {
      disconnectHelmet();
    } else if (!mockHelmetConnected) {
      connectHelmet();
    } else {
      // mock toggle
      setMockHelmetConnected((p) => !p);
    }
  };

  const handleBikeToggle = () => {
    if (bikeDevice.connected) {
      disconnectBike();
    } else if (!mockBikeConnected) {
      connectBike();
    } else {
      setMockBikeConnected((p) => !p);
    }
  };

  const units = [
    {
      label: "Helmet Unit",
      connected: helmetConnected,
      isLive: helmetDevice.connected,
      deviceName: helmetDevice.deviceName,
      id: "helmet",
      onScanConnect: connectHelmet,
      onDisconnect: helmetDevice.connected
        ? disconnectHelmet
        : () => setMockHelmetConnected(false),
      onMockConnect: () => setMockHelmetConnected(true),
      toggle: handleHelmetToggle,
    },
    {
      label: "Bike Unit",
      connected: bikeConnected,
      isLive: bikeDevice.connected,
      deviceName: bikeDevice.deviceName,
      id: "bike",
      onScanConnect: connectBike,
      onDisconnect: bikeDevice.connected
        ? disconnectBike
        : () => setMockBikeConnected(false),
      onMockConnect: () => setMockBikeConnected(true),
      toggle: handleBikeToggle,
    },
  ];

  return (
    <div
      className="flex flex-col h-full overflow-y-auto"
      style={{ background: "oklch(0.10 0 0)" }}
    >
      {/* Header */}
      <div
        className="flex items-center gap-2 px-4 pt-4 pb-3"
        style={{ borderBottom: "1px solid oklch(0.22 0 0)" }}
      >
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center"
          style={{ background: "oklch(0.75 0.18 70 / 0.15)" }}
        >
          <Shield
            className="w-4 h-4"
            style={{ color: "oklch(0.75 0.18 70)" }}
          />
        </div>
        <div>
          <h1
            className="font-display text-sm font-bold tracking-widest uppercase"
            style={{ color: "oklch(0.75 0.18 70)" }}
          >
            Guardian Gauntlet
          </h1>
          <p className="text-xs" style={{ color: "oklch(0.62 0.01 240)" }}>
            Dashboard
          </p>
        </div>
      </div>

      <div className="flex-1 px-4 py-3 space-y-4">
        {/* Bluetooth Section */}
        <section>
          <p
            className="text-xs font-semibold tracking-widest uppercase mb-2"
            style={{ color: "oklch(0.62 0.01 240)" }}
          >
            Connectivity
          </p>

          {/* Web Bluetooth not supported warning */}
          {!isSupported && (
            <div
              className="flex items-center gap-2 rounded-xl px-3 py-2 mb-3"
              style={{
                background: "oklch(0.75 0.18 80 / 0.12)",
                border: "1px solid oklch(0.75 0.18 80 / 0.30)",
              }}
              data-ocid="bluetooth.error_state"
            >
              <AlertTriangle
                className="w-3.5 h-3.5 shrink-0"
                style={{ color: "oklch(0.82 0.18 80)" }}
              />
              <p className="text-xs" style={{ color: "oklch(0.82 0.18 80)" }}>
                Web Bluetooth requires Chrome or Edge browser
              </p>
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            {units.map((unit) => (
              <motion.div
                key={unit.id}
                className="rounded-2xl p-3 flex flex-col gap-2"
                style={{
                  background: "oklch(0.16 0 0)",
                  border: "1px solid oklch(0.22 0 0)",
                }}
                data-ocid={`${unit.id}.card`}
              >
                <div className="flex items-center justify-between">
                  <Bluetooth
                    className="w-4 h-4"
                    style={{
                      color: unit.connected
                        ? "oklch(0.75 0.18 70)"
                        : "oklch(0.40 0 0)",
                    }}
                  />
                  <span
                    className="text-xs font-semibold"
                    style={{
                      color: unit.connected
                        ? "oklch(0.70 0.20 145)"
                        : "oklch(0.55 0 0)",
                    }}
                  >
                    {unit.connected ? "ON" : "OFF"}
                  </span>
                </div>

                <div className="flex flex-col gap-0.5">
                  <div className="flex items-center gap-1.5">
                    <div
                      className={`w-2 h-2 rounded-full shrink-0 ${unit.connected ? "pulse-green" : ""}`}
                      style={{
                        background: unit.connected
                          ? "oklch(0.70 0.20 145)"
                          : "oklch(0.40 0 0)",
                      }}
                    />
                    <span className="text-xs font-medium text-foreground">
                      {unit.label}
                    </span>
                    {unit.isLive && (
                      <span
                        className="flex items-center gap-0.5 text-[9px] font-bold px-1 py-0.5 rounded"
                        style={{
                          background: "oklch(0.70 0.20 145 / 0.20)",
                          color: "oklch(0.70 0.20 145)",
                        }}
                        data-ocid={`${unit.id}.success_state`}
                      >
                        <Radio className="w-2 h-2" />
                        LIVE
                      </span>
                    )}
                  </div>
                  {unit.deviceName && (
                    <p
                      className="text-[10px] truncate pl-3.5"
                      style={{ color: "oklch(0.50 0 0)" }}
                    >
                      {unit.deviceName}
                    </p>
                  )}
                </div>

                {/* Action buttons */}
                <div className="flex flex-col gap-1">
                  {!unit.isLive && (
                    <button
                      type="button"
                      onClick={unit.onScanConnect}
                      disabled={!isSupported}
                      className="text-xs rounded-lg px-2 py-1 font-semibold transition-colors disabled:opacity-40"
                      style={{
                        background: "oklch(0.70 0.20 145 / 0.15)",
                        color: "oklch(0.70 0.20 145)",
                      }}
                      data-ocid={`${unit.id}.primary_button`}
                    >
                      Scan &amp; Connect
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={
                      unit.connected ? unit.onDisconnect : unit.onMockConnect
                    }
                    className="text-xs rounded-lg px-2 py-1 font-semibold transition-colors"
                    style={{
                      background: unit.connected
                        ? "oklch(0.63 0.24 25 / 0.15)"
                        : "oklch(0.22 0 0)",
                      color: unit.connected
                        ? "oklch(0.63 0.24 25)"
                        : "oklch(0.62 0.01 240)",
                    }}
                    data-ocid={`${unit.id}.toggle`}
                  >
                    {unit.connected ? "Disconnect" : "Connect"}
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* System Checks */}
        <section>
          <p
            className="text-xs font-semibold tracking-widest uppercase mb-2"
            style={{ color: "oklch(0.62 0.01 240)" }}
          >
            System Checks
          </p>
          <div
            className="rounded-2xl overflow-hidden"
            style={{
              background: "oklch(0.16 0 0)",
              border: "1px solid oklch(0.22 0 0)",
            }}
          >
            {[
              {
                label: "Helmet Worn",
                value: helmetWorn,
                pass: "WORN",
                fail: "NOT WORN",
              },
              {
                label: "Sobriety Check",
                value: sobrietyPass,
                pass: "PASS",
                fail: "FAIL",
              },
            ].map((check, i) => (
              <div
                key={check.label}
                className="flex items-center justify-between px-4 py-3"
                style={{
                  borderBottom: i === 0 ? "1px solid oklch(0.22 0 0)" : "none",
                }}
                data-ocid={`check.item.${i + 1}`}
              >
                <div className="flex items-center gap-2">
                  {check.value ? (
                    <CheckCircle
                      className="w-4 h-4"
                      style={{ color: "oklch(0.70 0.20 145)" }}
                    />
                  ) : (
                    <XCircle
                      className="w-4 h-4"
                      style={{ color: "oklch(0.63 0.24 25)" }}
                    />
                  )}
                  <span className="text-sm font-medium text-foreground">
                    {check.label}
                  </span>
                </div>
                <motion.span
                  key={String(check.value)}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="text-xs font-bold px-2 py-0.5 rounded-full"
                  style={{
                    background: check.value
                      ? "oklch(0.70 0.20 145 / 0.15)"
                      : "oklch(0.63 0.24 25 / 0.15)",
                    color: check.value
                      ? "oklch(0.70 0.20 145)"
                      : "oklch(0.63 0.24 25)",
                  }}
                >
                  {check.value ? check.pass : check.fail}
                </motion.span>
              </div>
            ))}
          </div>
        </section>

        {/* Battery Life */}
        <section>
          <p
            className="text-xs font-semibold tracking-widest uppercase mb-2"
            style={{ color: "oklch(0.62 0.01 240)" }}
          >
            Battery Life
          </p>
          <div
            className="rounded-2xl p-4 space-y-4"
            style={{
              background: "oklch(0.16 0 0)",
              border: "1px solid oklch(0.22 0 0)",
            }}
          >
            {[
              { label: "Helmet Battery", pct: helmetBattery, icon: Shield },
              { label: "Bike Battery", pct: bikeBattery, icon: Bike },
            ].map((bat) => (
              <div key={bat.label}>
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-1.5">
                    <bat.icon
                      className="w-3.5 h-3.5"
                      style={{ color: "oklch(0.82 0.18 80)" }}
                    />
                    <span className="text-xs font-medium text-foreground">
                      {bat.label}
                    </span>
                  </div>
                  <span
                    className="text-xs font-bold"
                    style={{ color: "oklch(0.82 0.18 80)" }}
                  >
                    {bat.pct}%
                  </span>
                </div>
                <div
                  className="h-2 rounded-full overflow-hidden"
                  style={{ background: "oklch(0.22 0 0)" }}
                >
                  <motion.div
                    className="h-full rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${bat.pct}%` }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    style={{
                      background:
                        bat.pct > 20
                          ? "linear-gradient(90deg, oklch(0.75 0.18 70), oklch(0.82 0.18 80))"
                          : "oklch(0.63 0.24 25)",
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* SOS Button */}
        <section className="pb-2">
          <p
            className="text-xs font-semibold tracking-widest uppercase mb-3"
            style={{ color: "oklch(0.62 0.01 240)" }}
          >
            Emergency
          </p>
          <div className="flex flex-col items-center gap-2">
            <motion.button
              type="button"
              whileTap={{ scale: 0.95 }}
              onClick={() => setSosOpen(true)}
              className="w-24 h-24 rounded-full font-display font-black text-2xl tracking-widest text-white sos-button flex items-center justify-center"
              style={{
                background: "oklch(0.63 0.24 25)",
                border: "3px solid oklch(0.70 0.25 25)",
              }}
              data-ocid="sos.button"
            >
              SOS
            </motion.button>
            <p className="text-xs" style={{ color: "oklch(0.62 0.01 240)" }}>
              Tap to activate emergency alert
            </p>
          </div>
        </section>
      </div>

      {/* SOS Modal */}
      <SOSModal isOpen={sosOpen} onClose={() => setSosOpen(false)} />
    </div>
  );
}
