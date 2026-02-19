export interface Role {
  id: string;
  name: string;
  toGuest: string; // Cách xưng hô với khách (VD: "anh", "chị", "bạn")
  toHost: string; // Cách khách tự xưng (VD: "em", "mình")
}

export interface Guest {
  id: string;
  uniqueCode: string;
  name: string;
  roleId: string;
  needParkingMap: boolean;
  inviteLunch: boolean;
  rsvpStatus: "pending" | "accepted" | "declined";
  lunchStatus: "pending" | "accepted" | "declined";
  createdAt: number;
}

export interface Location {
  lat: number;
  lng: number;
  name: string;
}

export interface LiveLocation {
  lat: number;
  lng: number;
  altitude: number;
  updatedAt: number;
}

export interface EventConfig {
  id: string;
  eventDate: number;
  liveMode: boolean;
  graduationLocation: { location: Location; name: string };
  photoSpot: { location: Location; name: string };
  parkingLocation: { location: Location; name: string };
  lunchLocation: { location: Location; name: string };
  waitingRoom: {
    enabled: boolean;
    name: string;
    lat: number;
    lng: number;
  };
}
