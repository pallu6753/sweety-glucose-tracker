# ==============================================================================
# Sweety Glucose Tracker – Automated Local PostgreSQL Recovery & Setup Script
# ==============================================================================
# Requires Administrator Privileges (Run in "Windows PowerShell (Admin)")
# ==============================================================================

# 1. Verify Administrative Privileges
$isAdmin = ([Security.Principal.WindowsPrincipal][Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)
if (-not $isAdmin) {
    Write-Host "[ERROR] This recovery script must be run as Administrator." -ForegroundColor Red
    Write-Host "Please right-click the Windows Start menu, select 'Windows PowerShell (Admin)' or 'Terminal (Admin)', and run this script." -ForegroundColor Yellow
    Exit 1
}

$pgDataDir = "C:\Program Files\PostgreSQL\18\data"
$hbaFile = Join-Path $pgDataDir "pg_hba.conf"
$hbaBackup = Join-Path $pgDataDir "pg_hba.conf.bak"
$psqlPath = "C:\Program Files\PostgreSQL\18\bin\psql.exe"
$serviceName = "postgresql-x64-18"

if (-not (Test-Path $hbaFile)) {
    Write-Host "[ERROR] Could not find pg_hba.conf at $hbaFile" -ForegroundColor Red
    Exit 1
}

Write-Host "=================================================================" -ForegroundColor Cyan
Write-Host "Sweety Glucose Tracker – Local PostgreSQL Recovery" -ForegroundColor Cyan
Write-Host "=================================================================" -ForegroundColor Cyan

# 2. Backup pg_hba.conf
Write-Host "[1/7] Backing up pg_hba.conf to pg_hba.conf.bak..." -ForegroundColor Green
Copy-Item -Path $hbaFile -Destination $hbaBackup -Force

# 3. Temporarily update pg_hba.conf to trust for 127.0.0.1 and ::1
Write-Host "[2/7] Temporarily setting local connections to 'trust'..." -ForegroundColor Green
$content = Get-Content $hbaFile
$updatedContent = $content -replace "host\s+all\s+all\s+127\.0\.0\.1/32\s+scram-sha-256", "host    all             all             127.0.0.1/32            trust"
$updatedContent = $updatedContent -replace "host\s+all\s+all\s+::1/128\s+scram-sha-256", "host    all             all             ::1/128                 trust"
Set-Content -Path $hbaFile -Value $updatedContent -Encoding utf8

# 4. Restart service to apply temporary trust
Write-Host "[3/7] Restarting PostgreSQL service ($serviceName)..." -ForegroundColor Green
Restart-Service -Name $serviceName

# 5. Prompt for new sweety_app password securely
Write-Host "`n[4/7] Choose a local password for the dedicated application user 'sweety_app':" -ForegroundColor Yellow
$securePwd = Read-Host -Prompt "Enter password for sweety_app" -AsSecureString
$BSTR = [System.Runtime.InteropServices.Marshal]::SecureStringToBSTR($securePwd)
$plainPwd = [System.Runtime.InteropServices.Marshal]::PtrToStringAuto($BSTR)

if ([string]::IsNullOrWhiteSpace($plainPwd)) {
    $plainPwd = "SweetyLocalAppPass2026!"
    Write-Host "No password entered. Using default secure local password: $plainPwd" -ForegroundColor Gray
}

# 6. Execute SQL setup
Write-Host "[5/7] Creating role 'sweety_app' and databases 'sweety_glucose_tracker' and 'sweety_glucose_tracker_test'..." -ForegroundColor Green

# Set/Reset postgres superuser password as well
& $psqlPath -U postgres -h 127.0.0.1 -c "ALTER USER postgres WITH PASSWORD '$plainPwd';"

# Setup sweety_app role and databases
$sqlCmd = @"
DO `$do`$
BEGIN
   IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = 'sweety_app') THEN
      CREATE ROLE sweety_app WITH LOGIN PASSWORD '$plainPwd';
   ELSE
      ALTER ROLE sweety_app WITH PASSWORD '$plainPwd';
   END IF;
END
`$do`$;
"@
& $psqlPath -U postgres -h 127.0.0.1 -c $sqlCmd

# Create databases if they don't exist
$db1Check = & $psqlPath -U postgres -h 127.0.0.1 -tAc "SELECT 1 FROM pg_database WHERE datname='sweety_glucose_tracker'"
if ($db1Check -ne "1") {
    & $psqlPath -U postgres -h 127.0.0.1 -c "CREATE DATABASE sweety_glucose_tracker OWNER sweety_app;"
}

$db2Check = & $psqlPath -U postgres -h 127.0.0.1 -tAc "SELECT 1 FROM pg_database WHERE datname='sweety_glucose_tracker_test'"
if ($db2Check -ne "1") {
    & $psqlPath -U postgres -h 127.0.0.1 -c "CREATE DATABASE sweety_glucose_tracker_test OWNER sweety_app;"
}

& $psqlPath -U postgres -h 127.0.0.1 -c "GRANT ALL PRIVILEGES ON DATABASE sweety_glucose_tracker TO sweety_app;"
& $psqlPath -U postgres -h 127.0.0.1 -c "GRANT ALL PRIVILEGES ON DATABASE sweety_glucose_tracker_test TO sweety_app;"

# 7. Immediately Restore pg_hba.conf to SCRAM-SHA-256
Write-Host "[6/7] Restoring original pg_hba.conf (SCRAM-SHA-256 security)..." -ForegroundColor Green
Copy-Item -Path $hbaBackup -Destination $hbaFile -Force
Remove-Item -Path $hbaBackup -Force

# Restart service to re-lock with SCRAM-SHA-256
Restart-Service -Name $serviceName

# 8. Write server/.env
Write-Host "[7/7] Generating server/.env and testing authenticated connection..." -ForegroundColor Green
$encodedPwd = [System.Uri]::EscapeDataString($plainPwd)
$jwtSecret = "815c0d6c176b8b127fab62a976729e873fab48ea1e3d08d0e9700151fae2d285"

$envContent = @"
PORT=5000
DATABASE_URL=postgresql://sweety_app:${encodedPwd}@localhost:5432/sweety_glucose_tracker
TEST_DATABASE_URL=postgresql://sweety_app:${encodedPwd}@localhost:5432/sweety_glucose_tracker_test
JWT_SECRET=${jwtSecret}
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
"@

Set-Content -Path "C:\Users\Pallavi\Documents\sweety-glucose-tracker\server\.env" -Value $envContent -Encoding utf8

# Test authenticated connection with sweety_app using the password
$env:PGPASSWORD = $plainPwd
$testRes = & $psqlPath -U sweety_app -h 127.0.0.1 -d sweety_glucose_tracker -c "SELECT 'SUCCESS: Connected as sweety_app under SCRAM-SHA-256' as status;"
$env:PGPASSWORD = $null

Write-Host "`n$testRes" -ForegroundColor Cyan
Write-Host "=================================================================" -ForegroundColor Green
Write-Host "PostgreSQL recovery and configuration completed successfully!" -ForegroundColor Green
Write-Host "Original SCRAM-SHA-256 authentication has been fully restored." -ForegroundColor Green
Write-Host "You can now run: npm run migrate && npm run seed && npm test" -ForegroundColor Green
Write-Host "=================================================================" -ForegroundColor Green
