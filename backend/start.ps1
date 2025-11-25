# SenseAble Backend Startup Script for Windows
# This script ensures clean process termination

Write-Host "Starting SenseAble Backend..." -ForegroundColor Green

# Activate virtual environment
& ".\venv\Scripts\Activate.ps1"

# Function to cleanup on exit
function Cleanup {
    Write-Host "`nShutting down server..." -ForegroundColor Yellow
    Get-Process python -ErrorAction SilentlyContinue | Where-Object {
        $_.Path -like "*senseable*"
    } | Stop-Process -Force
    Write-Host "Server stopped." -ForegroundColor Green
}

# Register cleanup on Ctrl+C
Register-EngineEvent PowerShell.Exiting -Action { Cleanup }

try {
    # Start uvicorn
    python -m uvicorn app.main:app --reload --port 8000
}
finally {
    Cleanup
}
