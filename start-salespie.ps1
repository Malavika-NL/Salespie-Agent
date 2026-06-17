$ErrorActionPreference = "Stop"

$projectDir = "C:\Users\admin\SalesPie"
$dockerDesktop = "C:\Program Files\Docker\Docker\Docker Desktop.exe"

Set-Location $projectDir

try {
    Start-Service com.docker.service -ErrorAction SilentlyContinue
} catch {
}

if (Test-Path $dockerDesktop) {
    $alreadyRunning = Get-Process -Name "Docker Desktop" -ErrorAction SilentlyContinue
    if (-not $alreadyRunning) {
        Start-Process -FilePath $dockerDesktop -WindowStyle Hidden
    }
}

$maxAttempts = 60
for ($i = 0; $i -lt $maxAttempts; $i++) {
    try {
        docker info | Out-Null
        break
    } catch {
        Start-Sleep -Seconds 5
    }
}

docker compose up -d
