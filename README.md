# AI Service Marketplace

Full stack project separated into independent frontend and backend apps.

## Structure

```text
AI Services MarketPlace/
├── client/
│   └── React + Vite + Tailwind CSS frontend
├── server/
│   └── Node.js + Express + MongoDB backend
└── README.md
```

## Frontend

```bash
cd client
npm install
npm run dev
```

Frontend runs at:

```text
http://127.0.0.1:5173
```

The client API base URL is configured in `client/.env`:

```text
VITE_API_URL=http://localhost:5000/api
```

## Backend

```bash
cd server
npm install
npm run dev
```

Production-style start:

```bash
npm start
```

Backend runs at:

```text
http://localhost:5000
```

Test route:

```text
http://localhost:5000/api/test
```

MongoDB must be running locally, or `server/.env` must use a MongoDB Atlas connection string.
