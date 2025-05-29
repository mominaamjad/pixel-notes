@echo off
REM Load SONAR_TOKEN from .env manually (since Windows CMD doesn't support auto-loading)

FOR /F "tokens=1,* delims==" %%A IN (.env.local) DO (
    IF "%%A"=="SONAR_TOKEN" SET SONAR_TOKEN=%%B
)

REM Run SonarScanner with the token
sonar-scanner -Dsonar.login=%SONAR_TOKEN%
