@echo off
echo Starting all API microservices...
echo.

start "Auth API (5000)"    cmd /k "cd /d d:\Internship\Assignment_4\project_api\auth_api && python app.py"
start "Stats API (5001)"   cmd /k "cd /d d:\Internship\Assignment_4\project_api\stats_api && python app.py"
start "Charts API (5002)"  cmd /k "cd /d d:\Internship\Assignment_4\project_api\charts_api && python app.py"
start "Listing API (5003)" cmd /k "cd /d d:\Internship\Assignment_4\project_api\listing_api && python app.py"
start "Create API (5004)"  cmd /k "cd /d d:\Internship\Assignment_4\project_api\create_api && python app.py"

echo.
echo All services started!
echo   Auth    -^> http://localhost:5000
echo   Stats   -^> http://localhost:5001
echo   Charts  -^> http://localhost:5002
echo   Listing -^> http://localhost:5003
echo   Create  -^> http://localhost:5004
