import { Button } from "@/components/ui/button";
import { AlertTriangle, CheckCircle, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";

interface SOSModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SOSModal({ isOpen, onClose }: SOSModalProps) {
  const [countdown, setCountdown] = useState(10);
  const [activated, setActivated] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (isOpen) {
      setCountdown(10);
      setActivated(false);
      intervalRef.current = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(intervalRef.current!);
            setActivated(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isOpen]);

  const handleCancel = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    onClose();
  };

  const radius = 44;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference * (1 - countdown / 10);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 z-50 flex flex-col items-center justify-center rounded-[2.5rem] overflow-hidden"
          style={{ background: "oklch(0.08 0 0 / 0.97)" }}
          data-ocid="sos.modal"
        >
          <AnimatePresence mode="wait">
            {!activated ? (
              <motion.div
                key="countdown"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="flex flex-col items-center gap-5 px-8 text-center"
              >
                <div
                  className="w-14 h-14 rounded-full flex items-center justify-center"
                  style={{ background: "oklch(0.63 0.24 25 / 0.2)" }}
                >
                  <AlertTriangle
                    className="w-7 h-7"
                    style={{ color: "oklch(0.63 0.24 25)" }}
                  />
                </div>
                <div>
                  <h2 className="font-display text-2xl font-bold tracking-widest text-foreground uppercase">
                    Emergency SOS
                  </h2>
                  <p className="text-muted-foreground text-sm mt-1">
                    Activating emergency protocol in:
                  </p>
                </div>

                <div className="relative w-32 h-32">
                  <svg
                    className="w-32 h-32 -rotate-90"
                    viewBox="0 0 100 100"
                    role="img"
                    aria-label={`Countdown: ${countdown} seconds`}
                  >
                    <circle
                      cx="50"
                      cy="50"
                      r={radius}
                      fill="none"
                      stroke="oklch(0.22 0 0)"
                      strokeWidth="6"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r={radius}
                      fill="none"
                      stroke="oklch(0.63 0.24 25)"
                      strokeWidth="6"
                      strokeLinecap="round"
                      strokeDasharray={circumference}
                      strokeDashoffset={dashOffset}
                      style={{ transition: "stroke-dashoffset 0.9s linear" }}
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span
                      className="font-display text-5xl font-black"
                      style={{ color: "oklch(0.63 0.24 25)" }}
                    >
                      {countdown}
                    </span>
                  </div>
                </div>

                <Button
                  variant="outline"
                  onClick={handleCancel}
                  className="w-full h-12 text-base font-semibold tracking-widest uppercase border-border text-foreground"
                  data-ocid="sos.cancel_button"
                >
                  <X className="w-4 h-4 mr-2" />
                  Cancel
                </Button>
              </motion.div>
            ) : (
              <motion.div
                key="activated"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="flex flex-col items-center gap-5 px-8 text-center"
                data-ocid="sos.success_state"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  className="w-20 h-20 rounded-full flex items-center justify-center"
                  style={{ background: "oklch(0.70 0.20 145 / 0.2)" }}
                >
                  <CheckCircle
                    className="w-10 h-10"
                    style={{ color: "oklch(0.70 0.20 145)" }}
                  />
                </motion.div>
                <div>
                  <h2 className="font-display text-2xl font-bold tracking-wide text-foreground">
                    Emergency Activated!
                  </h2>
                  <p className="text-muted-foreground text-sm mt-2 leading-relaxed">
                    SMS sent with GPS location.
                    <br />
                    Emergency contact auto-dialed.
                  </p>
                </div>
                <div
                  className="w-full rounded-xl p-3 text-xs space-y-1"
                  style={{
                    background: "oklch(0.70 0.20 145 / 0.1)",
                    border: "1px solid oklch(0.70 0.20 145 / 0.3)",
                  }}
                >
                  <p style={{ color: "oklch(0.70 0.20 145)" }}>
                    📍 Location: 14.5995° N, 120.9842° E
                  </p>
                  <p style={{ color: "oklch(0.70 0.20 145)" }}>
                    📞 Calling: Juan dela Cruz
                  </p>
                </div>
                <Button
                  onClick={onClose}
                  className="w-full h-12 text-base font-semibold"
                  style={{ background: "oklch(0.70 0.20 145)", color: "#000" }}
                  data-ocid="sos.close_button"
                >
                  Close
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
