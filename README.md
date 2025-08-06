# AICI Project

This project is a full-stack monorepo with three main components:

- `frontend/` – React web client
- `user-service/` – Node.js/Express user authentication service (with PostgreSQL & Prisma)
- `todo-service/` – Node.js/Express todo management service (with PostgreSQL & Prisma)

## Prerequisites

- [Docker](https://www.docker.com/) and [Docker Compose](https://docs.docker.com/compose/)
- (Optional for local dev) [Node.js](https://nodejs.org/) v20+ and [npm](https://www.npmjs.com/)

---

## Quick Start (Recommended: Docker Compose)

This will start all services (frontend, user-service, todo-service, and their databases):

```sh
docker-compose up --build
```

- Frontend: [http://localhost:3000](http://localhost:3000)
- User Service API: [http://localhost:3001](http://localhost:3001/api/users)
- Todo Service API: [http://localhost:3002](http://localhost:3002/api/todos)

---

## Development: Run Services Individually

### 1. Start Databases

You can use Docker Compose to start only the databases:

```sh
docker-compose up postgres-auth postgres-todo
```

Or run your own PostgreSQL instances and update the `DATABASE_URL` in each `.env`.

### 2. User Service

```sh
cd user-service
npm install
npx prisma generate
npx prisma migrate deploy
npm run dev
```

### 3. Todo Service

```sh
cd todo-service
npm install
npx prisma generate
npx prisma migrate deploy
npm run dev
```

### 4. Frontend

```sh
cd frontend
npm install
npm start
```

---

## Build for Production

### Docker (Recommended)

```sh
docker-compose up --build
```

### Manual Build

#### User Service

```sh
cd user-service
npm run build
```

#### Todo Service

```sh
cd todo-service
npm run build
```

#### Frontend

```sh
cd frontend
npm run build
```

---

## Running Tests

Each service has its own tests:

```sh
cd user-service
npm test

cd todo-service
npm test
```

---
