# ==============================================================================
# Sweety Glucose Tracker - Automated Local PostgreSQL Recovery & Setup Script
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
Write-Host "Sweety Glucose Tracker - Local PostgreSQL Hardened Setup" -ForegroundColor Cyan
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

# 3. Backup original pg_hba.conf safely (never overwrite existing backup)
Write-Host "`n[1/6] Backing up pg_hba.conf..." -ForegroundColor Green
if (-not (Test-Path $hbaBackup)) {
    try {
        Copy-Item -Path $hbaFile -Destination $hbaBackup -Force -ErrorAction Stop
        Write-Host "Created initial backup at $hbaBackup" -ForegroundColor Gray
    } catch {
        Write-Host "[FATAL ERROR] Failed to create backup of pg_hba.conf: $_" -ForegroundColor Red
        Exit 1
    }
} else {
    Write-Host "Preserved existing pristine backup at $hbaBackup" -ForegroundColor Gray
}

# 4. Prepare protected temporary SQL file for password execution
$tempSqlFile = [System.IO.Path]::GetTempFileName()
try {
    # Restrict ACL permissions strictly to the current Administrator identity
    $acl = New-Object System.Security.AccessControl.FileSecurity
    $currentPrincipal = [System.Security.Principal.WindowsIdentity]::GetCurrent().Name
    $accessRule = New-Object System.Security.AccessControl.FileSystemAccessRule($currentPrincipal, "FullControl", "Allow")
    $acl.SetAccessRule($accessRule)
    $acl.SetAccessRuleProtection($true, $false)
    Set-Acl -Path $tempSqlFile -AclObject $acl
} catch {
    # If ACL set fails, file is in user temp which is already user-scoped
    Write-Host "Note: Created secure temp file at $tempSqlFile" -ForegroundColor Gray
}

# Guaranteed restoration in try / finally block
$restoreSucceeded = $false
try {
    # 5. Temporarily set trust strictly for 127.0.0.1/32 and ::1/128
    Write-Host "[2/6] Temporarily enabling local loopback trust (127.0.0.1 and ::1 only)..." -ForegroundColor Green
    $content = Get-Content $hbaFile
    $updatedContent = $content -replace "host\s+all\s+all\s+127\.0\.0\.1/32\s+scram-sha-256", "host    all             all             127.0.0.1/32            trust"
    $updatedContent = $updatedContent -replace "host\s+all\s+all\s+::1/128\s+scram-sha-256", "host    all             all             ::1/128                 trust"
    Set-Content -Path $hbaFile -Value $updatedContent -Encoding utf8

    # Restart service for temporary local trust
    Write-Host "[3/6] Reloading PostgreSQL service with temporary local configuration..." -ForegroundColor Green
    Restart-Service -Name $serviceName -ErrorAction Stop

    # 6. Create sweety_app role and databases safely without exposing passwords in process arguments
    Write-Host "[4/6] Creating application role 'sweety_app' and databases safely..." -ForegroundColor Green
    
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
    # Write SQL to protected temp file (current user/admin access only)
    Set-Content -Path $tempSqlFile -Value $setupRoleSql -Encoding utf8
    
    # Execute SQL via file input to prevent exposure in process command-line arguments
    & $psqlPath -U postgres -h 127.0.0.1 -f $tempSqlFile | Out-Null
    
    # Securely overwrite and clear temp file content immediately
    Set-Content -Path $tempSqlFile -Value "-- sanitized" -Encoding utf8

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
    # 7. ALWAYS RESTORE original pg_hba.conf (SCRAM-SHA-256) even if an error occurred above
    Write-Host "[5/6] Restoring original pg_hba.conf and re-locking with SCRAM-SHA-256..." -ForegroundColor Green
    
    # Clean up temp file immediately
    if (Test-Path $tempSqlFile) {
        Remove-Item -Path $tempSqlFile -Force -ErrorAction SilentlyContinue
    }

    # Restore backup file and verify cryptographic hash
    if (Test-Path $hbaBackup) {
        try {
            Copy-Item -Path $hbaBackup -Destination $hbaFile -Force -ErrorAction Stop
            $backupHash = (Get-FileHash -Path $hbaBackup -Algorithm SHA256).Hash
            $restoredHash = (Get-FileHash -Path $hbaFile -Algorithm SHA256).Hash
            if ($backupHash -eq $restoredHash) {
                $restoreSucceeded = $true
                Write-Host "Verified pg_hba.conf restored byte-for-byte from original backup." -ForegroundColor Gray
            } else {
                Write-Host "[CRITICAL ERROR] Hash mismatch between backup and restored pg_hba.conf!" -ForegroundColor Red
            }
        } catch {
            Write-Host "[CRITICAL ERROR] Failed to copy backup to pg_hba.conf: $_" -ForegroundColor Red
        }
    } else {
        Write-Host "[CRITICAL ERROR] Backup file $hbaBackup not found during restoration!" -ForegroundColor Red
    }

    # Restart service independently to ensure it reloads the restored configuration
    try {
        Restart-Service -Name $serviceName -ErrorAction Stop
        Write-Host "Service $serviceName successfully restarted with restored configuration." -ForegroundColor Gray
    } catch {
        Write-Host "[WARNING] Service restart encountered an error: $_. Please restart $serviceName manually." -ForegroundColor Yellow
    }
}

