use anyhow::{Context, Result};
use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Config {
    /// Stellar Horizon API URL
    pub stellar_horizon_url: String,

    /// Stellar bridge contract address
    pub stellar_bridge_contract: String,

    /// NEAR RPC URL
    pub near_rpc_url: String,

    /// NEAR bridge contract address
    pub near_bridge_contract: String,

    /// Guardian private key (hex-encoded ed25519 key)
    pub guardian_private_key: String,

    /// Poll interval in seconds
    pub poll_interval_secs: u64,
}

impl Config {
    pub fn from_env() -> Result<Self> {
        Ok(Self {
            stellar_horizon_url: std::env::var("STELLAR_HORIZON_URL")
                .unwrap_or_else(|_| "https://horizon-testnet.stellar.org".to_string()),
            
            stellar_bridge_contract: std::env::var("STELLAR_BRIDGE_CONTRACT")
                .context("STELLAR_BRIDGE_CONTRACT not set")?,
            
            near_rpc_url: std::env::var("NEAR_RPC_URL")
                .unwrap_or_else(|_| "https://rpc.testnet.near.org".to_string()),
            
            near_bridge_contract: std::env::var("NEAR_BRIDGE_CONTRACT")
                .context("NEAR_BRIDGE_CONTRACT not set")?,
            
            guardian_private_key: std::env::var("GUARDIAN_PRIVATE_KEY")
                .context("GUARDIAN_PRIVATE_KEY not set")?,
            
            poll_interval_secs: std::env::var("POLL_INTERVAL_SECS")
                .unwrap_or_else(|_| "10".to_string())
                .parse()
                .context("Invalid POLL_INTERVAL_SECS")?,
        })
    }
}
