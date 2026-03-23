import { MapPin, Navigation, Signal, Zap } from "lucide-react";
import { useEffect, useState } from "react";

export function MapView() {
  const [speed] = useState(42);
  const [coords] = useState({ lat: 14.5995, lng: 120.9842 });
  const [heading, setHeading] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setHeading((prev) => (prev + 2) % 360);
    }, 100);
    return () => clearInterval(interval);
  }, []);

  const mapUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${coords.lng - 0.02}%2C${coords.lat - 0.015}%2C${coords.lng + 0.02}%2C${coords.lat + 0.015}&layer=mapnik&marker=${coords.lat}%2C${coords.lng}`;

  return (
    <div
      className="flex flex-col h-full"
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
          <Navigation
            className="w-4 h-4"
            style={{ color: "oklch(0.75 0.18 70)" }}
          />
        </div>
        <div className="flex-1">
          <h1
            className="font-display text-sm font-bold tracking-widest uppercase"
            style={{ color: "oklch(0.75 0.18 70)" }}
          >
            Live Tracking
          </h1>
          <p className="text-xs" style={{ color: "oklch(0.62 0.01 240)" }}>
            Real-time GPS
          </p>
        </div>
        <div
          className="flex items-center gap-1 px-2 py-1 rounded-full"
          style={{
            background: "oklch(0.70 0.20 145 / 0.15)",
            border: "1px solid oklch(0.70 0.20 145 / 0.3)",
          }}
        >
          <div
            className="w-1.5 h-1.5 rounded-full pulse-green"
            style={{ background: "oklch(0.70 0.20 145)" }}
          />
          <span
            className="text-xs font-bold"
            style={{ color: "oklch(0.70 0.20 145)" }}
          >
            GPS: ACTIVE
          </span>
        </div>
      </div>

      {/* Map */}
      <div className="relative flex-1 min-h-0">
        <iframe
          title="Live GPS Map"
          src={mapUrl}
          className="w-full h-full"
          style={{
            border: "none",
            filter: "invert(0.9) hue-rotate(180deg) saturate(0.8)",
          }}
          loading="lazy"
          data-ocid="map.canvas_target"
        />
        {/* Overlay marker */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="relative">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center shadow-lg"
              style={{
                background: "oklch(0.75 0.18 70)",
                transform: `rotate(${heading}deg)`,
              }}
            >
              <Navigation className="w-4 h-4" style={{ color: "#000" }} />
            </div>
            <div
              className="absolute -inset-1 rounded-full pulse-green opacity-50"
              style={{ border: "2px solid oklch(0.70 0.20 145)" }}
            />
          </div>
        </div>
      </div>

      {/* Info Card */}
      <div
        className="px-4 py-3 space-y-3"
        style={{
          borderTop: "1px solid oklch(0.22 0 0)",
          background: "oklch(0.12 0 0)",
        }}
      >
        <div className="flex items-center justify-between">
          <span
            className="text-xs font-semibold tracking-widest uppercase"
            style={{ color: "oklch(0.62 0.01 240)" }}
          >
            Last Known Location
          </span>
          <MapPin
            className="w-3.5 h-3.5"
            style={{ color: "oklch(0.75 0.18 70)" }}
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div
            className="rounded-xl p-3"
            style={{
              background: "oklch(0.16 0 0)",
              border: "1px solid oklch(0.22 0 0)",
            }}
          >
            <p className="text-xs" style={{ color: "oklch(0.62 0.01 240)" }}>
              Coordinates
            </p>
            <p className="text-xs font-mono font-medium text-foreground mt-0.5">
              {coords.lat}° N
            </p>
            <p className="text-xs font-mono font-medium text-foreground">
              {coords.lng}° E
            </p>
          </div>
          <div
            className="rounded-xl p-3"
            style={{
              background: "oklch(0.16 0 0)",
              border: "1px solid oklch(0.22 0 0)",
            }}
          >
            <p className="text-xs" style={{ color: "oklch(0.62 0.01 240)" }}>
              Speed
            </p>
            <div className="flex items-end gap-1 mt-0.5">
              <Zap
                className="w-3.5 h-3.5 mb-0.5"
                style={{ color: "oklch(0.82 0.18 80)" }}
              />
              <span
                className="text-xl font-display font-bold"
                style={{ color: "oklch(0.82 0.18 80)" }}
              >
                {speed}
              </span>
              <span
                className="text-xs"
                style={{ color: "oklch(0.62 0.01 240)" }}
              >
                km/h
              </span>
            </div>
          </div>
        </div>
        <div
          className="flex items-center gap-2 px-3 py-2 rounded-xl"
          style={{ background: "oklch(0.16 0 0)" }}
        >
          <Signal
            className="w-3.5 h-3.5"
            style={{ color: "oklch(0.75 0.18 70)" }}
          />
          <span className="text-xs text-foreground">
            Manila, Philippines — Bonifacio Global City
          </span>
        </div>
      </div>
    </div>
  );
}
