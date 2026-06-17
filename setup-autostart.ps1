$ErrorActionPreference = "Stop"

$projectDir = "C:\Users\admin\SalesPie"
$taskName = "SalesPie Docker Autostart"

if (-not (Test-Path $projectDir)) {
    throw "Project path not found: $projectDir"
}

$action = New-ScheduledTaskAction `
    -Execute "powershell.exe" `
    -Argument "-NoProfile -WindowStyle Hidden -ExecutionPolicy Bypass -Command `"Set-Location '$projectDir'; docker compose up -d`""

$trigger = New-ScheduledTaskTrigger -AtLogOn
$principal = New-ScheduledTaskPrincipal -UserId $env:USERNAME -LogonType Interactive -RunLevel Highest
$settings = New-ScheduledTaskSettingsSet -StartWhenAvailable -AllowStartIfOnBatteries

Register-ScheduledTask `
    -TaskName $taskName `
    -Action $action `
    -Trigger $trigger `
    -Principal $principal `
    -Settings $settings `
    -Force | Out-Null

Write-Host "Scheduled task created/updated: $taskName" -ForegroundColor Green
Write-Host "Container will auto-start on logon using: docker compose up -d" -ForegroundColor Green
