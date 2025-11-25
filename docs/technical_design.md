# SenseAble - Technical Design Document

## Project Overview
SenseAble is an AI-powered accessibility tool that helps users rephrase text content with personalized suggestions based on their accessibility needs and familiarity preferences.

## Architecture

### High-Level Architecture
```
Frontend (React + TypeScript) 
    ↕ HTTP/REST
Backend (FastAPI + Python)
    ↕
├─ OpenAI/Claude API (Text Rephrasing)
├─ SQLite Database (User Data, Preferences, Tags)
└─ Future: Graph DB (Tag Relationships)
```

## Technology Stack

### Frontend
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: TailwindCSS
- **Routing**: React Router v6
- **HTTP Client**: Axios
- **State Management**: React Context API / useState
- **UI Components**: Custom components with accessibility features

### Backend
- **Framework**: FastAPI (Python 3.10+)
- **Database**: SQLite 3
- **ORM**: SQLAlchemy
- **Authentication**: JWT tokens
- **AI Integration**: OpenAI API (with Claude as alternative)
- **Environment**: python-dotenv for configuration

## Database Schema

### Users Table
```sql
CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### User Preferences Table
```sql
CREATE TABLE user_preferences (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    accessibility_need VARCHAR(100),
    reading_level VARCHAR(50),
    preferred_complexity VARCHAR(50),
    color_palette JSON,
    other_preferences JSON,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

### Tags Table
```sql
CREATE TABLE tags (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    phrase TEXT NOT NULL,
    familiarity_level VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

### Rephrase History Table
```sql
CREATE TABLE rephrase_history (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    original_text TEXT NOT NULL,
    rephrased_text TEXT NOT NULL,
    version INTEGER DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

## API Endpoints

### User Management
- `POST /api/users/register` - Create new user account
- `POST /api/users/login` - Authenticate user
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `GET /api/users/preferences` - Get user preferences
- `PUT /api/users/preferences` - Update user preferences

### Text Rephrasing
- `POST /api/rephrase` - Rephrase text based on user preferences
  - Request: `{ "text": string, "user_id": int, "preferences": object }`
  - Response: `{ "rephrased_text": string, "suggestions": array, "version": int }`
- `POST /api/rephrase/regenerate` - Generate new version of rephrased text
- `GET /api/rephrase/history/{user_id}` - Get rephrase history

### Tag Management
- `POST /api/tags` - Create new tag for a phrase
  - Request: `{ "phrase": string, "familiarity_level": string, "user_id": int }`
- `GET /api/tags/{user_id}` - Get all tags for a user
- `PUT /api/tags/{tag_id}` - Update tag
- `DELETE /api/tags/{tag_id}` - Delete tag
- `GET /api/tags/suggestions/{phrase}` - Get rephrase suggestions for tagged phrase

## Frontend Component Structure

```
src/
├── components/
│   ├── UserAccount/
│   │   ├── UserAccountForm.tsx       # Main form component
│   │   ├── PersonalInfo.tsx          # Personal details section
│   │   ├── AccessibilityNeeds.tsx    # Accessibility preferences section
│   │   └── ColorPalette.tsx          # Color scheme selector
│   ├── RephraseText/
│   │   ├── TextEditor.tsx            # Main text input/display area
│   │   ├── HighlightedText.tsx       # Text with highlighting
│   │   ├── TaggingPanel.tsx          # Tag selection interface
│   │   ├── SuggestionsPanel.tsx      # Right panel with suggestions
│   │   ├── TagList.tsx               # Shows tags and versions (subsection 1)
│   │   ├── AboutYou.tsx              # User profile summary (subsection 2)
│   │   └── VersionHistory.tsx        # Multiple rephrase versions
│   └── Common/
│       ├── Header.tsx
│       ├── Button.tsx
│       └── Modal.tsx
├── pages/
│   ├── UserAccountPage.tsx
│   └── RephraseTextPage.tsx
├── services/
│   ├── api.ts                        # Axios instance and base config
│   ├── userService.ts                # User API calls
│   ├── rephraseService.ts            # Rephrase API calls
│   └── tagService.ts                 # Tag API calls
├── context/
│   └── UserContext.tsx               # Global user state
├── types/
│   └── index.ts                      # TypeScript interfaces
├── utils/
│   ├── colorPalettes.ts              # Accessibility color schemes
│   └── textUtils.ts                  # Text processing utilities
├── App.tsx
└── main.tsx
```

## Backend Project Structure

```
backend/
├── app/
│   ├── main.py                       # FastAPI app initialization
│   ├── config.py                     # Configuration settings
│   ├── database.py                   # Database connection
│   ├── models/
│   │   ├── __init__.py
│   │   ├── user.py
│   │   ├── preference.py
│   │   ├── tag.py
│   │   └── rephrase.py
│   ├── schemas/
│   │   ├── __init__.py
│   │   ├── user.py                   # Pydantic schemas
│   │   ├── preference.py
│   │   ├── tag.py
│   │   └── rephrase.py
│   ├── routers/
│   │   ├── __init__.py
│   │   ├── users.py
│   │   ├── rephrase.py
│   │   └── tags.py
│   ├── services/
│   │   ├── __init__.py
│   │   ├── ai_service.py             # OpenAI/Claude integration
│   │   ├── user_service.py
│   │   └── tag_service.py
│   └── utils/
│       ├── __init__.py
│       ├── auth.py                   # JWT utilities
│       └── helpers.py
├── requirements.txt
├── .env.example
└── README.md
```

## Key Features Implementation

### 1. Text Highlighting
- Frontend: Use contenteditable div or custom text renderer
- Store highlighted ranges with start/end positions
- Apply CSS classes based on tag types

### 2. Tagging System
- Click on highlighted text to add/modify tags
- Dropdown for familiarity levels
- Color-coded based on user's accessibility needs
- Tag data sent to backend for storage

### 3. AI Rephrasing
- Send original text + user preferences to backend
- Backend constructs prompt based on:
  - User's accessibility needs
  - Reading level preference
  - Tagged phrases with familiarity levels
- OpenAI/Claude returns rephrased version
- Multiple versions can be generated

### 4. Suggestions Panel
- Shows alternative phrasings for selected text
- Lists all tags with their versions
- Displays user profile (editable)

### 5. Accessibility Features
- Colorblind-friendly palettes (deuteranopia, protanopia, tritanopia)
- High contrast mode
- Adjustable font sizes
- Screen reader compatible

## Color Palettes for Accessibility

```typescript
const colorPalettes = {
  default: {
    'not-familiar': '#FF6B6B',
    'somewhat-familiar': '#FFD93D',
    'familiar': '#6BCF7F'
  },
  colorblind: {
    'not-familiar': '#0173B2',
    'somewhat-familiar': '#DE8F05',
    'familiar': '#029E73'
  },
  highContrast: {
    'not-familiar': '#000000',
    'somewhat-familiar': '#555555',
    'familiar': '#AAAAAA'
  }
};
```

## AI Prompt Engineering

### Example Prompt Structure
```
You are an AI assistant helping users with accessibility needs to understand text better.

User Profile:
- Accessibility Need: {accessibility_need}
- Reading Level: {reading_level}
- Preferred Complexity: {preferred_complexity}

Tagged Phrases (phrases the user is not familiar with):
{list_of_tagged_phrases}

Original Text:
{original_text}

Please rephrase this text to be more accessible, considering:
1. Replace or explain phrases tagged as "not familiar"
2. Maintain the core meaning
3. Adjust complexity to {preferred_complexity} level
4. Keep the text clear and concise

Return only the rephrased text.
```

## Development Phases

### Phase 1: Design & Planning ✓
- Create technical design document
- Define database schema
- Plan API endpoints

### Phase 2: Frontend Development
1. Set up React + TypeScript project
2. Implement UserAccount page (screen 01)
3. Implement RephraseText page (screens 02-05)
4. Add routing and navigation
5. Style with TailwindCSS

### Phase 3: Backend Development
1. Set up FastAPI project structure
2. Configure MySQL database
3. Implement user management endpoints
4. Implement rephrasing endpoints with AI integration
5. Implement tag management endpoints
6. Add authentication

### Phase 4: Integration & Testing
1. Connect frontend to backend
2. Test all user flows
3. Handle error cases
4. Add loading states

## Environment Variables

### Frontend (.env)
```
VITE_API_BASE_URL=http://localhost:8000
```

### Backend (.env)
```
DATABASE_URL=sqlite:///./senseable.db
OPENAI_API_KEY=your_openai_key
CLAUDE_API_KEY=your_claude_key (optional)
JWT_SECRET_KEY=your_secret_key
JWT_ALGORITHM=HS256
JWT_EXPIRATION_MINUTES=1440
```

## Future Enhancements
1. Graph database integration for tag relationships
2. Collaborative features
3. Export to various formats
4. Browser extension
5. Mobile app
6. Voice input/output
7. Multi-language support
