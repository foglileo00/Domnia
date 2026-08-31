@echo off
REM Avvia un server locale nella cartella del sito e apre il browser.
REM Serve perche' YouTube non funziona se apri index.html col doppio clic (file://).
cd /d "%~dp0"
start "" http://localhost:8000
python -m http.server 8000
