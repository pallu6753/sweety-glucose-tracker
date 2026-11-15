# ==============================================================================
# Sweety Glucose Tracker - Local Environment Setup Script
# ==============================================================================
# Securely creates server/.env with local database credentials and fresh JWT secret
# ==============================================================================

# 1. Prompt for password securely (masked with asterisks)
$plainPwd = ""
while ([string]::IsNullOrWhiteSpace($plainPwd)) {
    $secPwd = Read-Host -Prompt "Enter the password you set for 'sweety_app'" -AsSecureString
    $bstr = [System.Runtime.InteropServices.Marshal]::SecureStringToBSTR($secPwd)
    $plainPwd = [System.Runtime.InteropServices.Marshal]::PtrToStringAuto($bstr)
    if ([string]::IsNullOrWhiteSpace($plainPwd)) {
        Write-Host "Password cannot be empty. Please enter a valid password." -ForegroundColor Yellow
    }
}

# 2. Generate cryptographically secure 256-bit JWT secret locally
$randomBytes = New-Object byte[] 32
$rng = [System.Security.Cryptography.RandomNumberGenerator]::Create()
$rng.GetBytes($randomBytes)
$jwtSecret = ($randomBytes | ForEach-Object { "{0:x2}" -f $_ }) -join ""

# 3. URL-encode password for RFC 3986 URI safety
$encodedPwd = [System.Uri]::EscapeDataString($plainPwd)

$envPath = "C:\Users\Pallavi\Documents\sweety-glucose-tracker\server\.env"

$envContent = @"
PORT=5000
NODE_ENV=development
DATABASE_URL=postgresql://sweety_app:${encodedPwd}@localhost:5432/sweety_glucose_tracker
TEST_DATABASE_URL=postgresql://sweety_app:${encodedPwd}@localhost:5432/sweety_glucose_tracker_test
JWT_SECRET=${jwtSecret}
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
"@

Set-Content -Path $envPath -Value $envContent -Encoding utf8

# 4. Clean memory
$plainPwd = $null
$secPwd = $null
$bstr = [System.IntPtr]::Zero
[System.GC]::Collect()

if (Test-Path $envPath) {
    Write-Host "Configuration complete." -ForegroundColor Green
    Write-Host "Configured variables:" -ForegroundColor Cyan
    Write-Host "- PORT"
    Write-Host "- NODE_ENV"
    Write-Host "- DATABASE_URL"
    Write-Host "- TEST_DATABASE_URL"
    Write-Host "- JWT_SECRET"
    Write-Host "- JWT_EXPIRES_IN"
    Write-Host "- CLIENT_URL"
} else {
    Write-Host "[ERROR] Failed to write server/.env" -ForegroundColor Red
}
