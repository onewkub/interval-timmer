import { useEffect, useRef } from "react";

/**
 * Acquires a Screen Wake Lock while `active` is true and releases it when
 * `active` becomes false or the component unmounts.
 *
 * The lock is automatically re-acquired when the page becomes visible again
 * after being hidden (the browser silently revokes the lock on page hide).
 *
 * Gracefully degrades on browsers that do not support the Wake Lock API.
 */
export function useWakeLock(active: boolean) {
  const sentinelRef = useRef<WakeLockSentinel | null>(null);
  // Mirror of `active` kept in a ref so the visibilitychange handler can read
  // the current value without creating a stale closure.
  const activeRef = useRef(active);

  // Acquire or release the lock whenever `active` changes, and keep the ref
  // in sync so the visibilitychange handler always sees the latest value.
  useEffect(() => {
    activeRef.current = active;

    if (!("wakeLock" in navigator)) return;

    if (active) {
      navigator.wakeLock
        .request("screen")
        .then((lock) => {
          sentinelRef.current = lock;
        })
        .catch(() => {
          /* graceful degradation */
        });
    } else {
      sentinelRef.current?.release().catch(() => {});
      sentinelRef.current = null;
    }

    return () => {
      sentinelRef.current?.release().catch(() => {});
      sentinelRef.current = null;
    };
  }, [active]);

  // Re-acquire after the page becomes visible again (browser revokes the lock
  // on page hide). This listener is registered once for the component lifetime.
  useEffect(() => {
    if (!("wakeLock" in navigator)) return;

    function handleVisibilityChange() {
      if (document.visibilityState === "visible" && activeRef.current) {
        sentinelRef.current?.release().catch(() => {});
        sentinelRef.current = null;
        navigator.wakeLock
          .request("screen")
          .then((lock) => {
            sentinelRef.current = lock;
          })
          .catch(() => {
            /* graceful degradation */
          });
      }
    }

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);
}
