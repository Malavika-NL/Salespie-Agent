param(
    [string]$Time = "02:00",
    [string]$TaskName = "SalesPie Daily PostgreSQL Backup"
)

$ErrorActionPreference = 'Stop'

$Root = Split-Path -Parent $PSScriptRoot
$BackupScript = Join-Path $PSScriptRoot "backup-postgres.ps1"

if (-not (Test-Path -LiteralPath $BackupScript)) {
    throw "Backup script not found: $BackupScript"
}

$Action = New-ScheduledTaskAction `
    -Execute "powershell.exe" `
    -Argument "-NoProfile -ExecutionPolicy Bypass -File `"$BackupScript`"" `
    -WorkingDirectory $Root

$Trigger = New-ScheduledTaskTrigger -Daily -At $Time
$Settings = New-ScheduledTaskSettingsSet `
    -AllowStartIfOnBatteries `
    -DontStopIfGoingOnBatteries `
    -StartWhenAvailable `
    -ExecutionTimeLimit (New-TimeSpan -Hours 2)

Register-ScheduledTask `
    -TaskName $TaskName `
    -Action $Action `
    -Trigger $Trigger `
    -Settings $Settings `
    -Description "Creates a daily compressed PostgreSQL backup for SalesPie customer data." `
    -Force | Out-Null

Write-Host "Installed daily backup task: $TaskName" -ForegroundColor Green
Write-Host "Schedule: every day at $Time" -ForegroundColor Green
Write-Host "Backup folder: $(Join-Path $Root 'backups')" -ForegroundColor Green
