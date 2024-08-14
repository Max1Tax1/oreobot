@echo off
:: Change to current directory and perform check
cd /d "%~dp0"
call dependency_check.bat

:: Run the node script
:loop
call npm start
echo !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
echo !!! Oreo crashed, restarting... !!!
echo !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
goto loop