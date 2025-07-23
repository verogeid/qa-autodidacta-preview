@echo on
setlocal
cd /d "%~dp0"
node node_modules\serve\build\main.js -l 3000
pause

index.html
