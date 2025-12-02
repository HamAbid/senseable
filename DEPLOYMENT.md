# 🚀 Deployment Guide

Complete guide for deploying SenseAble in demo or production mode.

---

## 📋 Table of Contents

1. [Demo Mode (GitHub Pages)](#1-demo-mode-github-pages) - 5 minutes
2. [Production Mode (With Backend)](#2-production-mode-with-backend) - 30 minutes
3. [Switching Between Modes](#3-switching-between-modes)
4. [Environment Variables](#4-environment-variables)
5. [Troubleshooting](#5-troubleshooting)

---

## 1. Demo Mode (GitHub Pages)

No backend needed. Uses localStorage. **Free hosting.**

### Step 1: Update Workflow

Edit `.github/workflows/deploy.yml` line 38:
```yaml
VITE_BASE_PATH: '/your-repo-name/'  # Change this!
```

### Step 2: Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR-USERNAME/YOUR-REPO.git
git push -u origin main
```

### Step 3: Enable GitHub Pages

1. Go to repo → **Settings** → **Pages**
2. Source: Select **"GitHub Actions"**
3. Done!

Your demo: `https://YOUR-USERNAME.github.io/YOUR-REPO/`

---

## 2. Production Mode (With Backend)

Full backend with PostgreSQL. **~$5-10/month.**

### Option A: Railway (Recommended)

**1. Deploy Backend:**
```bash
cd backend
npm install -g @railway/cli
railway login
railway init
railway up
```

Get URL: `https://senseable-backend.railway.app`

**2. Deploy Frontend:**
```bash
cd frontend

# Edit .env.production
VITE_DEMO_MODE=false
VITE_API_URL=https://senseable-backend.railway.app

# Deploy to Vercel
npm install -g vercel
vercel --prod
```

Set environment variables when prompted:
- `VITE_DEMO_MODE` = `false`
- `VITE_API_URL` = `https://your-railway-url.railway.app`

**Done!** Production app is live.

---

### Option B: Render

**1. Deploy Backend:**
1. Go to https://render.com
2. New → Web Service
3. Connect GitHub repo
4. Settings:
   - Root Directory: `backend`
   - Build: `go build -o main`
   - Start: `./main`
5. Add PostgreSQL database (New → PostgreSQL)
6. Deploy

**2. Deploy Frontend:** Same as Railway above

---

### Option C: Fly.io

**1. Deploy Backend:**
```bash
cd backend
curl -L https://fly.io/install.sh | sh
fly auth login
fly launch
fly postgres create
fly postgres attach senseable-db
```

**2. Deploy Frontend:** Same as Railway above

---

## 3. Switching Between Modes

### Local Development

**Demo Mode (Default):**
```bash
cd frontend && npm run dev
```
No backend needed! Uses localStorage.

**With Backend:**

Edit `frontend/.env.local` to enable backend mode:
```env
VITE_DEMO_MODE=false
VITE_API_URL=http://localhost:8000
```

Then run both:
```bash
# Terminal 1: Backend
cd backend && go run main.go

# Terminal 2: Frontend
cd frontend && npm run dev
```

---

### Production Build

**Demo Mode:**
```bash
cd frontend
npm run build  # Uses .env.production (DEMO_MODE=true)
```

**Production Mode:**
```bash
cd frontend

# Edit .env.production first:
VITE_DEMO_MODE=false
VITE_API_URL=https://your-backend.com

npm run build
```

---

## 4. Environment Variables

### Frontend Files

| File | Purpose | When Used | Committed? |
|------|---------|-----------|------------|
| `.env.development` | Local dev defaults (demo mode) | `npm run dev` | ✅ Yes |
| `.env.production` | Build defaults (demo mode) | `npm run build` | ✅ Yes |
| `.env.local` | Local overrides (switch to backend) | Always (overrides above) | ❌ No (gitignored) |

**To switch between modes locally:** Edit `frontend/.env.local`

### Variables

| Variable | Demo | Production |
|----------|------|------------|
| `VITE_DEMO_MODE` | `true` | `false` |
| `VITE_API_URL` | (not needed) | `https://backend-url.com` |
| `VITE_BASE_PATH` | `/repo-name/` | `/` |

### Verify Mode

Open browser console:
```
🚀 SenseAble Mode: DEMO (localStorage)
```
or
```
🚀 SenseAble Mode: PRODUCTION (Backend API)
🔗 API Base URL: https://your-backend.com
```

---

## 5. Troubleshooting

### Blank page on GitHub Pages

**Fix:** Check `VITE_BASE_PATH` in `.github/workflows/deploy.yml` matches repo name.

Example: Repo is `senseable` → Use `/senseable/`

---

### CORS Errors

**Fix:** Update backend CORS:
```go
c.Writer.Header().Set("Access-Control-Allow-Origin", "https://your-frontend.vercel.app")
c.Writer.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type")
```

---

### Still using localStorage in production

**Fix:**
1. Check `.env.production` has `VITE_DEMO_MODE=false`
2. Rebuild: `npm run build`
3. Clear browser cache
4. Hard refresh (Cmd+Shift+R)

---

### Environment variables not working

**Vercel:**
```bash
vercel env add VITE_DEMO_MODE
# Enter: false

vercel env add VITE_API_URL
# Enter: https://backend-url.com

vercel --prod
```

**Netlify:**
```bash
netlify env:set VITE_DEMO_MODE false
netlify env:set VITE_API_URL https://backend-url.com
netlify deploy --prod
```

---

## 📊 Hosting Comparison

### Frontend

| Platform | Cost | Deploy | Best For |
|----------|------|--------|----------|
| GitHub Pages | Free | Auto | Demo |
| Vercel | Free | CLI/Auto | Production |
| Netlify | Free | CLI/Auto | Production |

### Backend + Database

| Platform | Cost | Setup | Database |
|----------|------|-------|----------|
| Railway | $5-10/mo | ⭐⭐⭐⭐⭐ | Included |
| Render | Free tier | ⭐⭐⭐⭐ | Included |
| Fly.io | Free tier | ⭐⭐⭐ | Separate |

---

## ✅ Testing Checklist

### Demo Mode
- [ ] User registration works
- [ ] Data persists on refresh
- [ ] No network requests in DevTools
- [ ] Console shows "DEMO (localStorage)"

### Production Mode
- [ ] User registration hits backend
- [ ] Data in database
- [ ] Network requests in DevTools
- [ ] Console shows "PRODUCTION (Backend API)"

---

## 🎯 Recommended Setups

### Portfolio / Demo
- Frontend: GitHub Pages
- Backend: Not deployed
- **Cost: $0**

### Production App
- Frontend: Vercel
- Backend: Railway
- Database: Railway PostgreSQL
- **Cost: $5-10/month**

### Both Demo + Production
- Demo: GitHub Pages (localStorage)
- Production: Vercel + Railway
- **Cost: $5-10/month**

---

## 📚 Quick Commands

**Test demo:**
```bash
cd frontend && npm run dev
```

**Test with backend:**
```bash
cd backend && go run main.go     # Terminal 1
cd frontend && npm run dev        # Terminal 2
```

**Build for demo:**
```bash
cd frontend && npm run build
```

**Build for production:**
```bash
# Edit .env.production first!
cd frontend && npm run build
```

**Deploy to Railway:**
```bash
cd backend && railway up
```

**Deploy to Vercel:**
```bash
cd frontend && vercel --prod
```

---

**That's it!** Pick your deployment strategy and follow the steps above.

**Need help?** Check the [Troubleshooting](#5-troubleshooting) section.
