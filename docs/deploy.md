# 🚀 ResumeRocket Deployment Guide

This guide explains how to run ResumeRocket locally and deploy it to production using Render and MongoDB Atlas.

---

# 📌 Deployment Overview

ResumeRocket consists of:

```text
Frontend  → React + Vite
Backend   → Node.js + Express
Database  → MongoDB Atlas
AI APIs   → Gemini + Groq
Hosting   → Render
```

---

# 🏗️ Deployment Architecture

```mermaid
flowchart LR

    User[Browser]

    User --> Frontend[Render Frontend]

    Frontend --> Backend[Render Backend]

    Backend --> MongoDB[(MongoDB Atlas)]

    Backend --> Gemini[Gemini API]

    Backend --> Groq[Groq API]
```

---

# 💻 Local Development Setup

---

## Clone Repository

```bash
git clone https://github.com/Sanat1427/ResumeBuilder.git

cd ResumeBuilder
```

---

# ⚙️ Backend Setup

Navigate to backend:

```bash
cd backend
```

Install dependencies:

```bash
npm install
```

---

## Create Environment Variables

Create:

```text
backend/.env
```

Example:

```env
PORT=4000

MONGO_URI=your_mongodb_connection_string

JWT_SECRET=your_jwt_secret

GEMINI_API_KEY=your_gemini_api_key

GROQ_API_KEY=your_groq_api_key
```

---

## Start Backend

Development:

```bash
npm run dev
```

Production:

```bash
npm start
```

Expected:

```text
DB CONNECTED
Server started on port 4000
```

---

# 🎨 Frontend Setup

Navigate to frontend:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

---

## Create Frontend Environment File

Create:

```text
frontend/.env
```

Example:

```env
VITE_API_URL=http://localhost:4000
```

---

## Start Frontend

```bash
npm run dev
```

Application available at:

```text
http://localhost:5173
```

---

# ☁️ MongoDB Atlas Setup

---

## Create Cluster

1. Create MongoDB Atlas account
2. Create free cluster
3. Create database user
4. Whitelist IP

---

## Connection String

Example:

```env
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/resumerocket
```

---

## Test Connection

Backend logs:

```text
DB CONNECTED
```

If not:

```text
MongoDB Connection Failed
```

Verify:

* Username
* Password
* Network Access
* Database URL

---

# 🌐 Backend Deployment (Render)

---

## Create Backend Service

Choose:

```text
Web Service
```

Repository:

```text
ResumeBuilder
```

---

## Build Command

```bash
npm install
```

---

## Start Command

```bash
node server.js
```

or

```bash
npm start
```

depending on your backend setup.

---

# Backend Environment Variables

Add:

```env
PORT=10000

MONGO_URI=

JWT_SECRET=

GEMINI_API_KEY=

GROQ_API_KEY=

FRONTEND_URL=https://your-frontend-url.onrender.com
```

---

# Backend CORS Configuration

Example:

```javascript
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      process.env.FRONTEND_URL
    ],
    credentials: true,
  })
);
```

---

# 🎨 Frontend Deployment (Render)

---

## Create Static Site

Choose:

```text
Static Site
```

Repository:

```text
ResumeBuilder
```

---

## Build Command

```bash
npm install && npm run build
```

---

## Publish Directory

```text
dist
```

---

## Frontend Environment Variables

```env
VITE_API_URL=https://your-backend-url.onrender.com
```

Example:

```env
VITE_API_URL=https://resumebuilder-backned.onrender.com
```

---

# 🔐 Security Best Practices

---

## Never Commit Secrets

Bad:

```env
GROQ_API_KEY=actual_key
```

Good:

```env
GROQ_API_KEY=
```

inside:

```text
.env.example
```

---

## Root .gitignore

```gitignore
# Dependencies
node_modules/

# Environment Variables
.env
.env.*

# Build
dist/
build/

# Logs
*.log
```

---

## API Key Rotation

Immediately rotate keys if:

* Accidentally committed
* Shared publicly
* Flagged by GitHub

---

# 🧠 AI Provider Setup

---

## Gemini

Generate key from:

Google AI Studio

Add:

```env
GEMINI_API_KEY=
```

---

## Groq

Generate key from:

Groq Console

Add:

```env
GROQ_API_KEY=
```

---

# 📂 Resume Import Requirements

Supported formats:

```text
PDF
DOCX
```

Dependencies:

```bash
npm install pdf-parse mammoth multer
```

---

# 📄 PDF Generation

ResumeRocket exports:

```text
Professional Resume PDFs
```

Generated directly from resume data and template configuration.

---

# 🚨 Common Deployment Issues

---

## 1. CORS Error

Error:

```text
No Access-Control-Allow-Origin header
```

Fix:

Verify:

```env
FRONTEND_URL=
```

matches deployed frontend URL.

---

## 2. Network Error

Error:

```text
ERR_FAILED
```

Fix:

Verify:

```env
VITE_API_URL=
```

points to correct backend.

---

## 3. MongoDB Connection Failure

Error:

```text
DB Connection Failed
```

Check:

* MONGO_URI
* Atlas Network Access
* Credentials

---

## 4. AI Requests Failing

Check:

```env
GEMINI_API_KEY
GROQ_API_KEY
```

---

## 5. Build Failure

Verify:

```bash
npm install
npm run build
```

works locally before deployment.

---

# 📈 Production Monitoring

Recommended metrics:

* AI Response Latency
* Failed Requests
* ATS Analysis Count
* Resume Generation Count
* Active Users

---

# 🎯 Deployment Checklist

Before Production:

* [ ] MongoDB Connected
* [ ] Environment Variables Added
* [ ] CORS Configured
* [ ] AI Keys Added
* [ ] .env Ignored
* [ ] Build Successful
* [ ] Frontend Connected to Backend
* [ ] Resume Import Working
* [ ] PDF Export Working

---

# 🏆 Production URLs

Example:

Frontend:

```text
https://resumebuilder-frontend.onrender.com
```

Backend:

```text
https://resumebuilder-backned.onrender.com
```

Database:

```text
MongoDB Atlas
```

---

This deployment architecture enables ResumeRocket to run as a scalable AI-powered SaaS application with support for resume generation, ATS analysis, AI routing, and resume optimization workflows.
