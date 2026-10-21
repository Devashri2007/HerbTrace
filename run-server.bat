@echo off
title HerbTrace Backend Server
cd /d "%~dp0server"
echo ====================================================
echo Starting HerbTrace Backend API Server on Port 5000...
echo ====================================================
node server.js
pause
