import {
  doc,
  getDoc,
  updateDoc,
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  Timestamp,
  serverTimestamp,
  onSnapshot,
} from "firebase/firestore";
import { db } from "./firebase";
import type { Guest, EventConfig, Role } from "./types";

// Serialize Firestore Timestamp to number (milliseconds)
function serializeTimestamp(ts: Timestamp | number | undefined): number {
  if (!ts) return 0;
  if (typeof ts === "number") return ts;
  return ts.toMillis();
}

// Serialize Firestore GeoPoint to Location
function serializeGeoPoint(
  geoPoint:
    | { _lat?: number; _long?: number; latitude?: number; longitude?: number }
    | null
    | undefined,
): { lat: number; lng: number } | null {
  if (!geoPoint) return null;
  return {
    lat: geoPoint._lat || geoPoint.latitude || 0,
    lng: geoPoint._long || geoPoint.longitude || 0,
  };
}

export async function getAllRoles(): Promise<Role[]> {
  try {
    const rolesRef = collection(db, "role");
    const snapshot = await getDocs(rolesRef);

    return snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        name: data.name || "",
        toGuest: data.toGuest || "",
        toHost: data.toHost || "",
      };
    }) as Role[];
  } catch (error) {
    console.error("Error fetching roles:", error);
    return [];
  }
}

export async function getRoleById(roleId: string): Promise<Role | null> {
  try {
    if (!roleId) return null;

    const roleRef = doc(db, "role", roleId);
    const snapshot = await getDoc(roleRef);

    if (!snapshot.exists()) return null;

    const data = snapshot.data();
    return {
      id: snapshot.id,
      name: data.name || "",
      toGuest: data.toGuest || "",
      toHost: data.toHost || "",
    } as Role;
  } catch (error) {
    console.error("Error fetching role:", error);
    return null;
  }
}

export async function getGuestByCode(code: string): Promise<Guest | null> {
  try {
    const guestsRef = collection(db, "guests");
    const snapshot = await getDocs(guestsRef);

    const guest = snapshot.docs.find((doc) => doc.data().uniqueCode === code);

    if (!guest) return null;

    const data = guest.data();
    return {
      id: guest.id,
      uniqueCode: data.uniqueCode,
      name: data.name,
      roleId: data.roleId || "",
      language: data.language || "vi",
      needParkingMap: data.needParkingMap || false,
      inviteLunch: data.inviteLunch || false,
      rsvpStatus: data.rsvpStatus || "pending",
      lunchStatus: data.lunchStatus || "pending",
      lastAccessedAt: serializeTimestamp(data.lastAccessedAt),
      createdAt: serializeTimestamp(data.createdAt),
    } as Guest;
  } catch (error) {
    console.error("Error fetching guest:", error);
    return null;
  }
}

export async function updateGuestRSVP(
  guestId: string,
  type: "event" | "lunch",
  status: "accepted" | "declined",
): Promise<boolean> {
  try {
    const guestRef = doc(db, "guests", guestId);
    const field = type === "event" ? "rsvpStatus" : "lunchStatus";

    await updateDoc(guestRef, {
      [field]: status,
    });

    return true;
  } catch (error) {
    console.error("Error updating RSVP:", error);
    return false;
  }
}

export async function getAllGuests(): Promise<Guest[]> {
  try {
    const guestsRef = collection(db, "guests");
    const snapshot = await getDocs(guestsRef);

    return snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        uniqueCode: data.uniqueCode,
        name: data.name,
        roleId: data.roleId || "",
        language: data.language || "vi",
        needParkingMap: data.needParkingMap || false,
        inviteLunch: data.inviteLunch || false,
        rsvpStatus: data.rsvpStatus || "pending",
        lunchStatus: data.lunchStatus || "pending",
        lastAccessedAt: serializeTimestamp(data.lastAccessedAt),
        createdAt: serializeTimestamp(data.createdAt),
      };
    }) as Guest[];
  } catch (error) {
    console.error("Error fetching guests:", error);
    return [];
  }
}

export async function createGuest(guestData: {
  uniqueCode: string;
  name: string;
  roleId?: string;
  language?: "vi" | "ja";
  needParkingMap?: boolean;
  inviteLunch?: boolean;
}): Promise<{ success: boolean; guestId?: string; error?: string }> {
  try {
    const guestsRef = collection(db, "guests");

    // Check if uniqueCode already exists
    const existingGuests = await getDocs(guestsRef);
    const codeExists = existingGuests.docs.some(
      (doc) => doc.data().uniqueCode === guestData.uniqueCode,
    );

    if (codeExists) {
      return {
        success: false,
        error: "Mã khách mời đã tồn tại",
      };
    }

    const docRef = await addDoc(guestsRef, {
      uniqueCode: guestData.uniqueCode,
      name: guestData.name,
      roleId: guestData.roleId || "",
      language: guestData.language || "vi",
      needParkingMap: guestData.needParkingMap || false,
      inviteLunch: guestData.inviteLunch || false,
      rsvpStatus: "pending",
      lunchStatus: "pending",
      createdAt: serverTimestamp(),
    });

    return {
      success: true,
      guestId: docRef.id,
    };
  } catch (error) {
    console.error("Error creating guest:", error);
    return {
      success: false,
      error: "Không thể tạo khách mời",
    };
  }
}

