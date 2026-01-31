# Calendar-Based Class Scheduling System

A full-stack MERN application for managing **one-time and recurring class schedules**

---

## Tech Stack

### Frontend

- React + TypeScript
- Vite
- FullCalendar
- React Hook Form
- Zod
- @tanstack/react-query
- Axios
- Tailwind CSS
- Lucide Icons

### Backend

- Node.js
- Express.js
- TypeScript
- MongoDB + Mongoose
- date-fns
- Zod (validation)

---

## Project Structure

```
root/
├── api/
│   ├── src/
│   │   ├── controllers/
│   │   ├── database/
│   │   │   └── models/
│   │   ├── logger/
│   │   ├── middleware/
│   │   ├── routes/
│   │   ├── utils/
│   │   ├── zodSchema/
│   │   ├── app.ts
│   │   └── server.ts
│   └── .env
│
├── web/
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── pages/
│   │   ├── types/
│   │   ├── utils/
│   │   └── main.tsx
│   └── .env
│
└── README.md
```

---

## Environment Configuration

### Backend (`api/.env`)

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/plexcal
NODE_ENV=development
```

### Frontend (`web/.env`)

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

---

## Project Setup

### 1. Clone the repository

```bash
git clone <repo-url>
cd plexcal
```

### 2. Prerequisites

- **Node.js** (v18+ recommended)
- **MongoDB** running locally or a connection string

### 3. Run backend and frontend

See sections below for running the API and web app.

---

## Running the Backend

```bash
cd api
npm install
npm run dev
```

Backend will run at:

```
http://localhost:5000
```

---

## Running the Frontend

```bash
cd web
npm install
npm run dev
```

Frontend will run at:

```
http://localhost:5173
```

---

## API Documentation

### Base URL

```
http://localhost:5000/api
```

### Class Types

| Method | Endpoint               | Description          |
| ------ | ---------------------- | -------------------- |
| GET    | `/api/class-types`     | List all class types |
| POST   | `/api/class-types`     | Create a class type  |
| GET    | `/api/class-types/:id` | Get class type by ID |
| PATCH  | `/api/class-types/:id` | Update a class type  |
| DELETE | `/api/class-types/:id` | Delete a class type  |

---

## Create Class Schedule

### Endpoint

```
POST /api/class-schedules
```

### Request Body (One-Time Class)

```json
{
  "title": "Yoga Class",
  "classType": "online",
  "instructor": "Chad",
  "startDate": "2026-02-01T09:00:00.000Z",
  "duration": 60,
  "isRecurring": false
}
```

### Request Body (Recurring – Weekly)

```json
{
  "title": "Pilates",
  "classType": "online",
  "instructor": "Chad",
  "startDate": "2026-02-01",
  "duration": 60,
  "isRecurring": true,
  "recurrence": {
    "type": "weekly",
    "days": [1, 4],
    "times": ["10:00", "17:00"]
  }
}
```

### Success Response (No Pagination)

```json
{
  "title": "Class schedule created",
  "message": "Class schedule added successfully",
  "data": {
    "_id": "65b...",
    "title": "Yoga Class"
  }
}
```

### Error Response (Time Collision)

```json
{
  "title": "Time Collision",
  "message": "This class overlaps with an existing scheduled class",
  "errors": []
}
```

---

## Fetch Class Schedules (Paginated)

### Endpoint

```
GET /api/class-schedules?page=1&limit=10
```

### Success Response (With Pagination)

```json
{
  "title": "Classes fetched",
  "message": "Class list loaded",
  "data": [...],
  "pagination": {
    "total": 120,
    "page": 1,
    "limit": 10,
    "totalPages": 12
  }
}
```

---

## Scheduling Logic Explained

### One-Time Classes

- Stored with a single `startDate`
- Rendered once on the calendar
- No recurrence logic applied

### Recurring Classes

Recurring classes store **rules**, not concrete dates.

Supported recurrence types:

- Daily
- Weekly
- Monthly
- Custom (interval-based)

Example:

```json
{
  "type": "weekly",
  "days": [1, 4],
  "times": ["10:00", "17:00"]
}
```

### How Recurrence Works Internally

1. **Database stores recurrence rules**
2. On fetch or validation:
   - Rules are expanded into concrete occurrences
   - Expansion is limited to a time window (e.g., next 90 days)

3. Each occurrence generates:
   - `start = parsed date + time`
   - `end = start + duration`

### Time Collision Detection

Collision detection works by:

1. Expanding **new schedule** into occurrences
2. Expanding **existing schedules** into occurrences
3. Comparing each occurrence using:

```ts
newStart < existingEnd && newEnd > existingStart;
```

This guarantees:

- No overlapping classes
- Works for recurring + non-recurring
