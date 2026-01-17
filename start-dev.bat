@echo off
cd /d "D:\_Documents\Telechargement\erp-nettoyage-plus\backend"
start cmd /k "npm run start:dev"

timeout /t 5

cd /d "D:\_Documents\Telechargement\erp-nettoyage-plus\frontend"
start cmd /k "npm run dev"

echo.
echo Backend: http://localhost:3000
echo Frontend: http://localhost:5174
