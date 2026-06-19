# Frontend and Backend Split

The workspace is now separated into two independent apps:

## Frontend

- Path: `frontend/`
- Stack: React + Vite
- Run:
  - `cd frontend`
  - `npm install`
  - `npm run dev`

## Backend

- Path: `backend/`
- Stack: Node + Express + MongoDB
- Run:
  - `cd backend`
  - `npm install`
  - `npm run dev`

## Run both from root

- `npm run install:all`
- `npm run dev:full`

## Auth endpoint

- `POST /api/auth/register-user`
