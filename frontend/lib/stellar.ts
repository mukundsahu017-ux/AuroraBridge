import * as StellarSDK from '@stellar/stellar-sdk';
import { signTransaction } from '@stellar/freighter-api';

export interface BridgeContractClient {
  lock: (params: {
    token: string;
    amount: string;
    recipientChain: number;
    recipient: string;
  }) => Promise<string>;
  release: (vaaBytes: Uint8Array) => Promise<string>;
  getLockNonce: () => Promise<number>;
  isVaaProcessed: (nonce: number) => Promise<boolean>;
}

export class StellarBridgeClient {
  private server: StellarSDK.Horizon.Server;
  private contractId: string;
  private network: 'TESTNET' | 'PUBLIC';

  constructor(contractId: string, network: 'TESTNET' | 'PUBLIC' = 'TESTNET') {
    this.contractId = contractId;
    this.network = network;

    const horizonUrl = network === 'TESTNET'
      ? 'https://horizon-testnet.stellar.org'
      : 'https://horizon.stellar.org';

    this.server = new StellarSDK.Horizon.Server(horizonUrl);
  }

  async lock(
    sourceKeys: StellarSDK.Keypair,
    token: string,
    amount: string,
    recipientChain: number,
    recipient: string
  ): Promise<string> {
    try {
      // Load source account
      const sourceAccount = await this.server.loadAccount(sourceKeys.publicKey());

      // Convert amount to stroop (1 XLM = 10^7 stroops)
      const amountInStroops = BigInt(Math.floor(parseFloat(amount) * 10000000));

      // Convert recipient to bytes (32 bytes)
      const recipientBytes = Buffer.from(recipient.padEnd(64, '0'), 'hex');

      // Build transaction
      const transaction = new StellarSDK.TransactionBuilder(sourceAccount, {
        fee: StellarSDK.BASE_FEE,
        networkPassphrase: this.network === 'TESTNET' 
          ? StellarSDK.Networks.TESTNET 
          : StellarSDK.Networks.PUBLIC,
      })
        .addOperation(
          StellarSDK.Operation.invokeContractFunction({
            contract: this.contractId,
            function: 'lock',
            args: [
              StellarSDK.nativeToScVal(token, { type: 'address' }),
              StellarSDK.nativeToScVal(amountInStroops, { type: 'i128' }),
              StellarSDK.nativeToScVal(recipientChain, { type: 'u32' }),
              StellarSDK.nativeToScVal(Array.from(recipientBytes), { type: 'bytes' }),
            ],
          })
        )
        .setTimeout(30)
        .build();

      // Sign transaction
      transaction.sign(sourceKeys);

      // Submit transaction
      const result = await this.server.submitTransaction(transaction);
      
      return result.hash;
    } catch (error) {
      console.error('Lock transaction failed:', error);
      throw error;
    }
  }

  async lockWithFreighter(
    publicKey: string,
    token: string,
    amount: string,
    recipientChain: number,
    recipient: string
  ): Promise<string> {
    try {
      if (typeof window === 'undefined') {
        throw new Error('Window not available');
      }

      console.log('🔍 Using official Freighter API to sign transaction...');

      // Load source account
      const sourceAccount = await this.server.loadAccount(publicKey);

      // Convert amount to stroop
      const amountInStroops = BigInt(Math.floor(parseFloat(amount) * 10000000));

      // Convert recipient to bytes
      const recipientBytes = Buffer.from(recipient.padEnd(64, '0'), 'hex');

      const networkPassphrase = this.network === 'TESTNET' 
        ? StellarSDK.Networks.TESTNET 
        : StellarSDK.Networks.PUBLIC;

      // Build transaction
      const transaction = new StellarSDK.TransactionBuilder(sourceAccount, {
        fee: StellarSDK.BASE_FEE,
        networkPassphrase,
      })
        .addOperation(
          StellarSDK.Operation.invokeContractFunction({
            contract: this.contractId,
            function: 'lock',
            args: [
              StellarSDK.nativeToScVal(token, { type: 'address' }),
              StellarSDK.nativeToScVal(amountInStroops, { type: 'i128' }),
              StellarSDK.nativeToScVal(recipientChain, { type: 'u32' }),
              StellarSDK.nativeToScVal(Array.from(recipientBytes), { type: 'bytes' }),
            ],
          })
        )
        .setTimeout(30)
        .build();

      console.log('🔐 Requesting signature from Freighter...');

      // Sign with Freighter using official API
      const signResponse = await signTransaction(transaction.toXDR(), {
        networkPassphrase,
        address: publicKey,
      });

      console.log('✅ Sign response:', signResponse);

      if (signResponse.error) {
        throw new Error(`Freighter signing failed: ${signResponse.error}`);
      }

      // Submit signed transaction
      const signedTransaction = StellarSDK.TransactionBuilder.fromXDR(
        signResponse.signedTxXdr,
        networkPassphrase
      );

      console.log('📤 Submitting signed transaction...');
      const result = await this.server.submitTransaction(signedTransaction as StellarSDK.Transaction);
      
      console.log('✅ Transaction submitted:', result.hash);
      return result.hash;
    } catch (error) {
      console.error('❌ Lock with Freighter failed:', error);
      throw error;
    }
  }

  async getLockNonce(): Promise<number> {
    try {
      // Query contract for current nonce
      // This is a simplified version - implement actual Soroban RPC call
      return 0;
    } catch (error) {
      console.error('Failed to get lock nonce:', error);
      throw error;
    }
  }

  async getTransactionStatus(txHash: string): Promise<any> {
    try {
      const transaction = await this.server.transactions().transaction(txHash).call();
      return transaction;
    } catch (error) {
      console.error('Failed to get transaction status:', error);
      throw error;
    }
  }
}

export const createBridgeClient = (
  contractId: string,
  network: 'TESTNET' | 'PUBLIC' = 'TESTNET'
): StellarBridgeClient => {
  return new StellarBridgeClient(contractId, network);
};