export async function updateGuest(
  guestId: string,
  updates: {
    name?: string;
    roleId?: string;
    language?: "vi" | "ja";
    needParkingMap?: boolean;
    inviteLunch?: boolean;
    rsvpStatus?: "pending" | "accepted" | "declined";
    lunchStatus?: "pending" | "accepted" | "declined";
  },
): Promise<boolean> {
  try {
    const guestRef = doc(db, "guests", guestId);
    await updateDoc(guestRef, updates);
    return true;
  } catch (error) {
    console.error("Error updating guest:", error);
    return false;
  }
}

export async function deleteGuest(guestId: string): Promise<boolean> {
  try {
    const guestRef = doc(db, "guests", guestId);
    await deleteDoc(guestRef);
    return true;
  } catch (error) {
    console.error("Error deleting guest:", error);
    return false;
  }
}

export async function updateGuestAccessTime(guestId: string): Promise<boolean> {
  try {
    const guestRef = doc(db, "guests", guestId);
    await updateDoc(guestRef, {
      lastAccessedAt: serverTimestamp(),
    });
    return true;
  } catch (error) {
    console.error("Error updating guest access time:", error);
    return false;
  }
}

export async function getEventConfig(): Promise<EventConfig | null> {
  try {
    const configRef = doc(db, "eventConfig", "main");
    const snapshot = await getDoc(configRef);

    if (!snapshot.exists()) return null;

    const data = snapshot.data();

    // Helper to safely get location data - handles arrays [lat, lng], GeoPoint, and flat structures
    const getLocation = (
      loc:
        | {
            location?:
              | [number, number]
              | {
                  _lat?: number;
                  _long?: number;
                  latitude?: number;
                  longitude?: number;
                };
            name?: string;
            _lat?: number;
            _long?: number;
            latitude?: number;
            longitude?: number;
          }
        | null
        | undefined,
    ): {
      lat: number;
      lng: number;
      name: string;
    } => {
      if (!loc) return { lat: 0, lng: 0, name: "" };

      let coords: { lat: number; lng: number } | null = null;

      // Try nested location first - check if it's an array [lat, lng]
      if (loc.location && Array.isArray(loc.location)) {
        coords = {
          lat: loc.location[0] || 0,
          lng: loc.location[1] || 0,
        };
      }
      // Try nested location as GeoPoint
      else if (loc.location) {
        coords = serializeGeoPoint(loc.location);
      }

      // If not found, try flat structure
      if (!coords) {
        coords = serializeGeoPoint(
          loc as {
            _lat?: number;
            _long?: number;
            latitude?: number;
            longitude?: number;
          },
        );
      }

      // Fallback
      if (!coords) {
        coords = { lat: 0, lng: 0 };
      }

      return {
        lat: coords.lat,
        lng: coords.lng,
        name:
          loc && typeof loc === "object" && "name" in loc ? loc.name || "" : "",
      };
    };

    const waitingRoomLocation = getLocation(data.waitingRoom);

    return {
      id: snapshot.id,
      eventDate: serializeTimestamp(data.eventDate),
      liveMode: data.liveMode || false,
      graduationLocation: {
        location: getLocation(data.graduationLocation),
        name: data.graduationLocation?.name || "",
        name_ja: data.graduationLocation?.name_ja || "",
      },
      photoSpot: {
        location: getLocation(data.photoSpot),
        name: data.photoSpot?.name || "",
        name_ja: data.photoSpot?.name_ja || "",
      },
      parkingLocation: {
        location: getLocation(data.parkingLocation),
        name: data.parkingLocation?.name || "Parking",
      },
      lunchLocation: {
        location: getLocation(data.lunchLocation),
        name: data.lunchLocation?.name || "Lunch",
      },
      waitingRoom: {
        enabled: data.waitingRoom?.enabled || false,
        name: data.waitingRoom?.name || "Waiting Room",
        name_ja: data.waitingRoom?.name_ja || "Waiting Room",
        lat: waitingRoomLocation.lat,
        lng: waitingRoomLocation.lng,
      },
    } as EventConfig;
  } catch (error) {
    console.error("Error fetching event config:", error);
    return null;
  }
}

