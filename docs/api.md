# 🔌 ResumeRocket API Reference

This document describes all major API endpoints exposed by ResumeRocket.

Base URL:

```text
Development:
http://localhost:4000/api

Production:
https://resumebuilder-backned.onrender.com/api
```

---

# 🔐 Authentication APIs

---

## Register User

### Endpoint

```http
POST /auth/register
```

### Request

```json
{
  "name": "Sanat Kishore",
  "email": "sanat@example.com",
  "password": "password123"
}
```

### Response

```json
{
  "success": true,
  "message": "User registered successfully"
}
```

---

## Login User

### Endpoint

```http
POST /auth/login
```

### Request

```json
{
  "email": "sanat@example.com",
  "password": "password123"
}
```

### Response

```json
{
  "token": "jwt_token",
  "user": {
    "_id": "user_id",
    "name": "Sanat Kishore",
    "email": "sanat@example.com"
  }
}
```

---

# 📄 Resume APIs

---

## Create Resume

### Endpoint

```http
POST /resume/create
```

### Request

```json
{
  "title": "Software Engineer Resume",
  "template": "modern"
}
```

### Response

```json
{
  "success": true,
  "resumeId": "resume_id"
}
```

---

## Get All Resumes

### Endpoint

```http
GET /resume
```

### Response

```json
[
  {
    "_id": "resume_id",
    "title": "Software Engineer Resume"
  }
]
```

---

## Get Resume By ID

### Endpoint

```http
GET /resume/:id
```

---

## Update Resume

### Endpoint

```http
PUT /resume/:id
```

### Request

```json
{
  "summary": "Updated summary",
  "skills": ["Java", "Python"]
}
```

---

## Delete Resume

### Endpoint

```http
DELETE /resume/:id
```

---

# 🤖 AI APIs

ResumeRocket supports AI-powered content generation through Gemini and Groq.

---

## Generate Summary

### Endpoint

```http
POST /ai/generate-summary
```

### Request

```json
{
  "role": "Software Engineer",
  "skills": ["React", "Node.js"]
}
```

### Response

```json
{
  "generatedText": "Results-driven Software Engineer..."
}
```

---

## Generate Experience

### Endpoint

```http
POST /ai/generate-experience
```

### Request

```json
{
  "company": "Amazon",
  "role": "SDE Intern",
  "technologies": ["React", "Node.js"]
}
```

---

## Generate Project Description

### Endpoint

```http
POST /ai/generate-project
```

### Request

```json
{
  "projectTitle": "ResumeRocket",
  "technologies": ["React", "Node.js", "MongoDB"]
}
```

---

## Skill Suggestions

### Endpoint

```http
POST /ai/skill-suggestions
```

### Response

```json
{
  "skills": [
    "System Design",
    "REST APIs",
    "Docker"
  ]
}
```

---

# 📊 ATS APIs

---

## ATS Resume Analysis

### Endpoint

```http
POST /ai/ats-analysis
```

### Request

```json
{
  "resumeId": "resume_id"
}
```

### Response

```json
{
  "score": 84,
  "suggestions": [
    "Add more quantified achievements",
    "Improve keyword coverage"
  ]
}
```

---

## AI Resume Review

### Endpoint

```http
POST /ai/review
```

### Response

```json
{
  "overallScore": 88,
  "categories": {
    "ats": 90,
    "content": 85,
    "formatting": 89
  }
}
```

---

# 🎯 Job Description Matching APIs

---

## Match Resume Against JD

### Endpoint

```http
POST /ai/match-jd
```

### Request

```json
{
  "resumeId": "resume_id",
  "jobDescription": "Full stack developer..."
}
```

### Response

```json
{
  "matchScore": 87,
  "matchedKeywords": [
    "React",
    "Node.js",
    "MongoDB"
  ],
  "missingKeywords": [
    "AWS",
    "Docker"
  ]
}
```

---

# 📂 Resume Import APIs

---

## Import Resume

Supports:

* PDF
* DOCX

### Endpoint

```http
POST /ai/import
```

### Content Type

```text
multipart/form-data
```

### Request

```text
file = resume.pdf
```

### Response

```json
{
  "success": true,
  "resume": {
    "personalInfo": {},
    "education": [],
    "experience": [],
    "projects": []
  }
}
```

---

# 🔄 Resume Version APIs

---

## Create Snapshot

### Endpoint

```http
POST /resume/versions
```

### Request

```json
{
  "resumeId": "resume_id",
  "label": "Before ATS Optimization"
}
```

---

## Get Resume Versions

### Endpoint

```http
GET /resume/versions/:resumeId
```

---

## Restore Version

### Endpoint

```http
POST /resume/versions/restore
```

### Request

```json
{
  "versionId": "version_id"
}
```

---

# 📈 Analytics APIs

---

## User Analytics

### Endpoint

```http
GET /ai/user-analytics
```

### Response

```json
{
  "totalResumes": 8,
  "averageATSScore": 82,
  "jdMatches": 15
}
```

---

# 🔐 Authentication Requirements

Protected routes require:

```http
Authorization: Bearer <JWT_TOKEN>
```

Example:

```http
GET /resume

Authorization: Bearer eyJhbGciOi...
```

---

# ⚠️ Error Responses

---

## Validation Error

```json
{
  "success": false,
  "message": "Missing required fields"
}
```

---

## Unauthorized

```json
{
  "success": false,
  "message": "Unauthorized"
}
```

---

## Not Found

```json
{
  "success": false,
  "message": "Resource not found"
}
```

---

## Server Error

```json
{
  "success": false,
  "message": "Internal server error"
}
```

---

# 🚀 API Design Highlights

ResumeRocket APIs are designed around:

* REST Principles
* JWT Authentication
* Modular Services
* AI Provider Abstraction
* Resume-Centric Workflows
* ATS Optimization Pipelines

The API architecture allows easy integration with future services such as Cover Letter Generation, Interview Preparation, LinkedIn Optimization, and Recruiter Dashboards.
