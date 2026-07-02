Write-Host "`n  Starting full stack (Frontend + APIs)...`n" -ForegroundColor Cyan

$base     = "d:\Internship\Assignment_4\project_api"
$frontend = "d:\Internship\Assignment_4\project"

# ─── Run migrations first ─────────────────────────────────────
Write-Host "  Running database migrations..." -ForegroundColor DarkYellow
Push-Location $base
python migrate.py
$migrateExit = $LASTEXITCODE
Pop-Location

if ($migrateExit -ne 0) {
    Write-Host "`n  [ERROR] Migrations failed. Fix the issue and try again.`n" -ForegroundColor Red
    exit 1
}
Write-Host "  Migrations complete!`n" -ForegroundColor Green

$services = @(
    @{ Name = "Auth API";    Port = 5000; Dir = "$base\auth_api" },
    @{ Name = "Stats API";   Port = 5001; Dir = "$base\stats_api" },
    @{ Name = "Charts API";  Port = 5002; Dir = "$base\charts_api" },
    @{ Name = "Listing API"; Port = 5003; Dir = "$base\listing_api" },
    @{ Name = "Create API";  Port = 5004; Dir = "$base\create_api" }
)

$jobs = @()
foreach ($svc in $services) {
    $job = Start-Job -Name $svc.Name -ScriptBlock {
        param($dir)
        Set-Location $dir
        python app.py 2>&1
    } -ArgumentList $svc.Dir

    $jobs += $job
    Write-Host "  [STARTED] $($svc.Name) -> http://localhost:$($svc.Port)" -ForegroundColor Green
}

# ─── Start Frontend (Vite React) ──────────────────────────────
$frontendJob = Start-Job -Name "Frontend" -ScriptBlock {
    param($dir)
    Set-Location $dir
    npm run dev 2>&1
} -ArgumentList $frontend

$jobs += $frontendJob
Write-Host "  [STARTED] Frontend  -> http://localhost:5173" -ForegroundColor White

Write-Host "`n  Full stack running! Press Ctrl+C to stop all.`n" -ForegroundColor Yellow
Write-Host "  Streaming logs below..." -ForegroundColor DarkGray
Write-Host "  ----------------------------------------" -ForegroundColor DarkGray

try {
    while ($true) {
        foreach ($job in $jobs) {
            Receive-Job -Job $job 2>&1 | ForEach-Object {
                $color = switch ($job.Name) {
                    "Auth API"    { "Blue" }
                    "Stats API"   { "Magenta" }
                    "Charts API"  { "Cyan" }
                    "Listing API" { "Yellow" }
                    "Create API"  { "Green" }
                    "Frontend"    { "White" }
                    default       { "DarkGray" }
                }
                Write-Host "  [$($job.Name)] $_" -ForegroundColor $color
            }
        }
        Start-Sleep -Milliseconds 500
    }
}
finally {
    Write-Host "`n  Stopping all services..." -ForegroundColor Red
    $jobs | Stop-Job -PassThru | Remove-Job
    Write-Host "  All services stopped.`n" -ForegroundColor Red
}
