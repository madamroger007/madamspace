If your architecture is **`db -> repositories -> service -> api`**, the `schema.md` should explain **how data flows through each layer**, what responsibility each layer has, and how they interact. This document helps new developers quickly understand the structure of the system.

Below is a **clean example of `schema.md`** you can use.

---

# System Architecture Schema

This document describes the architecture and data flow of the application.
The system follows a **layered architecture**:

```
Database → Repository → Service → API
```

Each layer has a specific responsibility to ensure separation of concerns, maintainability, and scalability.

---

# Architecture Overview

```
Client Request
      │
      ▼
     API
      │
      ▼
    Service
      │
      ▼
  Repository
      │
      ▼
    Database
```

**Flow Explanation**

1. Client sends a request to the API.
2. API validates the request and calls the appropriate Service.
3. Service contains business logic and orchestrates operations.
4. Service calls Repository to interact with the database.
5. Repository performs queries using the database schema.
6. Result flows back up to the API and is returned to the client.

---

# Layer Responsibilities

## 1. Database Layer (`db`)

Responsible for defining the **data schema and database connection**.

Example responsibilities:

* Database connection
* Table schemas
* ORM configuration
* Migrations
* Seed data

Example structure:

```
server/db/
 ├── index.ts
 ├── schema/
 │    ├── user.ts
 │    ├── product.ts
 │    └── order.ts
```

Example schema:

```ts
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: text("email").notNull(),
  password: text("password").notNull(),
});
```

---

## 2. Repository Layer (`repositories`)

Responsible for **data access logic**.

Repositories communicate directly with the database layer and isolate query logic from the rest of the application.

Responsibilities:

* Database queries
* CRUD operations
* Data persistence

Example structure:

```
server/repositories/
 ├── user.repository.ts
 ├── product.repository.ts
 └── order.repository.ts
```

Example repository:

```ts
export class UserRepository {
  async findByEmail(email: string) {
    return db.select().from(users).where(eq(users.email, email));
  }

  async create(data: CreateUserDto) {
    return db.insert(users).values(data);
  }
}
```

---

## 3. Service Layer (`service`)

Responsible for **business logic and application rules**.

Services use repositories to perform operations and combine multiple data sources when necessary.

Responsibilities:

* Business logic
* Validation rules
* Data transformation
* Orchestration of repositories

Example structure:

```
server/services/
 ├── user.service.ts
 ├── auth.service.ts
 └── order.service.ts
```

Example service:

```ts
export class AuthService {
  constructor(private userRepository: UserRepository) {}

  async login(email: string, password: string) {
    const user = await this.userRepository.findByEmail(email);

    if (!user) {
      throw new Error("User not found");
    }

    return user;
  }
}
```

---

## 4. API Layer (`api`)

Responsible for **handling HTTP requests and responses**.

The API layer acts as the entry point of the application.

Responsibilities:

* Request validation
* Calling services
* Formatting responses
* Error handling

Example structure:

```
server/api/
 ├── auth/
 │    ├── login.ts
 │    └── forgot-password.ts
 └── user/
      └── route.ts
```

Example API route:

```ts
export async function POST(req: Request) {
  const body = await req.json();

  const user = await authService.login(body.email, body.password);

  return Response.json(user);
}
```

---

# Example Request Flow

Example: **User Login**

```
Client
  │
  ▼
POST /api/auth/login
  │
  ▼
Auth API
  │
  ▼
AuthService.login()
  │
  ▼
UserRepository.findByEmail()
  │
  ▼
Database Query
  │
  ▼
Return User Data
```

---

# Benefits of This Architecture

* **Separation of Concerns** — Each layer has a clear responsibility.
* **Maintainability** — Easier to update logic without affecting other layers.
* **Testability** — Services and repositories can be tested independently.
* **Scalability** — Easy to extend with new features.

