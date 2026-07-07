# 🗂️ Requirements Management Portal

> Production-ready Requirements Management Portal — React (TypeScript) + FastAPI (Python) deployed on Vercel. No database, hardcoded auth, full REST API.

![React](https://img.shields.io/badge/React-18-61dafb?logo=react) ![TypeScript](https://img.shields.io/badge/TypeScript-5-3178c6?logo=typescript) ![FastAPI](https://img.shields.io/badge/FastAPI-0.111-009688?logo=fastapi) ![Python](https://img.shields.io/badge/Python-3.11-3776ab?logo=python) ![Vercel](https://img.shields.io/badge/Vercel-Deploy-black?logo=vercel)

## ✨ Features

- 🔐 **Hardcoded Auth** — JWT-based login, no database needed
- 📋 **Requirements CRUD** — Create, Read, Update, Delete requirements
- 🏷️ **Priority & Status Tracking** — Critical/High/Medium/Low + Open/In Progress/Done/Closed
- 🔍 **Search & Filter** — Filter by status, priority, assignee
- 📊 **Dashboard** — Live stats, progress charts
- 👥 **Multi-role** — Admin and Viewer roles
- 💾 **In-memory storage** — FastAPI stores data in-process (resets on restart)
- 🚀 **Vercel ready** — Frontend + Serverless API

## 🏗️ Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 18 + TypeScript + Vite |
| Styling | Tailwind CSS + shadcn/ui |
| Charts | Recharts |
| Animation | Framer Motion |
| Backend | FastAPI (Python 3.11) |
| Auth | JWT (python-jose) |
| Deploy | Vercel (frontend + serverless) |

## 🚀 Getting Started

```bash
# Frontend
cd frontend
npm install
npm run dev

# Backend
cd api
pip install -r requirements.txt
uvicorn main:app --reload
```

## 👤 Default Credentials

| Role | Username | Password |
|------|----------|----------|
| Admin | `admin` | `admin123` |
| Viewer | `viewer` | `viewer123` |

## 📁 Structure

```
├── frontend/          # React + TypeScript
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── hooks/
│   │   └── types/
├── api/               # FastAPI Python
│   ├── main.py
│   └── requirements.txt
└── vercel.json        # Vercel deployment config
```

## 🌐 Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/Matam-Rohith/requirements-management-portal)

---
**Built by [Matam Rohith](https://rohith-portfolio-six.vercel.app/)**
