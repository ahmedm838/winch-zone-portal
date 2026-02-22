import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";

const KEY = "wz_last_activity";
const MAX_IDLE_MS = 30 * 60 * 1000; // 30 minutes

function now() {
  return Date.now();
}

function setLastActivity(ts: number) {
  try { localStorage.setItem(KEY, String(ts)); } catch {}
}

function getLastActivity(): number {
  try {
    const v = localStorage.getItem(KEY);
    const n = v ? Number(v) : NaN;
    return Number.isFinite(n) ? n : now();
  } catch {
    return now();
  }
}

export function SessionTimeout() {
  const nav = useNavigate();
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    // Initialize
    setLastActivity(getLastActivity());

    const bump = () => setLastActivity(now());

    const events: (keyof WindowEventMap)[] = [
      "mousemove",
      "mousedown",
      "keydown",
      "scroll",
      "touchstart",
      "click",
      "focus",
    ];

    events.forEach((ev) => window.addEventListener(ev, bump, { passive: true }));
    const onStorage = (e: StorageEvent) => {
      if (e.key === KEY) {
        // no-op; interval will read latest value
      }
    };
    window.addEventListener("storage", onStorage);

    async function tick() {
      const { data } = await supabase.auth.getSession();
      if (!data.session) return;

      const last = getLastActivity();
      if (now() - last > MAX_IDLE_MS) {
        try { await supabase.auth.signOut(); } catch {}
        setLastActivity(now());
        nav("/", { replace: true });
      }
    }

    // check every 20 seconds (cheap; avoids long timers being throttled)
    intervalRef.current = window.setInterval(() => { void tick(); }, 20_000);

    return () => {
      events.forEach((ev) => window.removeEventListener(ev, bump as any));
      window.removeEventListener("storage", onStorage);
      if (intervalRef.current) window.clearInterval(intervalRef.current);
    };
  }, [nav]);

  return null;
}
