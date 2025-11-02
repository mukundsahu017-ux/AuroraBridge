#!/usr/bin/env pwsh
# Deploy NEAR bridge contract to NEAR testnet

Write-Host "Building NEAR bridge contract..." -ForegroundColor Cyan

Set-Location contracts/near-bridge
cargo build --target wasm32-unknown-unknown --release

if ($LASTEXITCODE -ne 0) {
    Write-Host "Build failed!" -ForegroundColor Red
    exit 1
}

Write-Host "Build successful!" -ForegroundColor Green

$wasmPath = "..\..\target\wasm32-unknown-unknown\release\near_bridge.wasm"

Set-Location ..\..

Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "1. Install NEAR CLI (if not already installed):"
Write-Host "   npm install -g near-cli"
Write-Host ""
Write-Host "2. Login to NEAR testnet:"
Write-Host "   near login"
Write-Host ""
Write-Host "3. Create a contract account:"
Write-Host "   near create-account bridge.YOUR_ACCOUNT.testnet --masterAccount YOUR_ACCOUNT.testnet --initialBalance 10"
Write-Host ""
Write-Host "4. Deploy the contract:"
Write-Host "   near deploy --accountId bridge.YOUR_ACCOUNT.testnet --wasmFile $wasmPath"
Write-Host ""
Write-Host "5. Initialize the contract:"
Write-Host "   near call bridge.YOUR_ACCOUNT.testnet new '{""owner"":""YOUR_ACCOUNT.testnet"",""guardians"":[[1,2,3,...]],""quorum"":1}' --accountId YOUR_ACCOUNT.testnet"
