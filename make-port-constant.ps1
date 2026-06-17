$ErrorActionPreference = "Stop"

$projectDir = "C:\Users\admin\SalesPie"
$targetIp = "192.168.1.44"
$prefixLength = 24
$taskName = "SalesPie Startup"
$startupScript = Join-Path $projectDir "start-salespie.ps1"

if (-not (Test-Path $startupScript)) {
    throw "Missing startup script: $startupScript"
}

# Pick active interface using default route.
$defaultRoute = Get-NetRoute -DestinationPrefix "0.0.0.0/0" |
    Sort-Object RouteMetric, ifMetric |
    Select-Object -First 1

if (-not $defaultRoute) {
    throw "No default route found. Connect to network and retry."
}

$iface = Get-NetIPConfiguration -InterfaceIndex $defaultRoute.InterfaceIndex
$alias = $iface.InterfaceAlias
$gateway = $iface.IPv4DefaultGateway.NextHop
$dnsServers = (Get-DnsClientServerAddress -InterfaceIndex $defaultRoute.InterfaceIndex -AddressFamily IPv4).ServerAddresses

if (-not $gateway) {
    throw "No IPv4 gateway found on active adapter."
}

if (-not $dnsServers -or $dnsServers.Count -eq 0) {
    $dnsServers = @("8.8.8.8", "1.1.1.1")
}

Write-Host "Configuring static IP on adapter: $alias" -ForegroundColor Cyan
Write-Host "IP: $targetIp/$prefixLength Gateway: $gateway DNS: $($dnsServers -join ', ')" -ForegroundColor Cyan

 $existingTargetIp = Get-NetIPAddress -InterfaceIndex $defaultRoute.InterfaceIndex -AddressFamily IPv4 -ErrorAction SilentlyContinue |
    Where-Object { $_.IPAddress -eq $targetIp } |
    Select-Object -First 1

if (-not $existingTargetIp) {
    # Remove existing IPv4 addresses on this adapter (except loopback link-local)
    Get-NetIPAddress -InterfaceIndex $defaultRoute.InterfaceIndex -AddressFamily IPv4 -ErrorAction SilentlyContinue |
        Where-Object { $_.IPAddress -notlike "169.254.*" } |
        ForEach-Object {
            Remove-NetIPAddress -InterfaceIndex $defaultRoute.InterfaceIndex -IPAddress $_.IPAddress -Confirm:$false -ErrorAction SilentlyContinue
        }

    New-NetIPAddress -InterfaceIndex $defaultRoute.InterfaceIndex -IPAddress $targetIp -PrefixLength $prefixLength -DefaultGateway $gateway -AddressFamily IPv4
} else {
    Write-Host "Target IP already configured on adapter. Reusing existing address." -ForegroundColor Yellow
}
try {
    Set-DnsClientServerAddress -InterfaceIndex $defaultRoute.InterfaceIndex -ServerAddresses $dnsServers
} catch {
    Write-Host "DNS update skipped due permission policy. Continuing..." -ForegroundColor Yellow
}

Write-Host "Creating/updating startup task: $taskName" -ForegroundColor Cyan

$action = New-ScheduledTaskAction -Execute "powershell.exe" -Argument "-NoProfile -ExecutionPolicy Bypass -File `"$startupScript`""
$trigger = New-ScheduledTaskTrigger -AtStartup
$principal = New-ScheduledTaskPrincipal -UserId "SYSTEM" -RunLevel Highest -LogonType ServiceAccount
$settings = New-ScheduledTaskSettingsSet -StartWhenAvailable -ExecutionTimeLimit (New-TimeSpan -Minutes 30) -AllowStartIfOnBatteries

Register-ScheduledTask -TaskName $taskName -Action $action -Trigger $trigger -Principal $principal -Settings $settings -Force | Out-Null

Write-Host "Running startup script once now..." -ForegroundColor Cyan
powershell -NoProfile -ExecutionPolicy Bypass -File $startupScript

Write-Host ""
Write-Host "Done. Project is pinned to http://192.168.1.44:8001 on this machine." -ForegroundColor Green
Write-Host "If router DHCP changes this host identity, set router DHCP reservation for this PC MAC to 192.168.1.44." -ForegroundColor Yellow
