I read your `api.md`. The current logic still mixes **cookie JWT and bearer token for the same auth guard**, which is not what you want. You want a **clear separation of authentication mechanisms**:

* **Auth routes (`/auth/*`) → Cookie-based session**
* **Other APIs (`email`, `payment`, `voucher`, etc.) → Bearer token only**

Below is the **corrected architecture logic** and how the flow should be documented.

---

# API Authentication Architecture (Fixed)

## Authentication Strategy

The system uses **two authentication mechanisms depending on the route type**:

| Area                                      | Authentication                  |
| ----------------------------------------- | ------------------------------- |
| `auth/*` (dashboard session)              | **Cookie-based authentication** |
| `email/*`, `payment/*`, `voucher/*`, etc. | **Bearer Token (API Token)**    |

This separation ensures:

* **Dashboard session security** via cookies
* **External API access** via API tokens

---

# Authentication Flow

## 1. Dashboard Authentication (Cookies)

Used for **web dashboard interaction**.

Flow:

```
Client (Dashboard)
      │
      ▼
POST /api/auth/login
      │
      ▼
AuthService.validateUser()
      │
      ▼
Set HTTP-only Cookie
      │
      ▼
Subsequent requests automatically include cookie
```

Important rules:

* Uses **HTTP-only cookies**
* No bearer token involved
* Used only by **dashboard routes**

Example usage:

```
POST /api/auth/login
→ sets cookie: session_token
```

Then:

```
GET /api/auth/me
Cookie: session_token=...
```

---

# 2. API Authentication (Bearer Token)

Used for **external services and integrations**.

Flow:

```
Client / External System
      │
      ▼
Authorization: Bearer <token>
      │
      ▼
API Middleware
      │
      ▼
tokenService.validateToken()
      │
      ▼
tokenRepository.findByTokenHash()
      │
      ▼
Database
```

Tokens are:

* Generated from `/api/auth/token`
* Stored **hashed in DB**
* Returned **only once**

As described in your file:

* tokens stored **SHA-256 hashed**
* validated using `findByTokenHash` 

Example request:

```
POST /api/payment/create-transaction
Authorization: Bearer abc123...
```

---

# Route Protection (Corrected)

## Public Routes

```
POST /api/auth/login
POST /api/auth/logout
POST /api/auth/forgot-password
POST /api/auth/reset-password
GET  /api/health
GET  /api/voucher
GET  /api/voucher/[id]
POST /api/email/forget-password
```

---

# Cookie Auth Routes (Dashboard)

These routes require **session cookie authentication**.

```
GET  /api/auth/me
GET  /api/auth/token
POST /api/auth/token
DELETE /api/auth/token
DELETE /api/auth/token/[id]

GET  /api/auth/users
POST /api/auth/users
GET  /api/auth/users/[id]
PATCH /api/auth/users/[id]
DELETE /api/auth/users/[id]
```

Middleware:

```
requireSession()
```

NOT:

```
requireAuth()
```

---

# Bearer Token Routes (External API)

These routes require **Bearer token authentication only**.

```
GET  /api/email
POST /api/email/send-confirmation
POST /api/email/payment-link

POST /api/payment/create-transaction
```

Middleware:

```
requireApiToken()
```

NOT cookie authentication.

---

# Correct Auth Guards

Your current file shows a **single guard handling both cookie and bearer**:

```
requireAuth(request) — Bearer OR cookie JWT
```



This should be **split into two guards**.

---

## 1. Cookie Guard

```
requireSession(request)
```

Example:

```ts
export async function requireSession(request: Request) {
  const cookie = request.cookies.get("session_token");

  if (!cookie) {
    throw new Error("Unauthorized");
  }

  return verifySession(cookie.value);
}
```

Used by:

```
/api/auth/*
```

---

## 2. Bearer Guard

```
requireApiToken(request)
```

Example:

```ts
export async function requireApiToken(request: Request) {
  const auth = request.headers.get("authorization");

  if (!auth?.startsWith("Bearer ")) {
    throw new Error("Unauthorized");
  }

  const token = auth.split(" ")[1];

  return tokenService.validateToken(token);
}
```

Used by:

```
/api/email/*
/api/payment/*
/api/voucher/*
```

---

# Updated Protection Map

| Endpoint        | Auth Type      |
| --------------- | -------------- |
| `/auth/login`   | Public         |
| `/auth/logout`  | Public         |
| `/auth/me`      | Cookie         |
| `/auth/token`   | Cookie         |
| `/auth/users`   | Cookie + Role  |
| `/email/*`      | Bearer Token   |
| `/payment/*`    | Bearer Token   |
| `/voucher GET`  | Public         |
| `/voucher POST` | Bearer + Admin |

---

# Final Architecture

```
Client Dashboard
     │
     ▼
Cookie Session
     │
     ▼
/auth/* routes
```

```
External API
     │
Authorization: Bearer TOKEN
     │
     ▼
/email
/payment
/voucher
```
