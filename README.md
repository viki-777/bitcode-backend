<div align="center">
  <img src="https://raw.githubusercontent.com/lucide-icons/lucide/main/icons/server.svg" alt="Bitcode Backend Logo" width="80" height="80" />
  
  # Bitcode Backend Ecosystem

  **A scalable, microservices-based backend powering a modern competitive programming platform.**
  
  <p align="center">
    <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" alt="Node.js" />
    <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
    <img src="https://img.shields.io/badge/Express.js-404D59?style=for-the-badge" alt="Express" />
    <img src="https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB" />
    <img src="https://img.shields.io/badge/Redis-DC382D?style=for-the-badge&logo=redis&logoColor=white" alt="Redis" />
    <img src="https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white" alt="Docker" />
  </p>

  [Explore the Frontend Application](https://github.com/viki-777/bitcode-frontend)
</div>

---

## 🚀 Overview

The **Bitcode Backend** is a highly modular, scalable ecosystem composed of **five independent microservices**. Built to handle everything from user authentication and problem management to isolated remote code execution via Docker. 

Each service is standalone with its own server, configuration, dependencies, and database. They communicate seamlessly via HTTP APIs and Redis/BullMQ for asynchronous job queuing.

---

## 🏗️ Microservices Architecture

### 1. 🚪 API Gateway
The central entry point for all frontend requests, securely routing incoming traffic to the appropriate downstream microservice.

### 2. 👤 UserService
Handles all identity and profile operations.
- **Authentication:** Secure JWT-based registration and login (bcrypt password hashing).
- **Profile & Activity:** Tracks user profiles, coding streaks, and historical activity heatmaps.
- **Gamification:** Manages the radar-chart mastery statistics and problem-solving counts.

### 3. 🧩 ProblemService
The core domain managing competitive programming questions.
- **Problem Management:** Full CRUD for algorithmic problems, test cases, and multi-language code templates.
- **Taxonomy:** Robust tagging system categorizing problems by topics, difficulty, and companies.
- **Community Forums:** Markdown-supported Discussion threads attached to every problem.
- **Solutions Library:** Shared community solutions library with upvote mechanics.

### 4. 📤 SubmissionService
Manages the lifecycle of user code submissions.
- **Submission Tracking:** Validates and stores user submissions.
- **Run vs Submit:** Differentiates between casual test runs and permanent leaderboard submissions.
- **Global Leaderboard:** Redis-backed global ranking system tracking the top coders.
- **Job Queuing:** Enqueues validated code into BullMQ for processing.

### 5. ⚡ EvaluationService
The remote code execution engine.
- **Docker Isolation:** Securely executes untrusted user code inside isolated Docker containers with strict memory and CPU limits.
- **Multi-language Support:** Runs Python and C++ seamlessly.
- **Test Case Validation:** Compares standard output against expected outputs to generate verdicts (AC, WA, TLE, RE).
- **Background Workers:** Consumes jobs from Redis via BullMQ, processing submissions asynchronously and instantly pushing results back.

---

## 🛠️ Shared Technologies & Patterns

While each microservice is decoupled, they share a unified technical standard to ensure high maintainability:

- **Runtime & Language:** Node.js + Express.js written in strict TypeScript.
- **Database:** MongoDB with Mongoose ODM (Independent databases per service).
- **Validation:** Strict runtime request validation using Zod.
- **Logging:** Winston logger with daily file rotation and MongoDB transports.
- **Resilience:** Centralized error handling and correlation IDs for distributed tracing.

---

## 📦 Getting Started

### Prerequisites
- Node.js (v18+)
- MongoDB (Local or Remote)
- Redis Server (Required for queues and leaderboards)
- Docker Daemon (Crucial for the EvaluationService to spawn execution containers)

### Recommended Ports
- **API Gateway:** `8000`
- **UserService:** `3001`
- **ProblemService:** `3002`
- **SubmissionService:** `3003`
- **EvaluationService:** `3004`

### Installation & Startup

1. **Clone the repository**
   ```bash
   git clone https://github.com/viki-777/bitcode-backend.git
   cd bitcode-backend
   ```

2. **Install dependencies and start each service**
   Open a separate terminal for each microservice and run:
   ```bash
   cd <ServiceName>
   npm install
   npm run dev
   ```

3. **Environment Configuration**
   Each service requires its own `.env` file. Refer to the specific service directory for local environment configurations (typically requiring `PORT`, `DB_URI`, `JWT_SECRET`, and `REDIS_HOST`).

---

## 🔄 Data Flow: The Code Execution Journey

1. **Client** hits the API Gateway (POST `/api/v1/submissions`).
2. **API Gateway** proxies the request to the **SubmissionService**.
3. **SubmissionService** validates the code, persists it, and pushes a job to the **Redis Queue**.
4. **EvaluationService Worker** pops the job from Redis.
5. **EvaluationService** fetches the hidden test cases from the **ProblemService**.
6. **EvaluationService** spawns an isolated **Docker Container**, injecting the user's code and input.
7. Container executes, output is compared against expectations, and a verdict (e.g., `AC` or `WA`) is generated.
8. **EvaluationService** patches the final result back to the **SubmissionService**.
9. If successful, **SubmissionService** updates the **Leaderboard** and notifies the **UserService** to increment the user's activity streak!

## 🌐 API Endpoints Reference

All requests must be prefixed with the API Gateway URL or the specific microservice route (e.g., `http://localhost:8000/api/v1`).

### 👤 User & Auth Service
- `POST /auth/register` - Register a new user
- `POST /auth/login` - Authenticate and receive JWT
- `POST /auth/refresh` - Refresh access token
- `POST /auth/logout` - Invalidate current session
- `GET /users/me` - Get current user profile and activity stats
- `GET /users/leaderboard/global` - Get top global users by score

### 🧩 Problem Service
- **Problems (CRUD):**
  - `GET /problems` - List problems (with pagination/filters)
  - `POST /problems` - Create a new problem (Admin)
  - `GET /problems/slug/:slug` - Fetch problem details for workspace
  - `PUT /problems/:id` - Full update (Admin)
  - `PATCH /problems/:id` - Partial update (Admin)
  - `DELETE /problems/:id` - Hard delete (Admin)
  - `DELETE /problems/:id/soft` - Soft delete (Admin)
- **Metadata & Management:**
  - `GET /problems/random` - Fetch a random problem
  - `GET /problems/:id/meta` - Get problem metadata
  - `GET /problems/:id/stats` - Get submission statistics
- **Community:**
  - `GET /problems/:id/comments` - List discussion comments
  - `POST /problems/:id/comments` - Post a comment
  - `GET /problems/:id/solutions` - List community solutions
  - `POST /problems/:id/solutions` - Publish a new solution
- **Categories & Companies:**
  - `GET|POST|PUT|DELETE /categories` - Manage categories
  - `GET|POST|PUT|DELETE /companies` - Manage companies

### 📤 Submission Service
- `POST /submissions` - Submit code for evaluation (accepts `isRun` boolean for testing)
- `GET /submissions/:id` - Get specific submission result (used for polling)
- `GET /submissions/problem/:problemId` - Get user's submission history for a problem
- `PATCH /submissions/:id/status` - (Internal) Update submission verdict
- `DELETE /submissions/:id` - Remove a submission

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'feat: Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

<div align="center">
  <i>Built with ❤️ for the competitive programming community.</i>
</div>
