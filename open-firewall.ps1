# Script untuk membuka firewall Windows
# Jalankan sebagai Administrator: Right-click → Run as Administrator

Write-Host "========================================" -ForegroundColor Cyan
Write-Host " S7S Digital Signage - Firewall Setup" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if running as Administrator
$isAdmin = ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)

if (-not $isAdmin) {
    Write-Host "ERROR: Script ini harus dijalankan sebagai Administrator!" -ForegroundColor Red
    Write-Host ""
    Write-Host "Cara menjalankan:" -ForegroundColor Yellow
    Write-Host "1. Right-click pada file open-firewall.ps1" -ForegroundColor Yellow
    Write-Host "2. Pilih 'Run with PowerShell' atau 'Run as Administrator'" -ForegroundColor Yellow
    Write-Host ""
    pause
    exit
}

Write-Host "Membuka port firewall untuk S7S Digital Signage..." -ForegroundColor Green
Write-Host ""

# Hapus rule lama jika ada
Remove-NetFirewallRule -DisplayName "S7S Backend API" -ErrorAction SilentlyContinue
Remove-NetFirewallRule -DisplayName "S7S Admin Panel" -ErrorAction SilentlyContinue
Remove-NetFirewallRule -DisplayName "S7S Web Player" -ErrorAction SilentlyContinue

# Buat rule baru
Write-Host "[1/3] Membuka port 3001 (Backend API)..." -ForegroundColor Yellow
New-NetFirewallRule -DisplayName "S7S Backend API" -Direction Inbound -LocalPort 3001 -Protocol TCP -Action Allow | Out-Null

Write-Host "[2/3] Membuka port 3000 (Admin Panel)..." -ForegroundColor Yellow
New-NetFirewallRule -DisplayName "S7S Admin Panel" -Direction Inbound -LocalPort 3000 -Protocol TCP -Action Allow | Out-Null

Write-Host "[3/3] Membuka port 3002 (Web Player)..." -ForegroundColor Yellow
New-NetFirewallRule -DisplayName "S7S Web Player" -Direction Inbound -LocalPort 3002 -Protocol TCP -Action Allow | Out-Null

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host " Firewall berhasil dikonfigurasi!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""

# Tampilkan IP Address
Write-Host "IP Address komputer ini:" -ForegroundColor Cyan
$ip = (Get-NetIPAddress -AddressFamily IPv4 | Where-Object { $_.InterfaceAlias -like "*Wi-Fi*" -or $_.InterfaceAlias -like "*Ethernet*" }).IPAddress
foreach ($addr in $ip) {
    if ($addr -ne "127.0.0.1") {
        Write-Host "  $addr" -ForegroundColor White
    }
}

Write-Host ""
Write-Host "Port yang dibuka:" -ForegroundColor Cyan
Write-Host "  3001 - Backend API" -ForegroundColor White
Write-Host "  3000 - Admin Panel" -ForegroundColor White
Write-Host "  3002 - Web Player" -ForegroundColor White
Write-Host ""
Write-Host "Sekarang Anda bisa menjalankan: start-lan.bat" -ForegroundColor Yellow
Write-Host ""
pause
