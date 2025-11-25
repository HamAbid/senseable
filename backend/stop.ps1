# Stop SenseAble Backend
Write-Host "Stopping SenseAble Backend..." -ForegroundColor Yellow

# Kill all Python processes in this directory
Get-Process python -ErrorAction SilentlyContinue | Where-Object {
    $_.Path -like "*senseable*"
} | ForEach-Object {
    Write-Host "Killing process $($_.Id)..." -ForegroundColor Red
    Stop-Process -Id $_.Id -Force
}

# Also kill uvicorn by port
$connections = netstat -ano | Select-String ":8000.*LISTENING"
if ($connections) {
    $connections | ForEach-Object {
        $processId = $_.ToString().Split()[-1]
        Write-Host "Killing process on port 8000 (PID: $processId)..." -ForegroundColor Red
        Stop-Process -Id $processId -Force -ErrorAction SilentlyContinue
    }
}

Write-Host "Backend stopped." -ForegroundColor Green
