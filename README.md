# Google Calendar Clone — High fidelity (Assignment)

## Overview
This project is a high-fidelity clone of Google Calendar built with Next.js (App Router), Tailwind CSS, Prisma + SQLite, and NextAuth for Google authentication.

## Live demo
> https://google-calendar-5p6i.vercel.app/calendar

## Tech stack
- Frontend: Next.js (App Router), React, TailwindCSS
- Backend: Node.js with Next.js API routes
- Database: MongoDB with Mongoose
- Date handling: Native JavaScript Date object
- Styling: CSS modules and Tailwind CSS

## Getting started (development)

1. Clone
```bash
git clone https://github.com/<your-username>/<repo>.git
cd <repo>
```
2.Install
```bash
npm install
```
3.Environment variables (create .env.local)
```bash
MONGODB_URI=your-mongodb-connection-string
```

4.Setup MongoDB
- Create a MongoDB database (local or Atlas)
- Add your MongoDB connection string to .env.local
Run dev server
npm run dev
Open http://localhost:3000 — landing page -> login -> calendar
```
5.API Endpoints
```bash
GET /api/events — fetch events (optionally ?userId=...)
POST /api/events — create event (body contains start,end,title,...)
GET /api/events/:id — get event
PUT /api/events/:id — update event
DELETE /api/events/:id — delete event
```
6.Data model
```typescript
Event {
  _id: ObjectId,
  title: string,
  description?: string,
  date: string,      // YYYY-MM-DD format
  startTime?: string, // HH:mm format
  endTime?: string,   // HH:mm format
  createdAt: Date,
  updatedAt: Date
}
```

Business logic & features
- Event creation with title, date, and optional time slots
- Event preview with edit and delete capabilities
- Proper MongoDB ID handling and error management
- RESTful API with proper status codes
- Responsive calendar grid with date selection
- Modal interfaces for event management
- Clean and intuitive user interface using framer-motion as optional.
7.Architecture & choices
- MongoDB for robust, scalable document storage and easy schema evolution
- Next.js App Router for modern routing and server components
- Simple and efficient event CRUD operations
- RESTful API design with proper error handling
- Mongoose for MongoDB schema management and validation

Current Features
- Create, read, update, and delete calendar events
- Interactive calendar grid with date selection
- Event preview with quick actions
- Start time and end time support
- Simple and intuitive user interface

Future enhancements
- Authentication and user management
- 
- Drag-and-drop to move/resize events
- 
- Event recurrence patterns
- Event sharing & invitations
- Multiple calendar views (week, month, agenda)
- Timezone support
- WebSockets for live updates across clients

How to run production build

npm run build

npm run dev
