@echo off
echo ========================================
echo FIX BACKEND COMPILATION
echo ========================================

cd /d "%~dp0Website-b-n-qu-n-o-nam-ZMEN\ZMEN"

echo.
echo 1. Cleaning Maven project...
call mvn clean

echo.
echo 2. Compiling project...
call mvn compile

echo.
echo 3. Running tests...
call mvn test

echo.
echo 4. Building project...
call mvn package -DskipTests

echo.
echo ========================================
echo COMPILATION COMPLETE
echo ========================================
echo.
echo If successful, you can now run:
echo mvn spring-boot:run
echo.
pause
