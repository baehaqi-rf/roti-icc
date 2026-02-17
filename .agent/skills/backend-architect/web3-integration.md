---
name: web3-blockchain-integrator
description: Integrates blockchain and Web3 features (wallet connection, smart contracts, NFTs, cryptocurrency payments) into web applications. Covers Ethereum, Polygon, Solana, and wallet providers. Use when building dApps, NFT marketplaces, or crypto payment systems.
---

# Web3 Blockchain Integrator

## Wallet Connection

**Popular Providers:**
- MetaMask (most popular)
- WalletConnect (mobile wallets)
- Coinbase Wallet
- RainbowKit (React library for multi-wallet)

**Basic Integration (ethers.js):**
```typescript
import { ethers } from 'ethers';

async function connectWallet() {
  if (!window.ethereum) {
    alert('Please install MetaMask');
    return;
  }

  // Request account access
  const accounts = await window.ethereum.request({
    method: 'eth_requestAccounts'
  });

  // Create provider
  const provider = new ethers.BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();
  const address = await signer.getAddress();

  console.log('Connected:', address);
  return { provider, signer, address };
}
```

**RainbowKit (Recommended):**
```typescript
import { ConnectButton } from '@rainbow-me/rainbowkit';

function App() {
  return <ConnectButton />;
}
```

## Smart Contract Interaction

**Read Contract (Free):**
```typescript
const contractAddress = '0x...';
const abi = [ /* ABI from compiled contract */ ];

const contract = new ethers.Contract(contractAddress, abi, provider);

// Read data (no gas cost)
const balance = await contract.balanceOf(userAddress);
console.log('Balance:', ethers.formatEther(balance));
```

**Write Contract (Requires Gas):**
```typescript
const contractWithSigner = contract.connect(signer);

// Send transaction
const tx = await contractWithSigner.transfer(recipientAddress, amount);
console.log('Transaction sent:', tx.hash);

// Wait for confirmation
await tx.wait();
console.log('Transaction confirmed!');
```

## NFT Features

**Mint NFT:**
```typescript
async function mintNFT(tokenURI: string) {
  const contract = new ethers.Contract(nftAddress, nftABI, signer);
  const tx = await contract.mint(tokenURI, { 
    value: ethers.parseEther('0.01') 
  });
  await tx.wait();
  return tx.hash;
}
```

**Display NFT (IPFS):**
```typescript
async function fetchNFTMetadata(tokenId: number) {
  const contract = new ethers.Contract(nftAddress, nftABI, provider);
  const tokenURI = await contract.tokenURI(tokenId);
  
  // Fetch from IPFS
  const response = await fetch(
    tokenURI.replace('ipfs://', 'https://ipfs.io/ipfs/')
  );
  const metadata = await response.json();
  
  return {
    name: metadata.name,
    image: metadata.image.replace('ipfs://', 'https://ipfs.io/ipfs/'),
    attributes: metadata.attributes,
  };
}
```

## Cryptocurrency Payments

**Accept ETH:**
```typescript
async function requestPayment(amount: string, recipient: string) {
  const tx = await signer.sendTransaction({
    to: recipient,
    value: ethers.parseEther(amount), // e.g., '0.1' ETH
  });

  await tx.wait();
  return tx.hash;
}
```

**Accept ERC-20 Tokens (USDC):**
```typescript
const tokenContract = new ethers.Contract(tokenAddress, erc20ABI, signer);

// 1. Approve spending
const approveTx = await tokenContract.approve(
  spenderAddress,
  ethers.parseUnits(amount, 6) // USDC has 6 decimals
);
await approveTx.wait();

// 2. Transfer
const transferTx = await tokenContract.transfer(
  recipientAddress,
  ethers.parseUnits(amount, 6)
);
await transferTx.wait();
```

## Multi-Chain Support

**Switch Networks:**
```typescript
async function switchToPolygon() {
  try {
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: '0x89' }], // Polygon Mainnet
    });
  } catch (error) {
    // Chain not added, add it
    await window.ethereum.request({
      method: 'wallet_addEthereumChain',
      params: [{
        chainId: '0x89',
        chainName: 'Polygon Mainnet',
        rpcUrls: ['https://polygon-rpc.com/'],
        nativeCurrency: { 
          name: 'MATIC', 
          symbol: 'MATIC', 
          decimals: 18 
        },
        blockExplorerUrls: ['https://polygonscan.com/'],
      }],
    });
  }
}
```

## Gas Optimization

**Estimate Gas:**
```typescript
const gasEstimate = await contract.transfer.estimateGas(recipient, amount);
const gasPrice = await provider.getFeeData();

const estimatedCost = gasEstimate * gasPrice.gasPrice;
console.log('Estimated cost:', ethers.formatEther(estimatedCost), 'ETH');
```

**Use Layer 2:**
- Polygon, Arbitrum, Optimism
- ~100x cheaper gas fees
- Faster confirmations

## Security Best Practices

**Never Expose Private Keys:**
- Use wallet providers (MetaMask) for signing
- Backend should never handle user private keys

**Verify Contract Addresses:**
- Hardcode contract addresses
- Verify on Etherscan before interaction

**Validate Transactions:**
```typescript
// Show user what they're signing
const txDetails = {
  to: recipient,
  value: ethers.formatEther(amount),
  gasLimit: gasEstimate.toString(),
};
console.log('Please review:', txDetails);
```

## Testing

**Local Blockchain (Hardhat):**
```bash
# Start local node
npx hardhat node

# Deploy contracts
npx hardhat run scripts/deploy.js --network localhost
```

**Testnets:**
- Sepolia (Ethereum testnet)
- Mumbai (Polygon testnet)
- Get free test ETH from faucets

## Common Patterns

**Wallet Connection Hook:**
```typescript
import { useState, useEffect } from 'react';

export function useWallet() {
  const [address, setAddress] = useState<string | null>(null);

  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.request({ method: 'eth_accounts' })
        .then((accounts) => setAddress(accounts[0]));
    }
  }, []);

  return { address };
}
```

## Anti-Patterns

❌ Storing private keys in code/database
❌ No error handling for failed transactions
❌ Not handling network switches
❌ Ignoring gas costs
❌ No loading states (blockchain is slow)
❌ Trusting contract data without validation
❌ No user confirmation before transactions
