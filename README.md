# MERN Task Tracker

A production-ready task tracker built with MongoDB, Express, React, and Node.js. It includes a polished responsive dashboard, full CRUD APIs, search, filters, sorting, dark mode, draft persistence, animated stats, and toast-driven UX.

## Features

- Create, read, update, and delete tasks without page refreshes
- Search by task title or description
- Filter by status and priority
- Sort by newest, oldest, due date, or priority
- Inline title validation
- Confirmation modal before delete
- Dark mode stored in local storage
- Local storage draft while creating a task
- Loading states, empty state, hover effects, and Framer Motion animations

## Tech Stack

Frontend: React, Vite, React Router, Axios, React Icons, Framer Motion, React Hot Toast, CSS

Backend: Node.js, Express, MongoDB Atlas, Mongoose, CORS, dotenv

## Live Demo Link
https://task-track-zeta-jet.vercel.app

## Folder Structure

```text
TaskTracker/
  client/
    src/
      components/
        DeleteModal.jsx
        EmptyState.jsx
        FilterBar.jsx
        Loader.jsx
        Navbar.jsx
        SearchBar.jsx
        TaskCard.jsx
        TaskForm.jsx
        TaskList.jsx
        TaskStats.jsx
      pages/
        Dashboard.jsx
      services/
        api.js
      App.jsx
      index.css
      main.jsx
    .env.example
    index.html
    package.json
    vite.config.js
  server/
    config/
      db.js
    controllers/
      taskController.js
    models/
      Task.js
    routes/
      taskRoutes.js
    .env.example
    package.json
    server.js
  README.md
```

## Installation

```bash
cd server
npm install

cd ../client
npm install
```

## Environment Variables

Create `server/.env`:

```env
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@<cluster-url>/task-tracker?retryWrites=true&w=majority
CLIENT_URL=http://localhost:5173
```

Create `client/.env`:

```env
VITE_API_URL=http://localhost:5000
```

## Run Locally

Start the backend:

```bash
cd server
npm start
```

Start the frontend:

```bash
cd client
npm run dev
```

Open `http://localhost:5173`.

## API Endpoints

| Method | Endpoint | Description |
| --- | --- | --- |
| GET | `/tasks` | Get all tasks |
| GET | `/tasks/:id` | Get one task |
| POST | `/tasks` | Create a task |
| PUT | `/tasks/:id` | Update a task |
| DELETE | `/tasks/:id` | Delete a task |

## Deployment

### Render Backend

1. Push the repository to GitHub.
2. Create a new Render Web Service.
3. Set root directory to `server`.
4. Build command: `npm install`.
5. Start command: `npm start`.
6. Add environment variables: `PORT`, `MONGO_URI`, and `CLIENT_URL`.
7. Deploy and copy the Render service URL.

### Vercel Frontend

1. Import the GitHub repository into Vercel.
2. Set root directory to `client`.
3. Build command: `npm run build`.
4. Output directory: `dist`.
5. Add `VITE_API_URL` using the Render backend URL.
6. Deploy.
