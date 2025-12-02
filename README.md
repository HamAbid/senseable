# 🎯 SenseAble - Personalized Text Accessibility

An intelligent text rephrasing tool that adapts content based on individual accessibility needs.

## ✨ Features

- Smart text analysis with phrase tagging
- Gentle & Full rewrites
- Custom chat instructions
- Accessibility-based color palettes
- Interactive suggestions (Accept/Ignore)
- Iterative refinement workflow

## 🚀 Quick Start

### Test Demo Locally (No Backend)

```bash
cd frontend
npm install
npm run dev
```

Open http://localhost:3000 ✨ Works with localStorage!

### Use with Backend

First, enable backend mode in `frontend/.env.local`:
```env
VITE_DEMO_MODE=false
VITE_API_URL=http://localhost:8000
```

Then run both backend and frontend:
```bash
# Terminal 1: Backend
cd backend && go run main.go

# Terminal 2: Frontend
cd frontend && npm run dev
```

## 📦 Deployment

**See [DEPLOYMENT.md](./DEPLOYMENT.md) for:**
- Deploy demo to GitHub Pages (5 min)
- Deploy with backend (Railway, Render, etc.)
- Switch between demo/production modes
- All hosting options

## 🛠️ Tech Stack

**Frontend:** React, TypeScript, Vite, Tailwind  
**Backend:** Go, PostgreSQL (optional for demo)

## 🎭 Two Modes

**Demo Mode** (Default)
- Uses localStorage
- No backend needed
- Perfect for GitHub Pages
- Free hosting

**Production Mode**
- Full backend API
- PostgreSQL database
- Multi-device sync

Switch with one variable:
```env
VITE_DEMO_MODE=true   # Demo
VITE_DEMO_MODE=false  # Production
```

## 📁 Project Structure

```
senseable/
├── frontend/          # React app
├── backend/           # Go API (optional)
├── README.md          # This file
└── DEPLOYMENT.md      # All deployment info
```

## 🔧 Configuration

| Variable | Demo | Production |
|----------|------|------------|
| `VITE_DEMO_MODE` | `true` | `false` |
| `VITE_API_URL` | - | `https://api.com` |

## 🐛 Troubleshooting

Check [DEPLOYMENT.md](./DEPLOYMENT.md#troubleshooting) for common issues.

---

**Ready to deploy?** → [DEPLOYMENT.md](./DEPLOYMENT.md)
