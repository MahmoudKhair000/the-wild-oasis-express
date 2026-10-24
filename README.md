# The Wild Oasis Backend

The Wild Oasis Backend is a TypeScript REST API for the Wild Oasis cabin-management application. It uses Express 5 and MongoDB via Mongoose, and provides account authentication, user administration, cabin and guest management, and application settings.

## Contents

- [Requirements](#requirements)
- [Getting started](#getting-started)
- [Environment variables](#environment-variables)
- [Running the server](#running-the-server)
- [API conventions](#api-conventions)
- [API reference](#api-reference)
- [Data models](#data-models)
- [Project structure](#project-structure)
- [Deployment](#deployment)
- [Current limitations](#current-limitations)

## Requirements

- Node.js with support for the package versions in `package.json`
- pnpm (the package declares pnpm as its package manager)
- A MongoDB database and connection URI
- SMTP credentials and host settings for email verification

## Getting started

Install dependencies:

```sh
pnpm install
```

Create a `.env` file in the project root and configure the [environment variables](#environment-variables). At minimum, `MONGODB_URI` is required to start the application and `JWT_SECRET` is needed for authentication and account flows.

Start the development server:

```sh
pnpm dev
```

The server listens on port `4000` by default. Set `PORT` to use another port. The API connects to MongoDB before handling each request; if the database cannot be reached, it returns `503` with a `Database unavailable` message.

## Environment variables

| Variable | Required | Description |
| --- | --- | --- |
| `MONGODB_URI` | Yes | MongoDB connection URI. The application fails to initialize if it is missing. |
| `JWT_SECRET` | For auth flows | Secret used to sign and verify authentication, email confirmation, and password-update tokens. |
| `SMTP_HOST` | For email delivery | SMTP server hostname. |
| `SMTP_PORT` | No | SMTP port; defaults to `587`. |
| `SMTP_SECURE` | No | Set to `true` or `false` to explicitly select TLS mode. If omitted, secure mode defaults to `true` on port `465` and `false` otherwise. |
| `SMTP_USER` | Depends on SMTP server | SMTP username and the sender address used by signup confirmation email. |
| `SMTP_PASS` | Depends on SMTP server | SMTP password. Whitespace is removed before it is passed to Nodemailer. |
| `APP_HOST` | No | Public backend origin used to build email confirmation links. If omitted, the request origin is used. |
| `PORT` | No | Local HTTP port; defaults to `4000`. |

Do not commit `.env` files or real credentials to source control.

## Running the server

The `dev` script starts `src/server.ts` through `tsx` and restarts it with Nodemon:

```sh
pnpm dev
```

The project currently has no build script or automated test suite configured. Its `test` script intentionally exits with “Error: no test specified”.

## API conventions

- The API is mounted at the following top-level paths: `/users`, `/guests`, `/cabins`, `/settings`, and `/bookings`.
- JSON request bodies are enabled. Most endpoints return JSON with `ok` and `message` fields, often with a `data` field. Response shapes are not fully uniform; see endpoint notes below.
- Authenticated routes expect a JWT in the request header:

  ```http
  Authorization: Bearer <token>
  ```

- A successful login returns a token that expires after three hours.
- New accounts must verify their email before logging in. The confirmation token expires after 45 minutes.
- Authenticated user identity is determined from the JWT `userId` claim. Ownership and administrator checks are applied per route as noted below.
- CORS is configured with wildcard origin access. Credentialed CORS is not enabled.

## API reference

Unless indicated otherwise, request and response bodies are JSON. Replace `:userId`, `:guestId`, and `:cabinId` with MongoDB document IDs.

### Users — `/users`

| Method and path | Access | Description |
| --- | --- | --- |
| `GET /users/getusers` | Public | Return all user documents. |
| `GET /users/getuser/:userId` | Authenticated | Return the user with the given ID. |
| `PUT /users/signup` | Public | Create an unverified user and send a confirmation email. |
| `POST /users/login` | Public | Verify credentials and return a three-hour JWT. |
| `GET /users/confirm-email/:token` | Public confirmation token | Verify the account and render an HTML confirmation page. |
| `PATCH /users/edit/:userId` | Owner | Update user details other than email, password, role, verification state, or document metadata. |
| `DELETE /users/delete/:userId` | Owner | Delete the account. |
| `POST /users/update-password/:userId` | Owner | Create a one-hour password-update token and return it in the response. |
| `PATCH /users/update-password/:token` | Password-update token | Set a new password using the token in the URL and `password` in the JSON body. |
| `PUT /users/admin/:userId` | Administrator | Promote the specified user to administrator. |
| `DELETE /users/admin/:userId` | Administrator or target account | Demote the specified account. The handler prevents a user from demoting themself. |

Signup body:

```json
{
  "firstName": "Taylor",
  "lastName": "Morgan",
  "email": "taylor@example.com",
  "password": "choose-a-password"
}
```

Login body:

```json
{
  "email": "taylor@example.com",
  "password": "choose-a-password"
}
```

The login response includes `token` and a user summary. Passwords are hashed before being saved. `PATCH /users/edit/:userId` rejects attempts to update protected account fields; use the dedicated password and admin routes for those operations.

### Guests — `/guests`

| Method and path | Access | Description |
| --- | --- | --- |
| `GET /guests` | Public | Return all guests. Returns `404` when the collection is empty. |
| `GET /guests/:guestId` | Authenticated | Return one guest by ID. |
| `POST /guests` | Authenticated | Create a guest from the request body. |
| `PATCH /guests/:guestId` | Administrator | Update a guest from the request body. |
| `DELETE /guests/:guestId` | Administrator | Delete a guest. |
| `PUT /guests` | Authenticated | Insert the bundled sample guests. |
| `DELETE /guests` | Authenticated | Delete **all** guest documents. |

Guest documents use `fullName` and `email`; optional fields include `nationalID`, `nationality`, and `countryFlag`. The API also maintains creation and update timestamps.

### Cabins — `/cabins`

| Method and path | Access | Description |
| --- | --- | --- |
| `GET /cabins` | Public | Return all cabins. |
| `GET /cabins/:cabinId` | Authenticated | Return one cabin by ID. |
| `POST /cabins` | Authenticated | Create a cabin from the request body. |
| `PATCH /cabins/:cabinId` | Administrator | Update a cabin and refresh its `updated_at` timestamp. |
| `DELETE /cabins/:cabinId` | Administrator | Delete a cabin. |
| `PUT /cabins` | Authenticated | Insert the bundled sample cabins. |
| `DELETE /cabins` | Authenticated | Delete **all** cabin documents. |

Cabin request bodies use these fields:

```json
{
  "name": "001",
  "maxCapacity": 2,
  "regularPrice": 250,
  "discount": 0,
  "description": "A comfortable cabin for two.",
  "image": "https://example.com/cabin.jpg"
}
```

`name`, `maxCapacity`, `regularPrice`, `discount`, `description`, and `image` are required by the cabin model. Creation and update timestamps are maintained by the model/controller.

### Settings — `/settings`

| Method and path | Access | Description |
| --- | --- | --- |
| `GET /settings` | Authenticated | Return the settings document. |
| `POST /settings` | Administrator | Create or update settings from the request body. |
| `PUT /settings/reset` | Administrator | Replace settings with defaults and return both the previous and new values. |

Settings fields are:

| Field | Default |
| --- | ---: |
| `minimumNights` | `2` |
| `maximumNights` | `30` |
| `maximumGuests` | `12` |
| `breakfastPrice` | `15` |

The application stores settings under the fixed document ID `settings`.

### Bookings — `/bookings`

| Method and path | Access | Description |
| --- | --- | --- |
| `GET /bookings` | Public | Return the plain-text response `Getting from '/bookings/'.` |

Booking management is not implemented yet.

## Data models

MongoDB collections are created/managed by Mongoose from these schemas:

- **User:** `firstName`, `lastName`, `email`, `password`, `_verified`, and `_role`. Email is validated and unique; `_role` is `admin` or `user`, defaulting to `user`. New accounts begin unverified with the `user` role.
- **Guest:** `fullName`, unique validated `email`, optional `nationalID`, `nationality`, and `countryFlag`, plus timestamps.
- **Cabin:** `name`, `maxCapacity`, `regularPrice`, `discount`, `description`, and `image`, plus timestamps.
- **Settings:** fixed `_id` (`settings`), `minimumNights`, `maximumNights`, `maximumGuests`, and `breakfastPrice`.

## Project structure

```text
api/
  index.ts                 Vercel serverless entry point
src/
  app.ts                   Express app, middleware, database connection, route mounting
  server.ts                Local HTTP server
  controllers/             Route handlers
  middlewares/             JWT authentication, ownership, and role checks
  models/                  Mongoose schemas and models
  routes/                  Express route definitions
  services/nodeMailer.ts   SMTP transporter
  util/mail.html           Email markup asset
  views/                   EJS confirmation view and email templates
vercel.json                Vercel routing/build configuration
```

## Deployment

`api/index.ts` exports the Express app for Vercel, and `vercel.json` routes incoming requests to that entry point. Configure the required environment variables in the deployment environment, especially `MONGODB_URI` and `JWT_SECRET`; configure SMTP variables for email confirmation delivery.

## Current limitations

- Booking routes are only a placeholder; there are no booking models or booking operations.
- The password-update request endpoint currently returns the update token directly. Email delivery for that flow is commented out.
- The sample-data deletion endpoints remove every document in their respective collection, not just sample records. They are available to any authenticated account, so use them carefully.
- The project does not currently define build, lint, or working test scripts.
