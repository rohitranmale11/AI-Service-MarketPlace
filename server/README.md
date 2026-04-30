# AI Service Marketplace Backend

## Local Setup

1. Install dependencies:

```bash
npm install
```

2. Configure environment variables in `.env`:

```bash
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/ai-service-marketplace
JWT_SECRET=replace_with_a_long_random_secret
```

3. Start MongoDB locally or use a MongoDB Atlas connection string.

4. Run the backend:

```bash
npm run backend:dev
```

For production-style start:

```bash
npm run backend
```

## Test Route

```http
GET http://localhost:5000/api/test
```

## API Routes

Auth:

```http
POST /api/auth/register
POST /api/auth/login
GET /api/auth/me
```

Requests:

```http
POST /api/requests
GET /api/requests
GET /api/requests/:id
DELETE /api/requests/:id
```

Applications:

```http
POST /api/apply/:requestId
GET /api/applications
```

Protected routes require:

```http
Authorization: Bearer <jwt_token>
```
