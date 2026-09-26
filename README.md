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
- PostgreSQL transactions to prevent overselling
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

    Amplify[AWS Amplify
    React + Vite]

    API[Amazon EC2
    Docker + Express]

    DB[Amazon RDS
    PostgreSQL]

    S3[Amazon S3
    Event Images]

    Firebase[Firebase
    Authentication]

    User --> Amplify
    Amplify --> API
    Amplify --> Firebase
    API --> Firebase
    API --> DB
    API --> S3
    Amplify --> S3
Production stack
Layer	Technology
Frontend	React, TypeScript, Vite
Routing	React Router
Frontend Hosting	AWS Amplify
Backend	Node.js, Express, TypeScript
Backend Hosting	Amazon EC2 + Docker
Reverse Proxy / HTTPS	Caddy
Database	Amazon RDS PostgreSQL
Authentication	Firebase Authentication
Backend Authentication	Firebase Admin SDK
File Storage	Amazon S3
Validation	Zod
Testing	Vitest, Supertest
CI	GitHub Actions
Reservation Flow

When a user reserves tickets:

The user opens an event.
The user selects a ticket quantity.
If the user is not signed in, Google Sign-In is opened through Firebase.
The frontend obtains a Firebase ID token.
The ID token is sent to the Express API as a Bearer token.
The API verifies the token using Firebase Admin.
PostgreSQL starts a database transaction.
The event row is locked using SELECT ... FOR UPDATE.
FlashSeat checks whether enough tickets remain.
The reservation is inserted.
reserved_count is updated.
The transaction is committed.

Using row locking prevents multiple concurrent requests from overselling the same event.

Image Upload Flow

Event images are stored in a private Amazon S3 bucket.

The frontend does not receive AWS credentials.

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

The backend generates a short-lived presigned URL, and the browser uploads the image directly to S3.

Project Structure
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
│   │
│   └── web/
│       └── src/
│           ├── pages/
│           ├── api.ts
│           ├── firebase.ts
│           ├── App.tsx
│           └── main.tsx
│
├── db/
│   ├── migrations/
│   │   └── 001_init.sql
│   └── seed.sql
│
├── .github/
│   └── workflows/
│       └── ci.yml
│
├── docker-compose.yml
├── package.json
└── package-lock.json
API Endpoints
Method	Endpoint	Authentication	Description
GET	/health	No	API health check
GET	/api/events	No	List all events
GET	/api/events/:id	No	Get an event
POST	/api/events	Admin	Create an event
POST	/api/reservations/events/:eventId	User	Reserve tickets
POST	/api/uploads/presign	Admin	Generate an S3 upload URL
Database

FlashSeat uses PostgreSQL with three main tables.

users

Stores users authenticated through Firebase.

users
├── id
├── firebase_uid
├── email
├── display_name
└── created_at
events

Stores event information and current inventory.

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
reservations

Stores reservations made by users.

reservations
├── id
├── user_id
├── event_id
├── quantity
└── created_at

Database constraints prevent invalid values such as negative prices, invalid reservation quantities, and reserved ticket counts greater than event capacity.

Local Development
Requirements
Node.js 22+
npm
Docker
Docker Compose
Firebase project

Clone the repository:

git clone https://github.com/Takamichi-Hori/Flashseat.git
cd Flashseat

Install dependencies:

npm install

Start PostgreSQL:

docker compose up -d postgres
Backend Environment Variables

Create:

apps/api/.env

Example:

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

Do not commit real credentials to Git.

Start the API:

npm run dev --workspace apps/api

The API runs at:

http://localhost:8080
Frontend Environment Variables

Create:

apps/web/.env.local

Example:

VITE_API_URL=http://localhost:8080

VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_APP_ID=your-app-id

Start the frontend:

npm run dev --workspace apps/web

Open:

http://localhost:5173
Testing

Run tests:

npm test

Run TypeScript / lint checks:

npm run lint

Build all workspaces:

npm run build
CI

GitHub Actions runs the following checks on pushes to main and pull requests:

npm install
npm run lint
npm test
npm run build
Security

FlashSeat uses several security measures:

Firebase ID tokens are verified on the backend.
Admin endpoints require authentication and an allow-listed admin email.
AWS credentials are never exposed to the browser.
S3 uploads use temporary presigned URLs.
The S3 bucket can remain private.
PostgreSQL reservations use transactions and row locking.
API input is validated using Zod.
HTTP security headers are enabled using Helmet.
Production secrets are supplied using environment variables.
Deployment
Frontend

The React/Vite frontend is automatically deployed through AWS Amplify when changes are pushed to the main branch.

Backend

The Express API runs inside Docker on Amazon EC2.

Production traffic follows:

Internet
   ↓
HTTPS
   ↓
Caddy
   ↓
Docker
   ↓
Express API

The backend connects to Amazon RDS PostgreSQL and Amazon S3.

Future Improvements

Possible future improvements include:

User reservation history
Reservation cancellation
Event editing and deletion
Payment processing
Email confirmations
Improved admin dashboard
Automated backend deployment
Infrastructure as Code
More integration tests
More concurrency tests
Author

Takamichi Hori
