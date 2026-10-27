@echo off
title Push Pulse to GitHub
cd /d "C:\Users\Yash Gaurav\Desktop\SHADOWFAX\pulse"
echo ====================================================================
echo Pushing Pulse Platform to GitHub (yashgaurav1/orgpulse)...
echo ====================================================================
echo.
"C:\Program Files\Git\cmd\git.exe" push -u origin main
echo.
if %ERRORLEVEL% equ 0 (
    echo ====================================================================
    echo SUCCESS: Your files are now uploaded to GitHub!
    echo Check: https://github.com/yashgaurav1/orgpulse
    echo ====================================================================
) else (
    echo ====================================================================
    echo Something went wrong or waiting on authorization.
    echo ====================================================================
)
echo.
pause
