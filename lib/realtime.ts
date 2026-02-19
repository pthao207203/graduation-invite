import { ref, onValue, off } from "firebase/database";
import { rtdb } from "./firebase";
import type { LiveLocation } from "./types";

export function subscribeLiveLocation(
  callback: (location: LiveLocation | null) => void,
): () => void {
  const locationRef = ref(rtdb, "liveLocation");

  const unsubscribe = onValue(locationRef, (snapshot) => {
    const data = snapshot.val();
    callback(data);
  });

  return () => {
    off(locationRef);
  };
}
