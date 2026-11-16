# Student Task Management System with Automated DevOps Deployment

A responsive, modern web-based Student Task Management application built with pure frontend technologies (**HTML5**, **CSS3**, **JavaScript**, **LocalStorage**) and deployed through an end-to-end automated **DevOps CI/CD pipeline** (**Git**, **GitHub**, **Jenkins**, **Docker**, **Nginx**, **AWS EC2**).

---

## 🌐 Live Production Deployment

- **Application URL:** [http://54.91.6.226](http://54.91.6.226)
- **Health Check Endpoint:** [http://54.91.6.226/health](http://54.91.6.226/health)
- **GitHub Repository:** [https://github.com/AyushB-coder/student-task-management](https://github.com/AyushB-coder/student-task-management)

---

## 📌 Project Architecture & Flow

```
Developer (Code Push)
       │
       ▼
   GitHub (Repository & Webhooks / SCM Polling)
       │
       ▼
   Jenkins Pipeline
   ├── Stage 1: Checkout SCM
   ├── Stage 2: Validate Application Files
   ├── Stage 3: Run Automated Tests (node test.js)
   ├── Stage 4: Build Docker Image
   └── Stage 5: Deploy Docker Container
       │
       ▼
   Docker Container (Nginx Alpine Web Server)
       │
       ▼
   AWS EC2 Production Server (Live HTTP:80)
```

---

## 📂 Project Directory Structure

```text
student-task-management/
│
├── index.html          # Main HTML5 structure with dashboard UI & modals
├── style.css           # Responsive design system, CSS variables & animations
├── script.js           # Client-side task CRUD logic & LocalStorage persistence
├── test.js             # Automated test suite (26 unit & DOM verification tests)
├── Dockerfile          # Production Nginx Alpine container definition
├── nginx.conf          # Custom web server config with Gzip & /health endpoint
├── Jenkinsfile         # Declarative CI/CD pipeline specification (5 stages)
├── README.md           # Project documentation and deployment guide
└── .gitignore          # Git exclusion rules
```

---

## 🚀 Technology Stack

| Layer | Technology | Details |
| :--- | :--- | :--- |
| **Frontend UI** | HTML5, CSS3, JavaScript (ES6+) | Modern student dashboard, responsive layout |
| **Typography & Icons** | Plus Jakarta Sans, FontAwesome 6 | Clean, professional academic design |
| **Data Storage** | Browser `localStorage` | Pure client-side persistence (No external database required) |
| **Version Control** | Git, GitHub | Distributed version control & source code management |
| **CI/CD Automation** | Jenkins | Declarative Pipeline automating testing & deployment |
| **Containerization** | Docker | Production container packaging with Alpine Linux |
| **Web Server** | Nginx Alpine | High-performance static web server with Gzip compression |
| **Cloud Infrastructure** | AWS EC2 (Ubuntu 24.04 LTS) | Public cloud hosting on port 80 |

---

## 🛠️ Key Features & Functionality

1. **Dashboard Analytics:** Real-time counters for **Total Tasks**, **Pending Tasks**, **Completed Tasks**, and **Overdue Tasks**.
2. **Task Management (CRUD):** Add, Edit, Delete (with confirmation dialog), and Mark Complete/Pending.
3. **Smart Filters & Search:** Search tasks in real-time by title, subject, or description. Filter by status (`All`, `Pending`, `Completed`, `Overdue`) and priority (`High`, `Medium`, `Low`).
4. **Data Persistence:** Automatically saves all task updates to browser `localStorage` across refreshes and sessions.
5. **Seeded Sample Data:** Pre-populated with realistic academic tasks on first launch, with the ability to reset to defaults.
6. **Automated Testing:** Dedicated test suite (`test.js`) verifying core file existence, HTML structure, JS syntax, and DOM IDs.
7. **Production Health Monitoring:** Custom Nginx `/health` endpoint returning real-time JSON application status (`{"status":"UP"}`).

---

## 📅 Roadmap & Execution Phases

- [x] **Phase 1: Project Setup** - Scaffolding directory structure, initial project files, and repository setup.
- [x] **Phase 2: Frontend Development** - Complete interactive dashboard, task management CRUD, filters, and LocalStorage.
- [x] **Phase 3: GitHub Integration** - Initialized Git repository, connected remote origin, and pushed to GitHub.
- [x] **Phase 4: Jenkins Configuration** - Created declarative `Jenkinsfile` and configured pipeline stages.
- [x] **Phase 5: Docker Implementation** - Created `Dockerfile` and `nginx.conf`, built image, and ran container on port 8085.
- [x] **Phase 6: AWS EC2 Deployment** - Provisioned Ubuntu EC2 instance, configured Security Groups, and deployed live on port 80.
- [x] **Phase 7: CI/CD Automation (Final Phase)** - Integrated GitHub repository with Jenkins for automated test validation and deployment.

---

## 💻 Quick Run Commands

### 1. Run Automated Tests
```bash
node test.js
```

### 2. Build and Run Docker Container Locally
```bash
# Build the Docker image
docker build -t student-task-manager:latest .

# Run container on port 8085
docker run -d --name student-task-manager-app -p 8085:80 --restart unless-stopped student-task-manager:latest
```

### 3. Verify Container Health
```bash
curl http://localhost:8085/health
```
