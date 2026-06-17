$ErrorActionPreference = 'Stop'

Write-Host "Rebuilding SalesPie image and restarting the container..." -ForegroundColor Cyan

docker compose down
docker compose up --build -d

Write-Host "Active containers:" -ForegroundColor Cyan
docker compose ps

Write-Host "Latest backend logs:" -ForegroundColor Cyan
docker compose logs salespie --tail 50
