$ErrorActionPreference = 'Stop'

$Root = Split-Path -Parent $PSScriptRoot
Set-Location $Root

Write-Host "Creating safety backup before production deploy..." -ForegroundColor Cyan
& "$PSScriptRoot\backup-postgres.ps1"

Write-Host "Building and restarting hosted production..." -ForegroundColor Cyan
docker compose up -d --build

Write-Host "Production deploy complete: http://192.168.1.94:8001" -ForegroundColor Green
