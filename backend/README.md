# SenseAble Backend

FastAPI backend for the SenseAble accessibility tool.

## Setup

1. Create a virtual environment:
```bash
python -m venv venv
```

2. Activate the virtual environment:
```bash
# Windows
venv\Scripts\activate

# Linux/Mac
source venv/bin/activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Set up environment variables:
```bash
cp .env.example .env
```

Edit `.env` and add your:
- OpenAI API key (optional)
- Claude API key (optional)
- JWT secret key

Note: SQLite database will be created automatically on first run.

5. Run the application:
```bash
uvicorn app.main:app --reload --port 8000
```

## API Documentation

Once running, visit:
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## API Endpoints

### Users
- `POST /api/users/register` - Register new user
- `POST /api/users/login` - Login user
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `GET /api/users/preferences` - Get user preferences
- `PUT /api/users/preferences` - Update user preferences

### Tags
- `POST /api/tags` - Create tag
- `GET /api/tags/{user_id}` - Get user tags
- `PUT /api/tags/{tag_id}` - Update tag
- `DELETE /api/tags/{tag_id}` - Delete tag
- `GET /api/tags/suggestions/{phrase}` - Get suggestions

### Rephrase
- `POST /api/rephrase` - Rephrase text
- `POST /api/rephrase/regenerate` - Regenerate rephrase
- `GET /api/rephrase/history/{user_id}` - Get history

## Database Schema

The application uses SQLite with the following tables:
- `users` - User accounts
- `user_preferences` - User accessibility preferences
- `tags` - Tagged phrases with familiarity levels
- `rephrase_history` - History of rephrased texts

The database file (`senseable.db`) is created automatically on first run.

## AI Integration

The application uses OpenAI's GPT-3.5 for text rephrasing. If no API key is provided, it falls back to mock responses for testing.
