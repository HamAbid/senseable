# SenseAble - AI Accessibility Tool

SenseAble is an AI-powered application designed to help people with accessibility needs better understand text content. It provides intelligent text rephrasing, highlighting, and tagging features tailored to individual user preferences.

## Features

- **User Account Management**: Create personalized profiles with accessibility preferences
- **AI-Powered Text Rephrasing**: Rephrase complex text based on user needs
- **Smart Highlighting & Tagging**: Mark unfamiliar phrases and track learning progress
- **Multiple Versions**: Generate and compare different rephrased versions
- **Accessibility-First Design**: Color palettes for colorblindness, dyslexia support, and more
- **Personalized Suggestions**: Get alternative phrasings based on your familiarity level

## Technology Stack

### Frontend
- React 18 with TypeScript
- Vite (build tool)
- TailwindCSS (styling)
- React Router (navigation)
- Axios (API calls)

### Backend
- Python 3.10+
- FastAPI (web framework)
- SQLAlchemy (ORM)
- SQLite (database)
- OpenAI API (text rephrasing)

## Project Structure

```
senseable/
├── frontend/               # React frontend application
├── backend/               # FastAPI backend application
├── docs/                  # Documentation
└── screens/              # UI screenshots
```

## Getting Started

### Prerequisites
- Node.js 18+ and npm
- Python 3.10+
- OpenAI API key (optional, for AI features)

### Backend Setup

1. Navigate to backend directory and create virtual environment:
```bash
cd backend
python -m venv venv
venv\Scripts\activate  # Windows PowerShell
# source venv/bin/activate  # Linux/Mac/WSL
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Set up environment variables (copy `.env.example` to `.env` and configure)

4. Start server: `uvicorn app.main:app --reload --port 8000`

Note: SQLite database will be created automatically on first run.

Backend: http://localhost:8000 | API Docs: http://localhost:8000/docs

### Frontend Setup

**Important**: If using WSL, run frontend commands in Windows PowerShell (not WSL) to use Windows-installed Node.js.

1. Navigate to frontend directory (in Windows PowerShell):
```powershell
cd C:\Users\t-ha\projects\senseable\frontend
npm install
npm run dev
```

Or install Node.js in WSL:
```bash
# In WSL terminal
cd frontend
npm install
npm run dev
```

Frontend: http://localhost:3000

## Usage

1. **Create Account** with accessibility preferences
2. **Paste Text** you want to understand
3. **Rephrase** to get accessible version
4. **Highlight & Tag** unfamiliar phrases
5. **Get Suggestions** and compare versions

## Documentation

- See `docs/technical_design.md` for architecture details
- See `backend/README.md` for API documentation
- See `frontend/README.md` for frontend details

## Future Enhancements

- Graph database for tag relationships
- Browser extension
- Mobile app
- Voice input/output
- Multi-language support
