# Studio Josy Silva

A full-stack Lash Salon scheduling and CRM application built with Next.js, Prisma, and Tailwind CSS.

## Features

- **Public Booking Flow:**
  - Services Listing
  - Date and Time Availability calculation
  - Client details form
  - Payment simulation/selection

- **Admin CRM:**
  - Dashboard with estimated revenue and daily specs
  - Client Management (Search, Pagination, History)
  - Appointments Management (Interactive calendar, Actions to confirm/cancel)

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Database:** PostgreSQL with Prisma ORM
- **Styling:** Tailwind CSS (Native setup without CDN)
- **Testing:** Vitest
- **API Documentation:** Swagger UI (next-swagger-doc)

## Getting Started

### Prerequisites

- Node.js (v18+)
- PostgreSQL (running locally or via Docker)

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm installat
   ```
3. Copy environment file:
   ```bash
   cp .env.example .env
   ```
4. Set your `DATABASE_URL` in `.env`
5. Run migrations & seed data:
   ```bash
   npx prisma migrate dev
   npx prisma db seed
   ```

### Running the App

```bash
npm run dev
```

Open `http://localhost:3005` to see the public site.
Open `http://localhost:3005/login` to access the CRM.

### Documentation

- The API is automatically documented with Swagger.
- Visit `http://localhost:3005/docs` to interact with the Swagger UI after starting the dev server.

### Testing

Run logic unit tests with Vitest:

```bash
npm run test
```
