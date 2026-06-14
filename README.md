# 🚀 ResumeRocket - AI-Powered Resume Optimization Platform

<div align="center">

### Build ATS-Optimized Resumes with AI

Create, optimize, analyze, and tailor professional resumes using AI-powered assistance.

![React](https://img.shields.io/badge/Frontend-React%2019-blue)
![NodeJS](https://img.shields.io/badge/Backend-Node.js-green)
![MongoDB](https://img.shields.io/badge/Database-MongoDB-brightgreen)
![AI](https://img.shields.io/badge/AI-Gemini%20%7C%20Groq-orange)
![License](https://img.shields.io/badge/License-MIT-blue)

[Live Demo](#) • [Architecture](docs/architecture.md) • [System Design](docs/system_design.md) • [Interview Guide](docs/interview_guide.md)

</div>

---

# 📌 Overview

ResumeRocket is a full-stack AI-powered Resume Optimization Platform designed to help students, job seekers, and professionals create highly optimized resumes for modern hiring systems.

Unlike traditional resume builders, ResumeRocket combines AI-assisted content generation, ATS optimization, resume parsing, job description matching, and intelligent resume reviews into a single platform.

Users can generate resumes from scratch, import existing resumes, optimize them for specific job descriptions, and continuously improve their ATS readiness using actionable AI feedback.

---

# ✨ Features

## 🎯 Resume Builder

* Dynamic Resume Creation
* Real-Time Resume Preview
* Professional Resume Templates
* Theme Customization
* PDF Export
* Mobile Responsive Interface

---

## 🤖 AI Resume Assistant

Generate and improve:

* Professional Summaries
* Experience Descriptions
* Project Descriptions
* Technical Skills
* Resume Content Refinement

Powered by:

* Google Gemini
* Groq LLMs

Includes intelligent model routing for improved performance and reliability.

---

## 📊 ATS Resume Analysis

Analyze resumes against ATS standards.

Provides:

* ATS Score
* Missing Keywords
* Formatting Suggestions
* Content Quality Review
* Resume Completeness Analysis

---

## 🎯 Job Description Matching

Paste any job description and instantly receive:

* Match Score
* Matching Skills
* Missing Keywords
* Optimization Suggestions
* ATS Improvement Recommendations

---

## 📂 Resume Import & Parsing

Import resumes from:

* PDF
* DOCX

Automatically extracts:

* Personal Information
* Education
* Experience
* Projects
* Skills
* GitHub Links
* LinkedIn Profiles
* Portfolio URLs

and converts them into editable resume data.

---

## 🔄 Resume Versioning

Track changes and resume evolution.

Features:

* Snapshot Creation
* Version History
* Restore Previous Versions
* Resume Progress Tracking

---

## 📈 Placement Analytics Dashboard

Track:

* Resume Score History
* ATS Readiness
* Template Usage
* Resume Improvement Trends
* Optimization Progress

---

# 🏗️ System Architecture

```mermaid
flowchart TD

    User[User]

    User --> Frontend[React Frontend]

    Frontend --> Backend[Express Backend]

    Backend --> Auth[Authentication]

    Backend --> Resume[Resume Management]

    Backend --> AI[AI Router]

    Resume --> MongoDB[(MongoDB)]

    AI --> Gemini[Gemini Models]

    AI --> Groq[Groq Models]

    Gemini --> AIResponse[AI Response]

    Groq --> AIResponse

    AIResponse --> Frontend

    Resume --> PDFExport[PDF Export]

    Resume --> Import[Resume Import]

    Import --> PDFParser[PDF Parser]

    Import --> DOCXParser[DOCX Parser]
```

---

# 🧠 AI Architecture

ResumeRocket uses a provider-agnostic AI routing layer.

```mermaid
flowchart LR

    Request[AI Request]

    Request --> Router[AI Router]

    Router --> GeminiFlash[Gemini Flash]

    Router --> GroqLlama[Groq Llama]

    Router --> GroqQwen[Groq Qwen]

    GeminiFlash --> Response[Optimized Response]

    GroqLlama --> Response

    GroqQwen --> Response
```

### Benefits

* Faster Response Times
* Free-Tier Optimization
* Automatic Failover
* Better Reliability
* Reduced Downtime

---

# 🛠️ Tech Stack

## Frontend

* React 19
* Vite
* Tailwind CSS
* React Router
* Axios
* Framer Motion

## Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT Authentication
* Multer

## AI Layer

* Google Gemini
* Groq
* AI Routing Engine

## Resume Processing

* PDF Parsing
* DOCX Parsing
* Resume Analysis Engine

---

# 📂 Project Structure

```text
ResumeRocket
│
├── frontend
│   ├── src
│   │   ├── components
│   │   ├── pages
│   │   ├── context
│   │   ├── services
│   │   └── templates
│   │
│   └── public
│
├── backend
│   ├── controllers
│   ├── routes
│   ├── services
│   ├── middleware
│   ├── models
│   └── config
│
├── docs
│
└── README.md
```

---

# 🔐 Authentication Flow

```mermaid
sequenceDiagram

    participant User
    participant Frontend
    participant Backend
    participant Database

    User->>Frontend: Login/Register

    Frontend->>Backend: Authentication Request

    Backend->>Database: Validate User

    Database-->>Backend: Result

    Backend-->>Frontend: JWT Token

    Frontend-->>User: Access Granted
```

---

# 🚀 Getting Started

## Clone Repository

```bash
git clone https://github.com/Sanat1427/ResumeBuilder.git

cd ResumeBuilder
```

---

## Backend Setup

```bash
cd backend

npm install

npm run dev
```

Create a `.env` file:

```env
PORT=4000

MONGO_URI=YOUR_MONGODB_URI

JWT_SECRET=YOUR_SECRET

GEMINI_API_KEY=YOUR_GEMINI_KEY

GROQ_API_KEY=YOUR_GROQ_KEY
```

---

## Frontend Setup

```bash
cd frontend

npm install

npm run dev
```

Create `.env`:

```env
VITE_API_URL=http://localhost:4000
```

---

# 📦 Core Modules

## Authentication

* User Registration
* Login
* JWT Authorization

## Resume Management

* Create Resume
* Update Resume
* Delete Resume
* Export Resume

## AI Services

* Summary Generation
* Experience Generation
* Project Generation
* Resume Review
* ATS Analysis
* JD Matching

## Resume Import

* PDF Resume Parsing
* DOCX Resume Parsing

---

# 🎨 Resume Templates

Supported Templates:

* Modern Professional
* ATS Friendly
* Minimal Design
* Placement Focused Layouts

Each template supports:

* PDF Export
* Theme Switching
* Live Preview
* Real-Time Updates

---

# 📈 Future Roadmap

* AI Cover Letter Generator
* Interview Preparation Assistant
* Mock Interview Simulator
* LinkedIn Profile Optimizer
* Portfolio Generator
* Recruiter Dashboard
* Resume Benchmarking

---

# 🏆 Learning Outcomes

This project demonstrates:

* Full Stack Development
* System Design
* AI Integration
* Authentication & Security
* Database Design
* Resume Parsing
* ATS Optimization
* Production Deployment
* Scalable Backend Architecture

---

# 👨‍💻 Author

### Sanat Kishore

B.Tech Computer Science & Engineering (AI/ML)

BIT Mesra

GitHub: https://github.com/Sanat1427

LinkedIn: Add Your LinkedIn URL

---

## ⭐ Support

If you found this project useful, consider giving it a star on GitHub.

It helps others discover the project and motivates further development.
