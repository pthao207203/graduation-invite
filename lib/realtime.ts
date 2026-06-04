import { ref, onValue, off } from "firebase/database";
import { getRtdb } from "./firebase";
import type { LiveLocation } from "./types";

export function subscribeLiveLocation(
  callback: (location: LiveLocation | null) => void,
): () => void {
  const rtdb = getRtdb();

  // Realtime Database not configured — live location is simply unavailable.
  if (!rtdb) {
    callback(null);
    return () => {};
  }

  const locationRef = ref(rtdb, "liveLocation");

  const unsubscribe = onValue(locationRef, (snapshot) => {
    const data = snapshot.val();
    callback(data);
  });

  return () => {
    off(locationRef);
  };
}
