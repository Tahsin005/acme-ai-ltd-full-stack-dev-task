# Acme Task Portal

A full-stack task management portal built with React and Express.

## Tech Stack

| Layer    | Technology                                                  |
| -------- | ----------------------------------------------------------- |
| Frontend | React 19, TypeScript, Vite, TailwindCSS 4, Shadcn UI, Zustand, React Query |
| Backend  | Express 5, TypeScript, Drizzle ORM, Zod                     |
| Database | PostgreSQL 16                                               |
| DevOps   | Docker, Docker Compose                                      |

## Prerequisites

- **Node.js** (v20+)
- **Docker** & **Docker Compose**

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/Tahsin005/acme-ai-ltd-full-stack-dev-task.git
cd acme-ai-ltd-full-stack-dev-task
```

### 2. Set up environment variables

```bash
cp .env.example .env
```

Default values in `.env.example`:

```env
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=taskportal
POSTGRES_PORT=5432
PORT=3000
FRONTEND_PORT=5173
VITE_API_URL=http://localhost:3000/api
```

### 3. Run the app

#### Option A — One-command local dev (recommended)

```bash
chmod +x start.sh
./start.sh
```

This will:
1. Create any missing `.env` files from their `.env.example` counterparts
2. Install backend and frontend dependencies
3. Start the PostgreSQL container
4. Run Drizzle database migrations
5. Launch both the backend and frontend dev servers

#### Option B — Full Docker setup

```bash
docker compose up --build
```

This starts all three services (database, backend, frontend) in containers.

### 4. Access the app

| Service  | URL                          |
| -------- | ---------------------------- |
| Frontend | http://localhost:5173        |
| Backend  | http://localhost:3000        |
| API      | http://localhost:3000/api    |

## Available Scripts

Run these from the project root:

| Script               | Description                            |
| -------------------- | -------------------------------------- |
| `npm start`          | Run the full dev setup via `start.sh`  |
| `npm run docker:up`  | Start all services with Docker Compose |
| `npm run docker:down`| Stop all Docker Compose services       |
| `npm run docker:db`  | Start only the PostgreSQL container    |
| `npm run db:migrate` | Run Drizzle database migrations        |
| `npm run backend`    | Start only the backend dev server      |
| `npm run frontend`   | Start only the frontend dev server     |

## Project Structure

```
├── backend/
│   ├── src/              # Express app source code
│   ├── drizzle/           # Database migrations
│   ├── drizzle.config.ts  # Drizzle ORM config
│   ├── Dockerfile
│   └── docker-entrypoint.sh
├── frontend/
│   ├── src/              # React app source code
│   ├── public/
│   ├── vite.config.ts
│   └── Dockerfile
├── docker-compose.yml
├── start.sh              # One-command dev startup script
└── .env.example
```
