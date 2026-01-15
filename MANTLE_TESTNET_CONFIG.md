# Mantle Sepolia Testnet Configuration Guide

## Deployed Contracts (Mantle Sepolia Testnet)

### Chain Information
- **Chain ID**: 5003
- **RPC URL**: https://rpc.sepolia.mantle.xyz
- **Block Explorer**: https://explorer.sepolia.mantle.xyz
- **Native Currency**: MNT (18 decimals)

### Contract Addresses

1. **CommunityYieldPool**
   - Address: `0x99E1e7aFddd4380Ea510B0e16C27B0df93C809db`
   - Purpose: Main yield pool contract

2. **StableToken (mUSD)**
   - Address: `0xd6ab42c85DA47FD1ccCc5A8A4c109157bc16b5a2`
   - Name: MockUSD
   - Symbol: mUSD
   - Decimals: 18
   - Purpose: Staking token

3. **RewardToken (RT)**
   - Address: `0x3E90F36A70eE6A2C4D4133d4ED5B62E06Ae2a5b5`
   - Name: RewardToken
   - Symbol: RT
   - Purpose: Reward distribution token

### Contract Parameters

```json
{
  "stakingToken": "0xd6ab42c85DA47FD1ccCc5A8A4c109157bc16b5a2",
  "rewardToken": "0x3E90F36A70eE6A2C4D4133d4ED5B62E06Ae2a5b5",
  "rewardRate": "100000000000000000",
  "penaltyBps": 500,
  "maxLock": 2592000,
  "boostMaxE18": "2000000000000000000"
}
```

**Parameter Details:**
- **rewardRate**: 0.1 per second (in wei, E18 precision)
- **penaltyBps**: 500 basis points = 5% penalty for early withdrawal
- **maxLock**: 2,592,000 seconds = 30 days maximum lock period
- **boostMaxE18**: 2x multiplier for rewards (2 in E18)

## Frontend Setup

All configuration is handled automatically through environment variables in the `.env` file. The frontend will:

1. **Automatically add Mantle Testnet** to MetaMask on first connection
2. **Load contract addresses** from environment variables
3. **Use correct RPC URL** for blockchain interactions

### Environment File (.env)

The `.env` file contains all necessary configuration:
- Network chain ID and RPC URL
- Contract addresses
- Contract parameters for reference

### Key Frontend Components

1. **Web3Context** (`src/context/Web3Context.tsx`)
   - Manages wallet connection
   - Automatically switches to Mantle Testnet
   - Adds network to MetaMask if not present

2. **Constants** (`src/utils/constants.ts`)
   - Exports all contract addresses
   - Exports network configuration
   - Contains Mantle Testnet metadata

3. **Dashboard** (`src/components/Dashboard.tsx`)
   - Displays pool statistics
   - Shows user stakes and rewards
   - Fetches data from smart contracts

4. **DepositForm** (`src/components/DepositForm.tsx`)
   - Allows users to deposit stablecoins
   - Set lock periods
   - Approval and transaction handling

5. **WithdrawForm** (`src/components/WithdrawForm.tsx`)
   - Allows users to withdraw
   - Shows penalty calculations
   - Handles early withdrawal penalties

## How to Use

### 1. Install Dependencies
```bash
npm install --legacy-peer-deps
```

### 2. Start Development Server
```bash
npm run dev
```
The application will open at `http://localhost:5173`

### 3. Connect MetaMask
- Click "Connect Wallet"
- MetaMask will prompt to add Mantle Testnet (if not already added)
- Approve the connection

### 4. Get Test Tokens
To interact with the protocol:
1. Get some MNT tokens from [Mantle Testnet Faucet](https://faucet.testnet.mantle.xyz)
2. The mUSD tokens are already minted to accounts in the deployed contract
3. If needed, you can mint more through the StableToken contract

### 5. Deposit and Earn
- Click "Deposit Tokens"
- Enter amount and lock duration
- Approve the token spending
- Confirm transaction
- View your rewards accumulating in the dashboard

## Troubleshooting

### MetaMask Network Not Switching
- Clear your browser cache
- Remove the added network from MetaMask settings and reconnect
- Make sure you have MNT for gas fees

### Transaction Failures
- Ensure you have MNT tokens for gas
- Check that you have sufficient mUSD balance
- Verify contract approval

### Contract Interaction Errors
- Confirm your MetaMask is on Mantle Testnet (Chain ID: 5003)
- Check block explorer: https://explorer.testnet.mantle.xyz
- Verify contract addresses match the .env file

## Links

- [Mantle Testnet Faucet](https://faucet.testnet.mantle.xyz)
- [Mantle Block Explorer](https://explorer.testnet.mantle.xyz)
- [Mantle Documentation](https://docs.mantle.xyz)
- [MetaMask Documentation](https://docs.metamask.io)

## Development Commands

```bash
# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```
