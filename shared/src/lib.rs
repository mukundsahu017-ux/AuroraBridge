use serde::{Deserialize, Serialize};
use sha2::{Digest, Sha256};
use serde_with::serde_as;

/// Chain identifiers for cross-chain messaging
#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize)]
#[repr(u8)]
pub enum ChainId {
    Stellar = 1,
    Near = 2,
}

/// Verified Authenticated Action (VAA) - cross-chain message format
/// Based on Wormhole VAA design but simplified for this bridge
#[serde_as]
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct VAA {
    /// Version of the VAA format
    pub version: u8,
    
    /// Origin chain where the lock event happened
    pub origin_chain: ChainId,
    
    /// Origin contract address (32 bytes, padded if needed)
    pub origin_contract: [u8; 32],
    
    /// Destination chain where tokens will be released/minted
    pub destination_chain: ChainId,
    
    /// Destination contract address
    pub destination_contract: [u8; 32],
    
    /// Asset identifier (hash or address)
    pub asset_id: [u8; 32],
    
    /// Amount to transfer (as u128 to support large decimals)
    pub amount: u128,
    
    /// Recipient address on destination chain
    pub recipient: [u8; 32],
    
    /// Nonce for replay protection (unique per lock event)
    pub nonce: u64,
    
    /// Timestamp of the lock event (unix epoch seconds)
    pub timestamp: u64,
    
    /// Guardian signatures (pubkey + signature pairs)
    pub signatures: Vec<Signature>,
}

#[serde_as]
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Signature {
    /// Guardian public key (ed25519, 32 bytes)
    pub guardian_pubkey: [u8; 32],
    
    /// Signature (ed25519, 64 bytes)
    #[serde_as(as = "serde_with::hex::Hex")]
    pub signature: [u8; 64],
}

impl VAA {
    /// Create a new VAA (before signing)
    pub fn new(
        origin_chain: ChainId,
        origin_contract: [u8; 32],
        destination_chain: ChainId,
        destination_contract: [u8; 32],
        asset_id: [u8; 32],
        amount: u128,
        recipient: [u8; 32],
        nonce: u64,
        timestamp: u64,
    ) -> Self {
        Self {
            version: 1,
            origin_chain,
            origin_contract,
            destination_chain,
            destination_contract,
            asset_id,
            amount,
            recipient,
            nonce,
            timestamp,
            signatures: Vec::new(),
        }
    }

    /// Compute the hash that guardians will sign (message digest)
    pub fn digest(&self) -> [u8; 32] {
        let mut hasher = Sha256::new();
        
        hasher.update([self.version]);
        hasher.update([self.origin_chain as u8]);
        hasher.update(self.origin_contract);
        hasher.update([self.destination_chain as u8]);
        hasher.update(self.destination_contract);
        hasher.update(self.asset_id);
        hasher.update(self.amount.to_be_bytes());
        hasher.update(self.recipient);
        hasher.update(self.nonce.to_be_bytes());
        hasher.update(self.timestamp.to_be_bytes());
        
        hasher.finalize().into()
    }

    /// Add a guardian signature
    pub fn add_signature(&mut self, guardian_pubkey: [u8; 32], signature: [u8; 64]) {
        self.signatures.push(Signature {
            guardian_pubkey,
            signature,
        });
    }

    /// Serialize to bytes
    pub fn to_bytes(&self) -> Result<Vec<u8>, serde_json::Error> {
        serde_json::to_vec(self)
    }

    /// Deserialize from bytes
    pub fn from_bytes(data: &[u8]) -> Result<Self, serde_json::Error> {
        serde_json::from_slice(data)
    }

    /// Verify signatures against a set of authorized guardian public keys
    /// Returns true if enough valid signatures (meets quorum)
    pub fn verify_signatures(&self, authorized_guardians: &[[u8; 32]], quorum: usize) -> bool {
        use ed25519_dalek::{Signature as Ed25519Sig, Verifier, VerifyingKey};

        if self.signatures.len() < quorum {
            return false;
        }

        let digest = self.digest();
        let mut valid_count = 0;

        for sig in &self.signatures {
            // Check if this guardian is authorized
            if !authorized_guardians.contains(&sig.guardian_pubkey) {
                continue;
            }

            // Verify the signature
            if let Ok(pubkey) = VerifyingKey::from_bytes(&sig.guardian_pubkey) {
                let signature = Ed25519Sig::from_bytes(&sig.signature);
                if pubkey.verify(&digest, &signature).is_ok() {
                    valid_count += 1;
                }
            }
        }

        valid_count >= quorum
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_vaa_digest() {
        let vaa = VAA::new(
            ChainId::Stellar,
            [1u8; 32],
            ChainId::Near,
            [2u8; 32],
            [3u8; 32],
            1000u128,
            [4u8; 32],
            1,
            1234567890,
        );

        let digest = vaa.digest();
        assert_eq!(digest.len(), 32);
        
        // Digest should be deterministic
        let digest2 = vaa.digest();
        assert_eq!(digest, digest2);
    }

    #[test]
    fn test_vaa_serialization() {
        let vaa = VAA::new(
            ChainId::Stellar,
            [1u8; 32],
            ChainId::Near,
            [2u8; 32],
            [3u8; 32],
            1000u128,
            [4u8; 32],
            1,
            1234567890,
        );

        let bytes = vaa.to_bytes().unwrap();
        let decoded = VAA::from_bytes(&bytes).unwrap();

        assert_eq!(vaa.nonce, decoded.nonce);
        assert_eq!(vaa.amount, decoded.amount);
    }
}
