@echo off
setlocal
cd /d "%~dp0"
set "JV_NODE=node"
if exist "%~dp0..\.site-tools\node.exe" set "JV_NODE=%~dp0..\.site-tools\node.exe"
if not exist "node_modules\next\dist\bin\next" (
  echo Please install Node.js 22 and run npm install in this folder first.
  pause
  exit /b 1
)
echo JV's Little World - http://127.0.0.1:5173
"%JV_NODE%" node_modules\next\dist\bin\next dev --hostname 127.0.0.1 --port 5173
