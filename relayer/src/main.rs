use anyhow::{Context, Result};
use bridge_shared::{ChainId, VAA};
use ed25519_dalek::{Signer, SigningKey};
use serde::{Deserialize, Serialize};
use std::time::{SystemTime, UNIX_EPOCH};
use tokio::time::{sleep, Duration};
use tracing::{error, info};

mod config;
mod horizon_client;
mod near_client;

use config::Config;
use horizon_client::HorizonClient;
use near_client::NearClient;

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct LockEvent {
    pub event_type: String,
    pub asset: String,
    pub amount: u128,
    pub sender: String,
    pub recipient_chain: u8,
    pub recipient: [u8; 32],
    pub nonce: u64,
    pub timestamp: u64,
}

pub struct Relayer {
    config: Config,
    guardian_key: SigningKey,
    horizon_client: HorizonClient,
    near_client: NearClient,
}

impl Relayer {
    pub fn new(config: Config) -> Result<Self> {
        // Load guardian signing key
        let key_bytes = hex::decode(&config.guardian_private_key)
            .context("Failed to decode guardian private key")?;
        let guardian_key = SigningKey::from_bytes(
            &key_bytes.try_into()
                .map_err(|_| anyhow::anyhow!("Invalid key length"))?
        );

        let horizon_client = HorizonClient::new(&config.stellar_horizon_url);
        let near_client = NearClient::new(&config.near_rpc_url);

        Ok(Self {
            config,
            guardian_key,
            horizon_client,
            near_client,
        })
    }

    pub async fn run(&self) -> Result<()> {
        info!("Starting bridge relayer...");
        info!("Monitoring Stellar bridge: {}", self.config.stellar_bridge_contract);
        info!("Monitoring NEAR bridge: {}", self.config.near_bridge_contract);

        let mut last_stellar_cursor = "now".to_string();
        let mut last_near_block = 0u64;

        loop {
            // Poll Stellar for lock events
            match self
                .poll_stellar_locks(&mut last_stellar_cursor)
                .await
            {
                Ok(count) => {
                    if count > 0 {
                        info!("Processed {} Stellar lock events", count);
                    }
                }
                Err(e) => {
                    error!("Error polling Stellar: {}", e);
                }
            }

            // Poll NEAR for burn events
            match self.poll_near_burns(&mut last_near_block).await {
                Ok(count) => {
                    if count > 0 {
                        info!("Processed {} NEAR burn events", count);
                    }
                }
                Err(e) => {
                    error!("Error polling NEAR: {}", e);
                }
            }

            // Sleep before next poll
            sleep(Duration::from_secs(self.config.poll_interval_secs)).await;
        }
    }

    async fn poll_stellar_locks(&self, cursor: &mut String) -> Result<usize> {
        let events = self
            .horizon_client
            .get_contract_events(&self.config.stellar_bridge_contract, cursor)
            .await?;

        let mut count = 0;
        for event in events {
            if event.event_type == "lock" {
                info!("Detected Stellar lock event: nonce={}", event.nonce);

                // Create VAA
                let vaa = self.create_vaa_from_stellar_lock(&event)?;

                // Submit to NEAR
                match self.submit_vaa_to_near(&vaa).await {
                    Ok(_) => {
                        info!("Successfully submitted VAA to NEAR for nonce {}", event.nonce);
                        count += 1;
                    }
                    Err(e) => {
                        error!("Failed to submit VAA to NEAR: {}", e);
                    }
                }
            }
        }

        Ok(count)
    }

    async fn poll_near_burns(&self, last_block: &mut u64) -> Result<usize> {
        let events = self
            .near_client
            .get_burn_events(&self.config.near_bridge_contract, *last_block)
            .await?;

        let mut count = 0;
        for event in events {
            info!("Detected NEAR burn event");

            // Create VAA
            let vaa = self.create_vaa_from_near_burn(&event)?;

            // Submit to Stellar
            match self.submit_vaa_to_stellar(&vaa).await {
                Ok(_) => {
                    info!("Successfully submitted VAA to Stellar");
                    count += 1;
                }
                Err(e) => {
                    error!("Failed to submit VAA to Stellar: {}", e);
                }
            }
        }

        Ok(count)
    }

