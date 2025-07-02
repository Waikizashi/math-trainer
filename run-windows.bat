@echo off
cd docker

REM Execute docker-compose up --build
docker-compose up --build

REM Change back to the original directory
cd %CURRENT_DIR%
