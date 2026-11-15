# ==============================================================================
# Sweety Glucose Tracker – Automated Local PostgreSQL Recovery & Setup Script
# ==============================================================================
# Hardened Safety Version (Line-by-line reviewed)
# Requires Administrator Privileges (Run in "Windows PowerShell (Admin)")
# ==============================================================================

# 1. Verify Administrative Privileges
$isAdmin = ([Security.Principal.WindowsPrincipal][Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)
if (-not $isAdmin) {
    Write-Host "[ERROR] This script must be run as Administrator." -ForegroundColor Red
    Write-Host "Please right-click Windows Start, select 'Terminal (Admin)' or 'Windows PowerShell (Admin)', and run this script." -ForegroundColor Yellow
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
Write-Host "Sweety Glucose Tracker – Local PostgreSQL Hardened Setup" -ForegroundColor Cyan
Write-Host "=================================================================" -ForegroundColor Cyan

# 2. Prompt for password securely (never echoed or printed)
$plainPwd = ""
while ([string]::IsNullOrWhiteSpace($plainPwd)) {
    $securePwd = Read-Host -Prompt "Enter a strong local password for the dedicated 'sweety_app' user" -AsSecureString
    $BSTR = [System.Runtime.InteropServices.Marshal]::SecureStringToBSTR($securePwd)
    $plainPwd = [System.Runtime.InteropServices.Marshal]::PtrToStringAuto($BSTR)
    if ([string]::IsNullOrWhiteSpace($plainPwd)) {
        Write-Host "Password cannot be empty. Please enter a valid password." -ForegroundColor Yellow
    }
}

# 3. Backup original pg_hba.conf
Write-Host "`n[1/6] Backing up pg_hba.conf to pg_hba.conf.bak..." -ForegroundColor Green
Copy-Item -Path $hbaFile -Destination $hbaBackup -Force

# Guaranteed restoration in try / finally block
try {
    # 4. Temporarily set trust strictly for 127.0.0.1/32 and ::1/128
    Write-Host "[2/6] Temporarily enabling local loopback trust (127.0.0.1 & ::1 only)..." -ForegroundColor Green
    $content = Get-Content $hbaFile
    $updatedContent = $content -replace "host\s+all\s+all\s+127\.0\.0\.1/32\s+scram-sha-256", "host    all             all             127.0.0.1/32            trust"
    $updatedContent = $updatedContent -replace "host\s+all\s+all\s+::1/128\s+scram-sha-256", "host    all             all             ::1/128                 trust"
    Set-Content -Path $hbaFile -Value $updatedContent -Encoding utf8

    # Restart service for temporary local trust
    Write-Host "[3/6] Reloading PostgreSQL service with temporary local configuration..." -ForegroundColor Green
    Restart-Service -Name $serviceName

    # 5. Create sweety_app role and databases (DO NOT touch postgres superuser account)
    Write-Host "[4/6] Creating application role 'sweety_app' and databases..." -ForegroundColor Green
    
    # Escape single quotes in password for SQL string literal
    $escapedSqlPwd = $plainPwd.Replace("'", "''")

    $setupRoleSql = @"
DO `$do`$
BEGIN
   IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = 'sweety_app') THEN
      CREATE ROLE sweety_app WITH LOGIN PASSWORD '$escapedSqlPwd';
   ELSE
      ALTER ROLE sweety_app WITH PASSWORD '$escapedSqlPwd';
   END IF;
END
`$do`$;
"@
    & $psqlPath -U postgres -h 127.0.0.1 -c $setupRoleSql | Out-Null

    # Create sweety_glucose_tracker if not exists
    $db1Exists = & $psqlPath -U postgres -h 127.0.0.1 -tAc "SELECT 1 FROM pg_database WHERE datname='sweety_glucose_tracker'"
    if ($db1Exists -ne "1") {
        & $psqlPath -U postgres -h 127.0.0.1 -c "CREATE DATABASE sweety_glucose_tracker OWNER sweety_app;" | Out-Null
    }

    # Create sweety_glucose_tracker_test if not exists
    $db2Exists = & $psqlPath -U postgres -h 127.0.0.1 -tAc "SELECT 1 FROM pg_database WHERE datname='sweety_glucose_tracker_test'"
    if ($db2Exists -ne "1") {
        & $psqlPath -U postgres -h 127.0.0.1 -c "CREATE DATABASE sweety_glucose_tracker_test OWNER sweety_app;" | Out-Null
    }

    & $psqlPath -U postgres -h 127.0.0.1 -c "GRANT ALL PRIVILEGES ON DATABASE sweety_glucose_tracker TO sweety_app;" | Out-Null
    & $psqlPath -U postgres -h 127.0.0.1 -c "GRANT ALL PRIVILEGES ON DATABASE sweety_glucose_tracker_test TO sweety_app;" | Out-Null

} finally {
    # 6. ALWAYS RESTORE original pg_hba.conf (SCRAM-SHA-256) even if an error occurred above
    Write-Host "[5/6] Restoring original pg_hba.conf and re-locking with SCRAM-SHA-256..." -ForegroundColor Green
    if (Test-Path $hbaBackup) {
        Copy-Item -Path $hbaBackup -Destination $hbaFile -Force
        Remove-Item -Path $hbaBackup -Force
    }
    Restart-Service -Name $serviceName
}

# 7. Generate fresh local random 256-bit JWT Secret dynamically
Write-Host "[6/6] Generating fresh local JWT secret and writing server/.env..." -ForegroundColor Green
$randomBytes = New-Object byte[] 32
$rng = [System.Security.Cryptography.RandomNumberGenerator]::Create()
$rng.GetBytes($randomBytes)
$jwtSecret = ($randomBytes | ForEach-Object { "{0:x2}" -f $_ }) -join ""

$encodedPwd = [System.Uri]::EscapeDataString($plainPwd)
$envContent = @"
PORT=5000
DATABASE_URL=postgresql://sweety_app:${encodedPwd}@localhost:5432/sweety_glucose_tracker
TEST_DATABASE_URL=postgresql://sweety_app:${encodedPwd}@localhost:5432/sweety_glucose_tracker_test
JWT_SECRET=${jwtSecret}
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
"@

Set-Content -Path "C:\Users\Pallavi\Documents\sweety-glucose-tracker\server\.env" -Value $envContent -Encoding utf8

# 8. VERIFY SCRAM-SHA-256 RESTORATION
Write-Host "`nVerifying security and authentication..." -ForegroundColor Cyan

# Test A: Unauthenticated connection must be REJECTED
$unauthAttempt = & $psqlPath -U sweety_app -h 127.0.0.1 -d sweety_glucose_tracker -w -c "SELECT 1;" 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "[VERIFIED] Passwordless connection rejected: SCRAM-SHA-256 is strictly enforced." -ForegroundColor Green
} else {
    Write-Host "[WARNING] Passwordless connection succeeded. Check pg_hba.conf!" -ForegroundColor Red
}

# Test B: Authenticated connection with sweety_app and password must SUCCEED
$env:PGPASSWORD = $plainPwd
$authAttempt = & $psqlPath -U sweety_app -h 127.0.0.1 -d sweety_glucose_tracker -c "SELECT current_user, current_database();" 2>&1
$authExit = $LASTEXITCODE
$env:PGPASSWORD = $null

if ($authExit -eq 0) {
    Write-Host "[VERIFIED] Authenticated connection as 'sweety_app' succeeded!" -ForegroundColor Green
    Write-Host "=================================================================" -ForegroundColor Green
    Write-Host "SUCCESS: Database setup complete with full SCRAM-SHA-256 enforcement." -ForegroundColor Green
    Write-Host "Next step in normal terminal: npm run migrate && npm run seed && npm test" -ForegroundColor Green
    Write-Host "=================================================================" -ForegroundColor Green
} else {
    Write-Host "[ERROR] Authenticated connection failed. Details:" -ForegroundColor Red
    Write-Host $authAttempt -ForegroundColor Red
}
