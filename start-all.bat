@echo off
title HerbTrace Launcher
echo ====================================================
echo Launching HerbTrace Full-Stack Platform...
echo ====================================================
start "HerbTrace Backend" cmd /c "%~dp0run-server.bat"
timeout /t 3 /nobreak >nul
start "HerbTrace Frontend" cmd /c "%~dp0run-client.bat"
echo.
echo HerbTrace services have been launched in separate windows!
echo Backend:  http://localhost:5000/api/health
echo Frontend: http://localhost:5173 or http://localhost:5174
echo ====================================================
