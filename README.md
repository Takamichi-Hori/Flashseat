# FlashSeat

FlashSeat is a full-stack event reservation application built with React, Express, PostgreSQL, Firebase Authentication, and AWS.

Users can browse events, sign in with Google, and reserve tickets. Administrators can create events and upload event images directly to Amazon S3 using presigned URLs.

## Live Demo

https://main.dyctndn8ezezx.amplifyapp.com/events

## Features

- Event listing and event detail pages
- Google Sign-In with Firebase Authentication
- Authenticated ticket reservations
- Ticket inventory management
- PostgreSQL transactions to help prevent overselling
- Admin-only event creation
- Event image uploads to Amazon S3
- S3 presigned URLs for direct browser uploads
- Request validation with Zod
- Dockerized backend
- AWS production deployment
- GitHub Actions CI

## Architecture

```mermaid
flowchart LR
    User[Browser]
    Amplify[AWS Amplify<br/>React + Vite]
    API[Amazon EC2<br/>Docker + Express]
    DB[Amazon RDS<br/>PostgreSQL]
    S3[Amazon S3<br/>Event Images]
    Firebase[Firebase<br/>Authentication]

    User --> Amplify
    Amplify --> API
    Amplify --> Firebase
    API --> Firebase
    API --> DB
    API --> S3
    Amplify --> S3
```

### Production Stack

| Layer | Technology |
| --- | --- |
| Frontend | React, TypeScript, Vite |
| Routing | React Router |
| Frontend Hosting | AWS Amplify |
| Backend | Node.js, Express, TypeScript |
| Backend Hosting | Amazon EC2 + Docker |
| Reverse Proxy / HTTPS | Caddy |
| Database | Amazon RDS for PostgreSQL |
| Authentication | Firebase Authentication |
| Backend Authentication | Firebase Admin SDK |
| File Storage | Amazon S3 |
| Validation | Zod |
| Testing | Vitest, Supertest |
| CI | GitHub Actions |

## Reservation Flow

When a user reserves tickets:

1. The user opens an event.
2. The user selects a ticket quantity.
3. If the user is not signed in, Google Sign-In is opened through Firebase.
4. The frontend obtains a Firebase ID token.
5. The ID token is sent to the Express API as a Bearer token.
6. The API verifies the token using Firebase Admin.
7. PostgreSQL starts a database transaction.
8. The event row is locked using `SELECT ... FOR UPDATE`.
9. FlashSeat checks whether enough tickets remain.
10. The reservation is inserted.
11. `reserved_count` is updated.
12. The transaction is committed.

Using row locking helps keep ticket inventory consistent when multiple reservation requests arrive at the same time.

## Image Upload Flow

Event images are stored in a private Amazon S3 bucket.

The frontend does not receive AWS credentials.

```text
Browser
   |
   | POST /api/uploads/presign
   v
Express API
   |
   | Generate presigned PUT URL
   v
Browser
   |
   | PUT image
   v
Amazon S3
```

The backend generates a short-lived presigned URL, and the browser uploads the image directly to S3.

## Project Structure

```text
Flashseat/
├── apps/
│   ├── api/
│   │   ├── src/
│   │   │   ├── middleware/
│   │   │   ├── routes/
│   │   │   ├── services/
│   │   │   ├── app.ts
│   │   │   ├── config.ts
│   │   │   ├── db.ts
│   │   │   ├── firebase.ts
│   │   │   ├── s3.ts
│   │   │   └── server.ts
│   │   └── tests/
│   └── web/
│       └── src/
│           ├── pages/
│           ├── api.ts
│           ├── firebase.ts
│           ├── App.tsx
│           └── main.tsx
├── db/
│   ├── migrations/
│   │   └── 001_init.sql
│   └── seed.sql
├── .github/
│   └── workflows/
│       └── ci.yml
├── docker-compose.yml
├── package.json
└── package-lock.json
```

