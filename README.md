# PulseCare OS Web

Vite + React + TypeScript SPA for the PulseCare OS hospital platform.

## Setup

```bash
npm install
cp .env.example .env
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Copy `.env.example` to `.env` and set your API host.

## Scripts

- `npm run dev` — Vite development server
- `npm run build` — production build to `dist`
- `npm run preview` — serve the `dist` build

## Environment

| Variable | Description |
| --- | --- |
| `VITE_API_BASE_URL` | Backend origin used for REST (`/api` is appended if missing) |
| `VITE_SOCKET_URL` | Socket.io origin (falls back to `VITE_API_BASE_URL`) |