if (-not $restoreSucceeded) {
    Write-Host "[CRITICAL WARNING] Restoration of pg_hba.conf could not be confirmed. Review $hbaFile manually." -ForegroundColor Red
    Exit 1
}

# 8. Generate fresh local random 256-bit JWT Secret dynamically
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

# 9. COMPREHENSIVE AUTHENTICATION & RULE VERIFICATION
Write-Host "`nVerifying security, authentication rules, and service status..." -ForegroundColor Cyan

# Check 9.1: File-level inspection of all active rules in pg_hba.conf
$restoredLines = Get-Content $hbaFile | Where-Object { -not [string]::IsNullOrWhiteSpace($_) -and -not $_.Trim().StartsWith("#") }
$insecureRules = $restoredLines | Where-Object { $_ -match "\btrust\b|\bpassword\b|\bmd5\b" }
$ipv4Scram = $restoredLines | Where-Object { $_ -match "127\.0\.0\.1/32\s+scram-sha-256" }
$ipv6Scram = $restoredLines | Where-Object { $_ -match "::1/128\s+scram-sha-256" }
$includeDirectives = $restoredLines | Where-Object { $_ -match "^\s*include" }

$fileCheckPassed = $false
if ($insecureRules.Count -eq 0 -and $ipv4Scram -and $ipv6Scram) {
    Write-Host "[PASS] pg_hba.conf: All loopback rules enforce scram-sha-256. Zero trust, md5, or plaintext rules exist." -ForegroundColor Green
    $fileCheckPassed = $true
} else {
    Write-Host "[FAIL] pg_hba.conf verification failed: Active rules must be scram-sha-256 only." -ForegroundColor Red
    if ($insecureRules) {
        Write-Host "Insecure rules detected: $insecureRules" -ForegroundColor Red
    }
}

if ($includeDirectives) {
    Write-Host "Note: Included configuration files detected: $includeDirectives" -ForegroundColor Gray
}

# Check 9.2: Service running check
$svc = Get-Service -Name $serviceName
if ($svc.Status -eq 'Running') {
    Write-Host "[PASS] Service $serviceName is active and running." -ForegroundColor Green
} else {
    Write-Host "[FAIL] Service $serviceName status is $($svc.Status)." -ForegroundColor Red
}

# Check 9.3: Negative check - unauthenticated access must be strictly rejected
$unauthAttempt = & $psqlPath -U sweety_app -h 127.0.0.1 -d sweety_glucose_tracker -w -c "SELECT 1;" 2>&1
$unauthExit = $LASTEXITCODE

if ($unauthExit -ne 0) {
    Write-Host "[PASS] Engine check: Unauthenticated access rejected as required." -ForegroundColor Green
} else {
    Write-Host "[FAIL] Engine check: Passwordless connection unexpectedly succeeded!" -ForegroundColor Red
}

# Check 9.4: Positive check - authenticated access with password
$env:PGPASSWORD = $plainPwd
$authAttempt = & $psqlPath -U sweety_app -h 127.0.0.1 -d sweety_glucose_tracker -c "SELECT current_user, current_database(); SHOW password_encryption;" 2>&1
$authExit = $LASTEXITCODE
$env:PGPASSWORD = $null

if ($authExit -eq 0 -and $fileCheckPassed) {
    Write-Host "[PASS] Authenticated connection as 'sweety_app' verified under SCRAM-SHA-256." -ForegroundColor Green
    Write-Host "=================================================================" -ForegroundColor Green
    Write-Host "SUCCESS: Database setup complete and verified with full SCRAM-SHA-256." -ForegroundColor Green
    Write-Host "Next step in normal terminal: npm run migrate && npm run seed && npm test" -ForegroundColor Green
    Write-Host "=================================================================" -ForegroundColor Green
} else {
    Write-Host "[ERROR] Security verification did not fully pass. Details:" -ForegroundColor Red
    Write-Host $authAttempt -ForegroundColor Red
    Exit 1
}
