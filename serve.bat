@echo off
echo.
echo  Lancement du serveur Castorama Dashboard...
echo  Ouvrez votre navigateur sur : http://localhost:3000/dashboard.html
echo  (Ctrl+C pour arreter)
echo.
python -m http.server 3000
pause
