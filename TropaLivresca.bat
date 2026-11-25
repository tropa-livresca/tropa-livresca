
@echo off
setlocal EnableExtensions

title Tropa Livresca

REM ==================================================
REM CONFIGURACOES
REM ==================================================

set "ROOT=%~dp0"

set "PB_EXE=%ROOT%pocketbase\pocketbase.exe"
set "PB_DATA=%ROOT%pocketbase\pb_data"

set "BACKEND_EXE=%ROOT%backend\build\Backend.exe"
set "BACKEND_ENV=%ROOT%backend\.env"

set "APP_URL=http://127.0.0.1:3000"

REM ==================================================
REM VARIAVEIS DE AMBIENTE
REM ==================================================

set "APP_ROOT=%ROOT%"
set "PORTABLE_MODE=true"
set "NODE_ENV=production"
set "HOST=127.0.0.1"
set "PORT=3000"

REM ==================================================
REM VALIDACOES
REM ==================================================

if not exist "%PB_EXE%" (
    echo ERRO: PocketBase nao encontrado.
    goto :ERRO
)

if not exist "%PB_DATA%\data.db" (
    echo ERRO: Banco de dados nao encontrado.
    goto :ERRO
)

if not exist "%BACKEND_EXE%" (
    echo ERRO: Backend.exe nao encontrado.
    goto :ERRO
)

if not exist "%BACKEND_ENV%" (
    echo ERRO: backend\.env nao encontrado.
    goto :ERRO
)

REM ==================================================
REM INICIALIZACAO
REM ==================================================

echo.
echo ==========================================
echo            TROPA LIVRESCA
echo ==========================================
echo.
echo Iniciando banco de dados...
echo.

start "Tropa Livresca - PocketBase" /B "%PB_EXE%" serve --http=127.0.0.1:8090 --dir="%PB_DATA%"

REM Aguarda o PocketBase responder
powershell -NoProfile -Command "$limite=(Get-Date).AddSeconds(30); do { try { $r=Invoke-WebRequest -UseBasicParsing 'http://127.0.0.1:8090/api/health' -TimeoutSec 2; if ($r.StatusCode -eq 200) { exit 0 } } catch {}; Start-Sleep -Milliseconds 500 } while ((Get-Date) -lt $limite); exit 1"

if errorlevel 1 (
    echo ERRO: PocketBase nao iniciou corretamente.
    goto :ERRO
)

echo PocketBase iniciado.
echo.
echo Iniciando aplicacao...

REM Inicia o backend
start "Tropa Livresca - Backend" /B "%BACKEND_EXE%"

REM Aguarda o backend responder
powershell -NoProfile -Command "$limite=(Get-Date).AddSeconds(30); do { try { $r=Invoke-WebRequest -UseBasicParsing 'http://127.0.0.1:3000' -TimeoutSec 2; if ($r.StatusCode -ge 200 -and $r.StatusCode -lt 500) { exit 0 } } catch {}; Start-Sleep -Milliseconds 500 } while ((Get-Date) -lt $limite); exit 1"

if errorlevel 1 (
    echo ERRO: Backend nao iniciou corretamente.
    goto :ENCERRAR
)

echo Aplicacao iniciada.
echo.
echo Abrindo navegador...

start "" "%APP_URL%"

echo.
echo ==========================================
echo A TROPA LIVRESCA ESTA EM EXECUCAO.
echo.
echo Pressione qualquer tecla para encerrar.
echo ==========================================
pause >nul

REM ==================================================
REM ENCERRAMENTO
REM ==================================================

:ENCERRAR

echo.
echo Encerrando aplicacao...

powershell -NoProfile -Command "$procs = Get-CimInstance Win32_Process | Where-Object { $_.Name -eq 'Backend.exe' -or ($_.Name -eq 'pocketbase.exe' -and $_.CommandLine -like '*127.0.0.1:8090*') }; foreach ($p in $procs) { Stop-Process -Id $p.ProcessId -Force -ErrorAction SilentlyContinue }"

echo Aplicacao encerrada.

endlocal
exit /b 0

:ERRO
echo.
echo Nao foi possivel iniciar a Tropa Livresca.
pause
endlocal
exit /b 1