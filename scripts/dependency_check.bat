@echo off
:: Change to Oreo app directory
cd /d "%~dp0../oreo_app"

echo 🔵 Checking environment...

:: Check if the directory change was successful
if not exist "%CD%/src/index.js" (
	echo !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
	echo !!! ❌ Error: "index.js" not found in path. !!!
	echo !!! Please check oreo_app directory.        !!!
	echo !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
	exit /b 1
)
if not exist "%CD%/src/index.js" (
	echo !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
	echo !!! ❌ Error: "secrets.js not found in path.             !!!
	echo !!! This file is required to be filled, at oreo_app/src. !!!
	echo !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
	exit /b 1
)
if not exist "%CD%/package.json" (
	echo !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
	echo !!! ❌ Error: "package.json" not found in path. !!!
	echo !!! Please check oreo_app directory.            !!!
	echo !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
	exit /b 1
)

:: Check if Node.js is installed
where node >nul 2>&1
if %ERRORLEVEL% neq 0 (
	echo !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
	echo !!! ❌ Error: Node.js not installed/not found in PATH.  !!!
	echo !!! Please install Node.js & add it to PATH.            !!!
	echo !!! https://nodejs.org/en/download/package-manager      !!!
	echo !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
	exit /b 1
)

echo ✔️ Check completed.