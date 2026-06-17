$ErrorActionPreference = 'Stop'

$Root = Split-Path -Parent $PSScriptRoot
$BackupDir = Join-Path $Root 'backups'
$LogDir = Join-Path $Root 'logs'
$LogFile = Join-Path $LogDir 'backup-postgres.log'
$CloudBackupDir = 'G:\My Drive\SalesPie Backups'
$Timestamp = Get-Date -Format 'yyyy-MM-dd_HH-mm-ss'
$BackupFile = Join-Path $BackupDir "salespie_postgres_$Timestamp.sql.gz"
$RetentionDays = if ($env:BACKUP_RETENTION_DAYS) { [int]$env:BACKUP_RETENTION_DAYS } else { 0 }

New-Item -ItemType Directory -Force -Path $BackupDir | Out-Null
New-Item -ItemType Directory -Force -Path $LogDir | Out-Null

function Write-BackupLog {
    param([string]$Message)
    $line = "$(Get-Date -Format 'yyyy-MM-dd HH:mm:ss') $Message"
    Add-Content -Path $LogFile -Value $line
    Write-Host $Message
}

Write-BackupLog "Creating PostgreSQL backup at $BackupFile"

$processInfo = New-Object System.Diagnostics.ProcessStartInfo
$processInfo.FileName = 'docker'
$processInfo.Arguments = 'compose exec -T db sh -lc "pg_dump -U salespie -d salescrm | gzip -c"'
$processInfo.RedirectStandardOutput = $true
$processInfo.RedirectStandardError = $true
$processInfo.UseShellExecute = $false

$process = [System.Diagnostics.Process]::Start($processInfo)
$output = [System.IO.File]::Open($BackupFile, [System.IO.FileMode]::Create, [System.IO.FileAccess]::Write)

try {
    $process.StandardOutput.BaseStream.CopyTo($output)
}
finally {
    $output.Dispose()
}

$stderr = $process.StandardError.ReadToEnd()
$process.WaitForExit()

if ($process.ExitCode -ne 0) {
    Remove-Item -Force $BackupFile -ErrorAction SilentlyContinue
    throw "Backup command failed. $stderr"
}

$BackupSize = (Get-Item -LiteralPath $BackupFile).Length
if ($BackupSize -lt 1024) {
    throw "Backup file is too small and may be invalid: $BackupFile ($BackupSize bytes)"
}

docker compose cp $BackupFile "db:/tmp/salespie_backup_verify.sql.gz" | Out-Null
docker compose exec -T db sh -lc "gunzip -t /tmp/salespie_backup_verify.sql.gz"
if (-not $?) {
    throw "Backup gzip verification failed: $BackupFile"
}

if ($RetentionDays -gt 0) {
    Get-ChildItem $BackupDir -Filter 'salespie_postgres_*.sql.gz' -File |
        Where-Object { $_.LastWriteTime -lt (Get-Date).AddDays(-$RetentionDays) } |
        Remove-Item -Force

    Write-BackupLog "Deleted backups older than $RetentionDays days"
}
else {
    Write-BackupLog "Retention disabled; keeping all backups"
}

if (Test-Path 'G:\My Drive') {
    New-Item -ItemType Directory -Force -Path $CloudBackupDir | Out-Null
    Copy-Item -LiteralPath $BackupFile -Destination $CloudBackupDir -Force
    Write-BackupLog "Copied backup to Google Drive: $CloudBackupDir"
}
else {
    Write-BackupLog "Google Drive folder not found; cloud copy skipped: $CloudBackupDir"
}

Write-BackupLog "Backup complete: $BackupFile ($BackupSize bytes)"
