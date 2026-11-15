# Student Task Management System with Automated DevOps Deployment

A responsive, modern web-based Student Task Management application built with pure frontend technologies (**HTML5**, **CSS3**, **JavaScript**, **LocalStorage**) and deployed through an end-to-end automated **DevOps CI/CD pipeline** (**Git**, **GitHub**, **Jenkins**, **Docker**, **Nginx**, **AWS EC2**).

---

## 📌 Project Architecture & Flow

```
Developer (Code Push)
       │
       ▼
   GitHub (Repository & Webhook)
       │
       ▼
   Jenkins Pipeline (EC2 / Host)
   ├── Stage 1: Checkout SCM
   ├── Stage 2: Validate Application Files
   ├── Stage 3: Run Automated Tests
   ├── Stage 4: Build Docker Image
   └── Stage 5: Deploy Docker Container
       │
       ▼
   Docker Container (Nginx Web Server)
       │
       ▼
   AWS EC2 (Public Access via HTTP:80)
```

---

## 📂 Project Directory Structure

```
student-task-management/ (or devops_finalproject/)
│
├── index.html          # Main HTML structure with semantic dashboard components
├── style.css           # Modern, responsive design system & theme variables
├── script.js           # Client-side task state management, LocalStorage, and UI logic
├── Dockerfile          # Nginx alpine container definition (Phase 5)
├── nginx.conf          # Custom web server configuration (Phase 5)
├── Jenkinsfile         # Declarative CI/CD pipeline specification (Phase 4)
├── README.md           # Project documentation and deployment guide
└── .gitignore          # Git exclusion rules
```

---

## 🚀 Technology Stack

| Layer | Technology |
| :--- | :--- |
| **Frontend UI** | HTML5, CSS3, JavaScript (ES6+) |
| **Icons & Fonts** | FontAwesome, Google Fonts (Inter) |
| **Data Storage** | Browser `localStorage` (No external database required) |
| **Version Control** | Git, GitHub |
| **CI/CD Automation**| Jenkins (Declarative Pipeline) |
| **Containerization**| Docker, Docker Engine |
| **Web Server** | Nginx Alpine |
| **Cloud Infrastructure** | Amazon Web Services (AWS EC2 - Ubuntu) |

---

## 📅 Roadmap & Execution Phases

- [x] **Phase 1: Project Setup** - Directory scaffolding, basic files, and architecture setup.
- [ ] **Phase 2: Frontend Development** - Complete interactive dashboard, task management CRUD, filters, and LocalStorage.
- [ ] **Phase 3: GitHub Integration** - Git repository initialization, remote linking, and branch management.
- [ ] **Phase 4: Jenkins Configuration** - Declarative pipeline setup, automated verification tests.
- [ ] **Phase 5: Docker Implementation** - Containerization with Nginx, image building, local container verification.
- [ ] **Phase 6: AWS EC2 Deployment** - Cloud server provisioning, security groups, and live container deployment.
- [ ] **Phase 7: CI/CD Automation** - Webhook integration for automatic build & deploy on push.
- [ ] **Phase 8: Monitoring & Rollback** - Container health checks, logs monitoring, and version rollback strategies.
- [ ] **Phase 9: Final Verification & Viva Prep** - Project presentation checklist, viva Q&A guide, and demonstration notes.
