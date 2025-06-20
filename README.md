# Event Check-In App

A full-stack real-time event check-in system built with **GraphQL, Prisma, PostgreSQL, Socket.io, Apollo Client, React Native (Expo), and Zustand**.

---

## 🚀 Features

### ✅ Authentication

* Simple login via email & name
* JWT token generation using `jsonwebtoken`
* Authenticated GraphQL requests with token validation

### 📋 Events Management

* List all events (name, location, start time, attendees)
* Create new events dynamically
* Join events as a logged-in user
* Real-time updates on event joins using Socket.io
* View full details of an event (with attendees list)

### 🛠 Tech Stack

* **Backend**: Node.js, Express, GraphQL, Prisma, PostgreSQL
* **Frontend**: React Native (Expo), Apollo Client, Zustand
* **Real-time**: Socket.io

---

## 📁 Project Structure

### Backend (`event-checkin-backend`)

```
.
├── prisma/
│   └── schema.prisma         # DB schema
├── src/
│   ├── index.ts              # Entry point
│   ├── schema.ts             # GraphQL schema & resolvers
│   ├── context.ts            # Auth + Prisma + Socket context
│   ├── auth.ts               # JWT helper methods
│   ├── socket.ts             # Socket.io setup
│   └── routes/login.ts       # Login endpoint for token
```

### Frontend (`event-checkin-app`)

```
.
├── src/
│   ├── screens/
│   │   ├── LoginScreen.tsx
│   │   ├── EventListScreen.tsx
│   │   └── EventDetailScreen.tsx
│   ├── graphql/
│   │   ├── queries.ts
│   │   └── mutations.ts
│   └── store/
│       └── authStore.ts      # Zustand token store
├── App.tsx                   # Root Navigator + Apollo Provider
```

---

## ▶️ How to Run This Project

### 📦 Backend Setup

```bash
# 1. Clone the repo
cd event-checkin-backend

# 2. Install dependencies
npm install

# 3. Setup PostgreSQL locally (or use a service like Supabase)
# Make sure your `.env` file contains the correct DATABASE_URL

# 4. Generate Prisma client & migrate schema
npx prisma generate
npx prisma migrate dev --name init

# 5. Run the backend
npm run dev
```

> Server will be running at: `http://localhost:4000/graphql`

### 📱 Frontend Setup (React Native + Expo)

```bash
# 1. Go to frontend folder
cd event-checkin-app

# 2. Install dependencies
npm install

# 3. Start Expo development server
npx expo start

# 4. Scan QR Code in Expo Go App on your mobile
```

> Make sure both devices (backend server + mobile phone) are on the same WiFi.
> Update the backend IP (`http://<your-ip>:4000/graphql`) in `App.tsx` accordingly.

---

## 🧪 How It Works

### 1. Login

* User enters email & name
* Backend returns JWT token
* Token is stored using Zustand and used in all GraphQL headers

### 2. Fetch Events

* Uses `GET_EVENTS` query
* Apollo displays event cards in a FlatList

### 3. Join Event

* Calls `joinEvent(eventId)` mutation
* If user not in DB, backend creates it
* Then links user to event
* Emits `eventUpdate` via socket

### 4. Create Event

* Form sends `createEvent(name, location, startTime)` mutation
* New event appears in the list instantly via socket update

### 5. Event Details

* Navigates to `EventDetailScreen`
* Uses `event(id)` query to get attendees
* Shows message if current user already joined

---

## 🧠 Important Concepts

### 🔐 JWT Auth

* `login.ts` issues a token
* `context.ts` validates token on each request

### 🧵 Real-Time Socket.io

* Server emits `eventUpdate`
* React Native listens and refetches data

### 💾 Zustand Auth Store

```ts
const useAuthStore = create((set) => ({
  token: null,
  setToken: (token) => set({ token }),
  logout: () => set({ token: null }),
}));
```

---

## 🌐 APIs Overview

### GraphQL Queries

```graphql
query GetEvents {
  events {
    id, name, location, startTime, attendees { id, name }
  }
}

query Me {
  me { id, name, email }
}

query Event($eventId: String!) {
  event(id: $eventId) { ... }
}
```

### GraphQL Mutations

```graphql
mutation JoinEvent($eventId: String!) {
  joinEvent(eventId: $eventId) { id, name }
}

mutation CreateEvent($name: String!, $location: String!, $startTime: String!) {
  createEvent(...) { id, name }
}
```

### REST Endpoint

```
POST /api/login
Body: { email, name }
Response: { token }
```

---

## ✅ What’s Done

* [x] GraphQL backend with Prisma/Postgres
* [x] JWT login + token-based context
* [x] Join event logic with user auto-creation
* [x] Real-time updates using Socket.io
* [x] React Native app with login, join, create, and view details

---

## ✨ Future Improvements

* Leave event mutation
* My Events tab
* Date/time picker in Create form
* Event sorting/filtering

---

## 🧑‍💻 Developed by Sanjana Patel

**Full Stack Developer Intern Assignment Completed ✅**
