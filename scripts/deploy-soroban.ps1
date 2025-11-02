#!/usr/bin/env pwsh
# Deploy Soroban bridge contract to Stellar testnet

Write-Host "Building Soroban bridge contract..." -ForegroundColor Cyan

# Build the contract
Set-Location contracts/soroban-bridge
cargo build --target wasm32-unknown-unknown --release

if ($LASTEXITCODE -ne 0) {
    Write-Host "Build failed!" -ForegroundColor Red
    exit 1
}

Write-Host "Build successful!" -ForegroundColor Green

# Optimize WASM (optional - requires wasm-opt from binaryen)
$wasmPath = "..\..\target\wasm32-unknown-unknown\release\soroban_bridge.wasm"
if (Get-Command wasm-opt -ErrorAction SilentlyContinue) {
    Write-Host "Optimizing WASM..." -ForegroundColor Cyan
    wasm-opt -Oz $wasmPath -o "${wasmPath}.opt"
    Move-Item "${wasmPath}.opt" $wasmPath -Force
}

Set-Location ..\..

Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "1. Configure Soroban CLI network and identity:"
Write-Host "   soroban config network add --global testnet --rpc-url https://soroban-testnet.stellar.org:443 --network-passphrase 'Test SDF Network ; September 2015'"
Write-Host "   soroban config identity generate --global myidentity"
Write-Host ""
Write-Host "2. Deploy the contract:"
Write-Host "   soroban contract deploy --wasm $wasmPath --network testnet --source myidentity"
Write-Host ""
Write-Host "3. Initialize the contract (save the contract ID from step 2):"
Write-Host "   soroban contract invoke --id <CONTRACT_ID> --network testnet --source myidentity -- initialize --admin <YOUR_ADDRESS> --guardians '[""<GUARDIAN_PUBKEY_HEX>""]' --quorum 1"
