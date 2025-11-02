#!/bin/bash

# Stellar Bridge Contract Initialization Script
# This script initializes the deployed bridge contract with admin and guardians

CONTRACT_ID="CBP2ON6K7NOKOW4RDBNNXPFMIIMTMAUUS2EKZE7FFQQDDV5K7PINBDBR"
ADMIN_IDENTITY="bridge-deployer"
NETWORK="testnet"

echo "Initializing Stellar Bridge Contract..."
echo "Contract ID: $CONTRACT_ID"
echo "Admin: $ADMIN_IDENTITY"

# Get admin address
ADMIN_ADDRESS=$(stellar keys address $ADMIN_IDENTITY)
echo "Admin Address: $ADMIN_ADDRESS"

# For demo purposes, using the same key as guardian
# In production, use separate guardian keys
GUARDIAN1="0000000000000000000000000000000000000000000000000000000000000001"
GUARDIAN2="0000000000000000000000000000000000000000000000000000000000000002"

echo "Initializing contract..."

stellar contract invoke \
  --id $CONTRACT_ID \
  --source $ADMIN_IDENTITY \
  --network $NETWORK \
  -- \
  initialize \
  --admin $ADMIN_ADDRESS \
  --guardians "[\"$GUARDIAN1\", \"$GUARDIAN2\"]" \
  --quorum 2

echo "✅ Contract initialized successfully!"
echo "Contract Explorer: https://stellar.expert/explorer/testnet/contract/$CONTRACT_ID"
