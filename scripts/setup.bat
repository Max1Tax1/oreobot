@echo off
:: Change to current directory and perform check
cd /d "%~dp0"
call dependency_check.bat

:: Install dependencies
echo 🔵 Installing/Updating dependencies...
call npm install
echo ✔️ Dependencies up to date.