## API Endpoints

| Method | Endpoint | Authentication | Description |
| --- | --- | --- | --- |
| `GET` | `/health` | No | API health check |
| `GET` | `/api/events` | No | List all events |
| `GET` | `/api/events/:id` | No | Get an event |
| `POST` | `/api/events` | Admin | Create an event |
| `POST` | `/api/reservations/events/:eventId` | User | Reserve tickets |
| `POST` | `/api/uploads/presign` | Admin | Generate an S3 upload URL |

## Database

FlashSeat uses PostgreSQL with three main tables.

### `users`

Stores users authenticated through Firebase.

```text
users
├── id
├── firebase_uid
├── email
├── display_name
└── created_at
```

### `events`

Stores event information and current inventory.

```text
events
├── id
├── title
├── venue
├── starts_at
├── price_yen
├── capacity
├── reserved_count
├── image_key
└── created_at
```

### `reservations`

Stores reservations made by users.

```text
reservations
├── id
├── user_id
├── event_id
├── quantity
└── created_at
```

Database constraints prevent invalid values such as negative prices, invalid reservation quantities, and reserved ticket counts greater than event capacity.

## Local Development

### Requirements

- Node.js 22+
- npm
- Docker
- Docker Compose
- Firebase project

Clone the repository:

```bash
git clone https://github.com/Takamichi-Hori/Flashseat.git
cd Flashseat
```

Install dependencies:

```bash
npm install
```

Start PostgreSQL:

```bash
docker compose up -d postgres
```

## Backend Environment Variables

Create:

```text
apps/api/.env
```

Example:

```env
NODE_ENV=development
PORT=8080

DATABASE_URL=postgresql://flashseat:flashseat@localhost:5432/flashseat

CORS_ORIGINS=http://localhost:5173

FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=your-service-account-email
FIREBASE_PRIVATE_KEY=your-private-key

ADMIN_EMAILS=admin@example.com

S3_ENABLED=false
AWS_REGION=ap-northeast-3
AWS_S3_BUCKET=
```

Do not commit real credentials to Git.

Start the API:

```bash
npm run dev --workspace apps/api
```

The API runs at:

```text
http://localhost:8080
```

## Frontend Environment Variables

Create:

```text
apps/web/.env.local
```

Example:

```env
VITE_API_URL=http://localhost:8080

VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_APP_ID=your-app-id
```

Start the frontend:

```bash
npm run dev --workspace apps/web
```

Open:

```text
http://localhost:5173
```

## Testing

Run tests:

```bash
npm test
```

Run TypeScript / lint checks:

```bash
npm run lint
```

Build all workspaces:

```bash
npm run build
```

## CI

GitHub Actions runs the following checks on pushes to `main` and on pull requests:

```text
npm install
npm run lint
npm test
npm run build
```

## Security

- Firebase ID tokens are verified on the backend.
- Admin endpoints require authentication and an allow-listed admin email.
- AWS credentials are not exposed to the browser.
- S3 uploads use temporary presigned URLs.
- The S3 bucket can remain private.
- PostgreSQL reservations use transactions and row locking.
- API input is validated using Zod.
- HTTP security headers are enabled using Helmet.
- Production secrets are supplied using environment variables.

## Deployment

### Frontend

The React/Vite frontend is deployed through AWS Amplify.

### Backend

The Express API runs inside Docker on Amazon EC2.

```text
Internet
   ↓
HTTPS
   ↓
Caddy
   ↓
Docker
   ↓
Express API
```

The backend connects to Amazon RDS for PostgreSQL and Amazon S3.

## Future Improvements

- User reservation history
- Reservation cancellation
- Event editing and deletion
- Payment processing
- Email confirmations
- Improved admin dashboard
- Automated backend deployment
- Infrastructure as Code
- Additional integration and concurrency tests

## Author

**Takamichi Hori**

GitHub: https://github.com/Takamichi-Hori
