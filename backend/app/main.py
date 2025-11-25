from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .database import Base, engine
from .routers import users, tags, rephrase

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="SenseAble API",
    description="AI-powered accessibility tool for text rephrasing",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(users.router)
app.include_router(tags.router)
app.include_router(rephrase.router)

@app.get("/")
def root():
    return {
        "message": "Welcome to SenseAble API",
        "docs": "/docs",
        "version": "1.0.0"
    }

@app.get("/health")
def health_check():
    return {"status": "healthy"}
