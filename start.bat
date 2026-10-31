@echo off
setlocal
cd /d "%~dp0"

where py >nul 2>nul
if %errorlevel%==0 (
  start "E-Portfolio Server" cmd /k "py -m http.server 5500"
  goto ready
)

where python >nul 2>nul
if %errorlevel%==0 (
  start "E-Portfolio Server" cmd /k "python -m http.server 5500"
  goto ready
)

echo.
echo Python tidak ditemukan.
echo Instal Python dari https://www.python.org/downloads/ dan centang "Add python.exe to PATH".
echo Atau jalankan secara manual dengan Node.js: npx serve -l 5500
echo.
pause
exit /b 1

:ready
timeout /t 2 /nobreak >nul
start "" "http://localhost:5500/"
echo.
echo Server berjalan di http://localhost:5500
echo Halaman admin: http://localhost:5500/admin.html
echo Tutup jendela "E-Portfolio Server" untuk menghentikan server.
echo.
endlocal
