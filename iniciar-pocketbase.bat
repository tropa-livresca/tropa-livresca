
@echo off
setlocal

title Tropa Livresca - PocketBase

REM Diretorio raiz do projeto
set "ROOT=%~dp0"

REM Caminhos do PocketBase
set "PB_EXE=%ROOT%pocketbase\pocketbase.exe"
set "PB_DATA=%ROOT%pocketbase\pb_data"

REM Verifica se o executavel existe
if not exist "%PB_EXE%" (
    echo ERRO: pocketbase.exe nao encontrado.
    echo Caminho esperado: %PB_EXE%
    pause
    exit /b 1
)

REM Verifica se o banco existente esta presente
if not exist "%PB_DATA%\data.db" (
    echo ERRO: data.db nao encontrado.
    echo Caminho esperado: %PB_DATA%
    pause
    exit /b 1
)

echo.
echo ========================================
echo       TROPA LIVRESCA - POCKETBASE
echo ========================================
echo.
echo Banco de dados:
echo %PB_DATA%
echo.
echo Iniciando PocketBase na porta 8090...
echo.
echo Para encerrar, pressione Ctrl+C.
echo.

REM Inicia usando explicitamente o banco existente
"%PB_EXE%" serve --http=127.0.0.1:8090 --dir="%PB_DATA%"

set "EXIT_CODE=%ERRORLEVEL%"

echo.
echo PocketBase encerrado.
echo Codigo de saida: %EXIT_CODE%

pause

exit /b %EXIT_CODE%
