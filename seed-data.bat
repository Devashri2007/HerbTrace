@echo off
title HerbTrace Database Seeder
cd /d "%~dp0server"
echo ====================================================
echo Seeding HerbTrace MongoDB Database with Demo Data...
echo ====================================================
node utils/seedData.js
pause
