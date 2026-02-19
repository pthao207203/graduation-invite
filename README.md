# 🎓 Graduation Invitation Web App

A production-ready graduation invitation system built with Next.js 14, TypeScript, Tailwind CSS, Firebase, and Leaflet for interactive maps.

## 🚀 Features

- **Personalized Invitations**: Each guest gets a unique invitation page with their name
- **Real-time Countdown**: Dynamic countdown timer to the graduation ceremony
- **Interactive Maps**: Leaflet-powered maps showing venue, parking, photo spots, and more
- **Live Location Tracking**: Real-time location updates during the event
- **RSVP System**: Guests can accept/decline for both ceremony and lunch
- **Admin Dashboard**: Manage all guests, view statistics, and control settings
- **Conditional Content**: Show parking/lunch information based on guest preferences

## 📁 Project Structure

```
graduation-invite/
├── app/
│   ├── admin/
│   │   └── page.tsx              # Admin dashboard
│   ├── api/
│   │   └── rsvp/
│   │       └── route.ts          # RSVP API endpoint
│   ├── invite/[code]/
│   │   ├── page.tsx              # Dynamic invitation page
│   │   └── not-found.tsx         # 404 page for invalid codes
│   ├── globals.css               # Global styles + Leaflet CSS
│   ├── layout.tsx                # Root layout
│   └── page.tsx                  # Home page
├── components/
│   ├── InvitationCard.tsx        # Invitation with countdown
│   ├── MapSection.tsx            # Interactive map component
│   └── RSVPButtons.tsx           # RSVP action buttons
├── lib/
│   ├── firebase.ts               # Firebase initialization
│   ├── firestore.ts              # Firestore utilities
│   ├── realtime.ts               # Realtime Database utilities
│   └── types.ts                  # TypeScript types
└── package.json
```

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **Database**: Firebase Firestore + Realtime Database
- **Maps**: Leaflet + React-Leaflet (OpenStreetMap)

## 📦 Installation

1. **Install dependencies**

```bash
npm install
```

2. **Set up environment variables**

Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

Edit `.env.local` with your Firebase credentials:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_FIREBASE_DATABASE_URL=https://your_project_id-default-rtdb.firebaseio.com
```

3. **Configure Firebase**

Create a Firebase project at https://console.firebase.google.com and:

- Enable Firestore Database
- Enable Realtime Database
- Get your web app credentials

## 🔥 Firebase Setup

### Firestore Collections

#### 1. `guests` Collection

Example document:

```json
{
  "uniqueCode": "ABC123",
  "name": "John Doe",
  "needParkingMap": true,
  "inviteLunch": true,
  "rsvpEvent": null,
  "rsvpLunch": null
}
```

#### 2. `settings` Collection (document ID: `app`)

Example document:

```json
{
  "graduationLocation": {
    "lat": 10.762622,
    "lng": 106.660172,
    "name": "University Hall",
    "description": "Main graduation venue"
  },
  "parkingLocation": {
    "lat": 10.763,
    "lng": 106.6595,
    "name": "Campus Parking Lot"
  },
  "waitingRoom": {
    "enabled": true,
    "location": {
      "lat": 10.7625,
      "lng": 106.66,
      "name": "Guest Waiting Area"
    }
  },
  "photoSpot": {
    "lat": 10.7628,
    "lng": 106.6608,
    "name": "Photo Point"
  },
  "lunchLocation": {
    "lat": 10.7635,
    "lng": 106.661,
    "name": "Celebration Restaurant"
  },
  "liveMode": false
}
```

### Realtime Database

Create a node at `/liveLocation`:

```json
{
  "liveLocation": {
    "lat": 10.762622,
    "lng": 106.660172,
    "altitude": 10,
    "updatedAt": 1708531200000
  }
}
```

## 🏃 Running the App

### Development Mode

```bash
npm run dev
```

Visit:

- Home: http://localhost:3000
- Admin: http://localhost:3000/admin
- Invite: http://localhost:3000/invite/ABC123

### Production Build

```bash
npm run build
npm start
```

## 📱 Usage Guide

### For Guests

1. Receive unique invitation code
2. Visit `/invite/[code]`
3. View personalized invitation with countdown
4. RSVP for ceremony and lunch
5. View interactive map with all locations

### For Administrators

1. Visit `/admin`
2. View all guests and RSVP statistics
3. Toggle waiting room and live mode
4. Preview guest invitations

## 🗺️ Map Features

- **Red marker**: Graduation venue
- **Blue marker**: Parking area
- **Green marker**: Waiting room
- **Purple marker**: Photo spot
- **Orange marker**: Lunch venue
- **Gold marker**: Live location

## 🚀 Deployment

Deploy to Vercel:

```bash
npm i -g vercel
vercel
```

Or push to GitHub and import in Vercel dashboard.
