# 🗂️ Requirements Management Portal

> A full-stack web app I built to manage and track project requirements — React (TypeScript) frontend with a FastAPI (Python) backend, deployed on Vercel.

![React](https://img.shields.io/badge/React-18-61dafb?logo=react) ![TypeScript](https://img.shields.io/badge/TypeScript-5-3178c6?logo=typescript) ![FastAPI](https://img.shields.io/badge/FastAPI-0.111-009688?logo=fastapi) ![Python](https://img.shields.io/badge/Python-3.11-3776ab?logo=python) ![Vercel](https://img.shields.io/badge/Vercel-Deploy-black?logo=vercel)

## ✨ Features

- 🔐 **JWT Authentication** — Login system with hardcoded credentials (no database needed)
- 📋 **Requirements CRUD** — Add, view, edit, and delete requirements
- 🏷️ **Priority & Status Tracking** — Critical / High / Medium / Low + Open / In Progress / Done / Closed
- 🔍 **Search & Filter** — Filter requirements by status, priority, or assignee
- 📊 **Dashboard** — Summary stats and progress charts
- 👥 **Two Roles** — Admin and Viewer access levels
- 💾 **In-memory Storage** — FastAPI keeps data in-process (resets on restart — good enough for demo)
- 🚀 **Deployed on Vercel** — Frontend + Serverless API functions

## 🏗️ Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 18 + TypeScript + Vite |
| Styling | Tailwind CSS + shadcn/ui |
| Charts | Recharts |
| Animation | Framer Motion |
| Backend | FastAPI (Python 3.11) |
| Auth | JWT (python-jose) |
| Deploy | Vercel |

## 🚀 Running Locally

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

## 👤 Login Credentials

| Role | Username | Password |
|------|----------|----------|
| Admin | `admin` | `admin123` |
| Viewer | `viewer` | `viewer123` |

## 📁 Project Structure

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

## 🌐 Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/Matam-Rohith/requirements-management-portal)

---
**Built by [Matam Rohith](https://rohith-portfolio-six.vercel.app/) — CS Engineering Student @ SR University**
