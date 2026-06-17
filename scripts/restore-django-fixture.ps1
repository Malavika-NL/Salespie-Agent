param(
    [Parameter(Mandatory = $true)]
    [string]$FixturePath,

    [switch]$Flush
)

$ErrorActionPreference = 'Stop'

$Root = Split-Path -Parent $PSScriptRoot
$ResolvedFixture = Resolve-Path -LiteralPath $FixturePath
$ContainerFixture = "/tmp/" + [System.IO.Path]::GetFileName($ResolvedFixture.Path)

Set-Location $Root

Write-Host "Starting Docker services..." -ForegroundColor Cyan
docker compose up -d db salespie

if ($Flush) {
    Write-Host "Creating safety backup before flushing current PostgreSQL data..." -ForegroundColor Cyan
    & "$PSScriptRoot\backup-postgres.ps1"

    Write-Host "Flushing current Django database..." -ForegroundColor Yellow
    docker compose exec -T salespie python manage.py flush --noinput
}

Write-Host "Copying fixture to app container: $ContainerFixture" -ForegroundColor Cyan
docker compose cp $ResolvedFixture.Path "salespie:$ContainerFixture"

Write-Host "Loading fixture into PostgreSQL..." -ForegroundColor Cyan
docker compose exec -T salespie python manage.py loaddata $ContainerFixture

Write-Host "Restarting app container..." -ForegroundColor Cyan
docker compose restart salespie

Write-Host "Restore complete" -ForegroundColor Green