    fn create_vaa_from_stellar_lock(&self, event: &LockEvent) -> Result<VAA> {
        let origin_contract = hex::decode(&self.config.stellar_bridge_contract)
            .context("Invalid Stellar contract address")?;
        let destination_contract = hex::decode(&self.config.near_bridge_contract)
            .context("Invalid NEAR contract address")?;

        // Parse asset ID
        let asset_bytes = hex::decode(&event.asset).unwrap_or_else(|_| vec![0u8; 32]);
        let mut asset_id = [0u8; 32];
        asset_id[..asset_bytes.len().min(32)].copy_from_slice(&asset_bytes[..asset_bytes.len().min(32)]);

        let mut origin = [0u8; 32];
        origin[..origin_contract.len().min(32)].copy_from_slice(&origin_contract[..origin_contract.len().min(32)]);

        let mut destination = [0u8; 32];
        destination[..destination_contract.len().min(32)].copy_from_slice(&destination_contract[..destination_contract.len().min(32)]);

        let mut vaa = VAA::new(
            ChainId::Stellar,
            origin,
            ChainId::Near,
            destination,
            asset_id,
            event.amount,
            event.recipient,
            event.nonce,
            event.timestamp,
        );

        // Sign VAA
        let digest = vaa.digest();
        let signature = self.guardian_key.sign(&digest);
        let guardian_pubkey = self.guardian_key.verifying_key().to_bytes();

        vaa.add_signature(guardian_pubkey, signature.to_bytes());

        Ok(vaa)
    }

    fn create_vaa_from_near_burn(&self, event: &LockEvent) -> Result<VAA> {
        // Similar to stellar lock but reversed direction
        let origin_contract = hex::decode(&self.config.near_bridge_contract)
            .context("Invalid NEAR contract address")?;
        let destination_contract = hex::decode(&self.config.stellar_bridge_contract)
            .context("Invalid Stellar contract address")?;

        let mut asset_id = [0u8; 32];
        let asset_bytes = event.asset.as_bytes();
        asset_id[..asset_bytes.len().min(32)].copy_from_slice(&asset_bytes[..asset_bytes.len().min(32)]);

        let mut origin = [0u8; 32];
        origin[..origin_contract.len().min(32)].copy_from_slice(&origin_contract[..origin_contract.len().min(32)]);

        let mut destination = [0u8; 32];
        destination[..destination_contract.len().min(32)].copy_from_slice(&destination_contract[..destination_contract.len().min(32)]);

        let timestamp = SystemTime::now()
            .duration_since(UNIX_EPOCH)?
            .as_secs();

        let mut vaa = VAA::new(
            ChainId::Near,
            origin,
            ChainId::Stellar,
            destination,
            asset_id,
            event.amount,
            event.recipient,
            event.nonce,
            timestamp,
        );

        // Sign
        let digest = vaa.digest();
        let signature = self.guardian_key.sign(&digest);
        let guardian_pubkey = self.guardian_key.verifying_key().to_bytes();

        vaa.add_signature(guardian_pubkey, signature.to_bytes());

        Ok(vaa)
    }

    async fn submit_vaa_to_near(&self, vaa: &VAA) -> Result<()> {
        let vaa_json = serde_json::to_string(vaa)?;
        self.near_client
            .call_mint_wrapped(&self.config.near_bridge_contract, vaa_json)
            .await
    }

    async fn submit_vaa_to_stellar(&self, vaa: &VAA) -> Result<()> {
        let vaa_bytes = vaa.to_bytes()?;
        self.horizon_client
            .call_release(&self.config.stellar_bridge_contract, vaa_bytes)
            .await
    }
}

#[tokio::main]
async fn main() -> Result<()> {
    // Initialize logging
    tracing_subscriber::fmt::init();

    // Load config
    dotenv::dotenv().ok();
    let config = Config::from_env()?;

    // Create and run relayer
    let relayer = Relayer::new(config)?;
    relayer.run().await
}