export async function updateEventConfig(
  updates: Partial<EventConfig>,
): Promise<boolean> {
  try {
    const configRef = doc(db, "eventConfig", "main");
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id, ...dataToUpdate } = updates;
    await updateDoc(configRef, dataToUpdate);
    return true;
  } catch (error) {
    console.error("Error updating event config:", error);
    return false;
  }
}

export interface Notification {
  notificationId: string;
  guestId: string;
  guestName: string;
  status: "accepted" | "declined";
  type: "event" | "lunch";
  timestamp: number;
  isRead: boolean;
}

// Save notification to Firestore
export async function saveNotification(
  notification: Omit<Notification, "notificationId">,
): Promise<string | null> {
  try {
    const notificationsRef = collection(db, "notifications");

    const docRef = await addDoc(notificationsRef, {
      ...notification,
      createdAt: serverTimestamp(),
    });

    return docRef.id;
  } catch (error) {
    console.error("Error saving notification:", error);
    return null;
  }
}

// Mark notification as read
export async function markNotificationAsRead(
  notificationId: string,
): Promise<boolean> {
  try {
    const notifRef = doc(db, "notifications", notificationId);
    await updateDoc(notifRef, {
      isRead: true,
    });
    return true;
  } catch (error) {
    console.error("Error marking notification as read:", error);
    return false;
  }
}

// Mark all notifications as read
export async function markAllNotificationsAsRead(): Promise<boolean> {
  try {
    const notificationsRef = collection(db, "notifications");
    const snapshot = await getDocs(notificationsRef);

    for (const docSnapshot of snapshot.docs) {
      if (!docSnapshot.data().isRead) {
        await updateDoc(docSnapshot.ref, { isRead: true });
      }
    }

    return true;
  } catch (error) {
    console.error("Error marking all notifications as read:", error);
    return false;
  }
}

// Get all notifications
export async function getAllNotifications(): Promise<Notification[]> {
  try {
    const notificationsRef = collection(db, "notifications");
    const snapshot = await getDocs(notificationsRef);

    return snapshot.docs
      .map((doc) => {
        const data = doc.data();
        return {
          notificationId: doc.id,
          guestId: data.guestId,
          guestName: data.guestName,
          status: data.status,
          type: data.type,
          timestamp: serializeTimestamp(data.createdAt),
          isRead: data.isRead || false,
        };
      })
      .sort((a, b) => b.timestamp - a.timestamp) as Notification[];
  } catch (error) {
    console.error("Error fetching notifications:", error);
    return [];
  }
}

// Subscribe to notification changes
export function subscribeToNotifications(
  callback: (notifications: Notification[]) => void,
): () => void {
  const notificationsRef = collection(db, "notifications");

  const unsubscribe = onSnapshot(
    notificationsRef,
    (snapshot) => {
      const notifications = snapshot.docs
        .map((doc) => {
          const data = doc.data();
          return {
            notificationId: doc.id,
            guestId: data.guestId,
            guestName: data.guestName,
            status: data.status,
            type: data.type,
            timestamp: serializeTimestamp(data.createdAt),
            isRead: data.isRead || false,
          };
        })
        .sort((a, b) => b.timestamp - a.timestamp) as Notification[];

      callback(notifications);
    },
    (error) => {
      console.error("Error subscribing to notifications:", error);
    },
  );

  return unsubscribe;
}

export function subscribeToGuestChanges(
  callback: (notifications: Notification[]) => void,
): () => void {
  const guestsRef = collection(db, "guests");

  const unsubscribe = onSnapshot(
    guestsRef,
    async (snapshot) => {
      for (const change of snapshot.docChanges()) {
        if (change.type === "modified") {
          const data = change.doc.data();
          const docId = change.doc.id;

          // Check if RSVP status changed
          if (
            data.rsvpStatus === "accepted" ||
            data.rsvpStatus === "declined"
          ) {
            const notification: Omit<Notification, "notificationId"> = {
              guestId: docId,
              guestName: data.name || "Guest",
              status: data.rsvpStatus,
              type: "event",
              timestamp: Date.now(),
              isRead: false,
            };

            // Save to Firestore
            await saveNotification(notification);
          }

          // Check if lunch status changed
          if (
            data.lunchStatus === "accepted" ||
            data.lunchStatus === "declined"
          ) {
            const notification: Omit<Notification, "notificationId"> = {
              guestId: docId,
              guestName: data.name || "Guest",
              status: data.lunchStatus,
              type: "lunch",
              timestamp: Date.now(),
              isRead: false,
            };

            // Save to Firestore
            await saveNotification(notification);
          }
        }
      }
    },
    (error) => {
      console.error("Error subscribing to guest changes:", error);
    },
  );

  return unsubscribe;
}
