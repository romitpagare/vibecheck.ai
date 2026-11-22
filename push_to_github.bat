@echo off
title Push vibecheck.ai to GitHub
cd /d "C:\Users\ritikapandav\OneDrive\Desktop\romit"
echo ========================================================
echo   Pushing vibecheck.ai to https://github.com/romitpagare/vibecheck.ai
echo ========================================================
echo.
git push origin main
echo.
if %ERRORLEVEL% EQU 0 (
    echo ========================================================
    echo   SUCCESS! All files uploaded to GitHub successfully.
    echo ========================================================
) else (
    echo ========================================================
    echo   Push failed or was cancelled.
    echo ========================================================
)
echo.
pause
