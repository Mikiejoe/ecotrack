# EcoTrack — IoT Fleet & Logistics API

EcoTrack is an **enterprise-grade Node.js API** built with **TypeScript**, designed to ingest and process high-velocity telemetry data from logistics and fleet vehicles.  
It follows an **event-driven, modular architecture** optimized for scalability, resilience, and clean separation of concerns.

This system is built for **IoT-heavy workloads**, where real-time ingestion must stay fast while non-critical operations run asynchronously.

---

## Architecture Overview

EcoTrack uses a **layered architecture** that keeps the HTTP request–response cycle lightweight and predictable.  
Expensive operations such as notifications, analytics, and reporting are handled via **events and background jobs**.

### Core Principles
- Thin controllers with no business logic
- Framework-agnostic service layer
- Event-driven decoupling
- Strict validation at system boundaries

---

## Folder Structure

This project follows a **layered, modular architecture**. The goal is to keep the "Request-Response" cycle as fast as possible by offloading heavy tasks to events and background workers.



### Folder Breakdown:
- **`/src/api/v1`**: Versioned API entry points.
    - `/controllers`: Lean handlers that delegate logic to services.
    - `/middlewares`: Security (JWT), Rate Limiting, and Error handling.
    - `/validators`: Strict request body validation (Zod/Joi).
- **`/src/services`**: Core Business Logic. This layer is framework-agnostic.
- **`/src/events`**: The "Observer" layer. Handles decoupling (e.g., *“A vehicle overheated, now notify three different systems”*).
- **`/src/jobs`**: Background processing and Cron tasks (e.g., Daily performance reports).
- **`/src/database`**: Data Access Layer.
    - `/models`: Mongoose schemas and TypeScript interfaces.
    - `base.repository.ts`: A generic CRUD template for all database operations.
- **`/src/core`**: Application-wide singletons like the Winston Logger and Server configuration.

---

## Getting Started

### Prerequisites
- **Node.js** v20+
- **MongoDB** v6.0+
- **TypeScript** v5+

---

### Installation
Clone the repository

```
git clone https://github.com/Mikiejoe/ecotrack.git
```
Cd into the project
```
cd ecotrack
```
Install dependencies
```
npm install
```


### Environment Configuration

Create a `.env` file:

```env
PORT=8080
MONGO_URI=mongodb://localhost:27017/ecotrack
JWT_SECRET=your_super_secret_key
LOG_LEVEL=info
```

---

### Run the Application

```bash
npm run dev
```

API available at:

```
http://localhost:8080/api/v1
```

---

## Core Workflows

### Telemetry Ingestion Flow

1. Vehicle sends telemetry data
2. JWT + schema validation
3. Service evaluates thresholds
4. Event emitted on critical state
5. Background jobs handle notifications

---

## Available Scripts

| Command | Description |
|------|-------------|
| `npm run dev` | Development mode |
| `npm run build` | Build TypeScript |
| `npm run start` | Run production build |
| `npm run db:seed` | Seed database |

---

## Security & Reliability

- TypeScript strict mode
- Full request validation
- JWT authentication
- Winston logging
- Event-driven fault isolation

---

## License

MIT License
