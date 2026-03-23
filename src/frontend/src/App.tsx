import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { LayoutDashboard, Map as MapIcon, Settings2 } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { Dashboard } from "./components/Dashboard";
import { MapView } from "./components/MapView";
import { Settings } from "./components/Settings";

const queryClient = new QueryClient();

type Tab = "dashboard" | "map" | "settings";

const TABS = [
  { id: "dashboard" as Tab, label: "Home", icon: LayoutDashboard },
  { id: "map" as Tab, label: "Map", icon: MapIcon },
  { id: "settings" as Tab, label: "Settings", icon: Settings2 },
];

function AppShell() {
  const [activeTab, setActiveTab] = useState<Tab>("dashboard");

  return (
    <div
      className="min-h-screen flex items-center justify-center phone-texture"
      style={{ background: "oklch(0.07 0 0)" }}
    >
      {/* Phone Frame */}
      <div
        className="relative flex flex-col w-full max-w-sm"
        style={{
          height: "100dvh",
          maxHeight: "812px",
          borderRadius: "2.5rem",
          overflow: "hidden",
          boxShadow:
            "0 0 0 1px oklch(0.28 0 0), 0 0 0 4px oklch(0.18 0 0), 0 25px 80px oklch(0 0 0 / 0.8), 0 0 60px oklch(0.75 0.18 70 / 0.05)",
          background: "oklch(0.10 0 0)",
        }}
      >
        {/* Notch */}
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 z-50 flex items-center justify-center"
          style={{
            width: "120px",
            height: "28px",
            background: "oklch(0.06 0 0)",
            borderRadius: "0 0 18px 18px",
          }}
        >
          <div
            className="w-12 h-1.5 rounded-full"
            style={{ background: "oklch(0.22 0 0)" }}
          />
        </div>

        {/* Screen Content */}
        <div
          className="flex-1 relative overflow-hidden"
          style={{ paddingTop: "28px" }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-0"
            >
              {activeTab === "dashboard" && <Dashboard />}
              {activeTab === "map" && <MapView />}
              {activeTab === "settings" && <Settings />}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Bottom Tab Bar */}
        <div
          className="flex items-center px-4"
          style={{
            background: "oklch(0.12 0 0)",
            borderTop: "1px solid oklch(0.22 0 0)",
            paddingBottom: "max(0.75rem, env(safe-area-inset-bottom))",
            paddingTop: "0.5rem",
          }}
        >
          {TABS.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                type="button"
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className="flex-1 flex flex-col items-center gap-1 py-1 rounded-xl transition-colors"
                data-ocid={`nav.${tab.id}.link`}
              >
                <motion.div
                  animate={{
                    scale: isActive ? 1.1 : 1,
                    y: isActive ? -2 : 0,
                  }}
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                  className="w-10 h-8 flex items-center justify-center rounded-xl"
                  style={{
                    background: isActive
                      ? "oklch(0.75 0.18 70 / 0.15)"
                      : "transparent",
                  }}
                >
                  <tab.icon
                    className="w-5 h-5"
                    style={{
                      color: isActive
                        ? "oklch(0.75 0.18 70)"
                        : "oklch(0.50 0 0)",
                    }}
                  />
                </motion.div>
                <span
                  className="text-xs font-semibold"
                  style={{
                    color: isActive ? "oklch(0.75 0.18 70)" : "oklch(0.50 0 0)",
                  }}
                >
                  {tab.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Desktop background decorations */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none hidden sm:block">
        <div
          className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full opacity-5"
          style={{
            background:
              "radial-gradient(circle, oklch(0.75 0.18 70), transparent)",
            filter: "blur(80px)",
          }}
        />
        <div
          className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full opacity-5"
          style={{
            background:
              "radial-gradient(circle, oklch(0.63 0.24 25), transparent)",
            filter: "blur(80px)",
          }}
        />
      </div>

      {/* Footer */}
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-10 hidden sm:block">
        <p className="text-xs" style={{ color: "oklch(0.35 0 0)" }}>
          © {new Date().getFullYear()} Guardian Gauntlet. Built with love using{" "}
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(typeof window !== "undefined" ? window.location.hostname : "")}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "oklch(0.55 0.10 70)" }}
          >
            caffeine.ai
          </a>
        </p>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppShell />
    </QueryClientProvider>
  );
}
