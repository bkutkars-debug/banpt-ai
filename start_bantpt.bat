@echo off
title BantPT AI Super Launcher
color 0C
echo =======================================================================
echo              STARTING BANTPT AI UNIFIED PLATFORM
echo =======================================================================
echo.

echo [1/2] Starting BantPT AI Multi-Agent Backend (Port 8080)...
cd /d "C:\Users\bkutk\.gemini\antigravity\scratch\bantpt-ai\backend"
start "BantPT AI Backend" /min cmd /k "python run_server.py"

echo [2/2] Starting BantPT AI Unified Frontend (Port 3000)...
cd /d "C:\Users\bkutk\.gemini\antigravity\scratch\bantpt-ai\frontend"
start "BantPT AI Frontend" /min cmd /k "npm run dev -- --port 3000 --host"

timeout /t 3 /nobreak >nul

echo.
echo =======================================================================
echo             BANTPT AI UNIFIED PLATFORM IS RUNNING!
echo =======================================================================
echo  - This Computer:  http://localhost:3000
echo  - Phone / Wi-Fi:  http://10.122.23.130:3000
echo =======================================================================
echo.
echo Launching your browser now...
start http://localhost:3000