@echo off
title vibecheck.ai - Localhost Launcher
echo ===================================================
echo        Starting vibecheck.ai (Localhost)
echo ===================================================
echo.

cd /d "%~dp0"

echo [1/2] Starting FastAPI Backend on http://127.0.0.1:8000 ...
start "vibecheck-backend" cmd /k "cd /d "%~dp0backend" && .\venv\Scripts\activate && python -m uvicorn main:app --host 127.0.0.1 --port 8000 --reload"

timeout /t 2 >nul

echo [2/2] Starting Vite Frontend on http://localhost:5173 ...
start "vibecheck-frontend" cmd /k "cd /d "%~dp0frontend" && npm run dev"

timeout /t 3 >nul

echo.
echo Opening vibecheck.ai in your default browser...
start http://localhost:5173

echo.
echo ===================================================
echo  vibecheck.ai is running!
echo  - Frontend: http://localhost:5173
echo  - Backend API: http://127.0.0.1:8000/docs
echo ===================================================
echo Keep the two black command windows open while using the app.
pause
